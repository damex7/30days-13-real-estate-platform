import { ArrowRight, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";
import { ListingGrid } from "@/components/listing-grid";
import { formatAmount, formatNumber } from "@/lib/format";
import {
  areaStats,
  areasFor,
  countListingsInState,
  listingsInArea,
  statesFor,
  type AreaEntry,
} from "@/lib/locations";
import type { Option } from "@/lib/search-params";
import { areaGuidePath, locationPath } from "@/lib/urls";

// [[...path]] is an OPTIONAL catch-all segment. It matches any number of
// segments, including none, so this one file serves three pages:
//   /areas              → params.path is undefined   → list of states
//   /areas/lagos        → params.path is ["lagos"]    → areas in Lagos
//   /areas/lagos/yaba   → params.path is ["lagos", "yaba"] → one area guide
//
// A plain catch-all, [...path], needs at least one segment, so /areas would not
// match it. Use [...path] when the bare URL is a different page (its own
// page.tsx) or should 404, e.g. /docs/[...slug] next to a separate /docs page.
// Use [[...path]] when the bare URL is just the top level of the same
// hierarchy, as it is here.
type Props = PageProps<"/areas/[[...path]]">;

// Every valid path is known from the data, so all of them are prerendered and
// anything else (/areas/kano, /areas/lagos/nowhere, /areas/a/b/c) is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { path: [] }, // the bare /areas page
    ...statesFor().flatMap((state) => [
      { path: [state.value] },
      ...areasFor(state.value).map((area) => ({ path: [state.value, area.slug] })),
    ]),
  ];
}

/** Turns the catch-all array into a state and area, or 404s. */
async function resolve(params: Props["params"]) {
  const [stateSlug, areaSlug, ...rest] = (await params).path ?? [];
  if (rest.length > 0) notFound();
  const state = stateSlug === undefined ? undefined : (statesFor().find((s) => s.value === stateSlug) ?? notFound());
  const area =
    areaSlug === undefined || !state
      ? undefined
      : (areasFor(state.value).find((a) => a.slug === areaSlug) ?? notFound());
  return { state, area };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, area } = await resolve(params);
  if (area) {
    return { title: `${area.area.name}, ${area.area.city}: area guide`, description: area.area.blurb };
  }
  if (state) {
    return {
      title: `Area guides for ${state.label}`,
      description: `Neighbourhoods in ${state.label} with listing counts and average prices.`,
    };
  }
  return {
    title: "Area guides",
    description: "Neighbourhood guides for Lagos, Abuja, Port Harcourt and Ibadan, with average rents and prices.",
  };
}

export default async function AreasPage({ params }: Props) {
  const { state, area } = await resolve(params);

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "Area guides", href: areaGuidePath() },
  ];
  if (state) crumbs.push({ label: state.label, href: areaGuidePath(state.value) });
  if (state && area) crumbs.push({ label: area.area.name });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={crumbs} />
      {state && area ? <AreaGuide state={state} area={area} /> : state ? <StateGuide state={state} /> : <StateList />}
    </div>
  );
}

const CARD = "flex h-full flex-col rounded-xl border border-line bg-surface p-5 transition hover:border-brand";

function StateList() {
  return (
    <>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Area guides</h1>
      <p className="mt-1 text-sm text-muted">Pick a state to see its neighbourhoods, average prices and listings.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statesFor().map((state) => {
          const areas = areasFor(state.value).length;
          const listings = countListingsInState(state.value);
          return (
            <li key={state.value}>
              <Link href={areaGuidePath(state.value)} className={CARD}>
                <span className="flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="size-5 text-brand" aria-hidden /> {state.label}
                </span>
                <span className="mt-1 text-sm text-muted">
                  {areas} {areas === 1 ? "area" : "areas"} · {formatNumber(listings)} {listings === 1 ? "listing" : "listings"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function StateGuide({ state }: { state: Option }) {
  return (
    <>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Areas in {state.label}</h1>
      <p className="mt-1 text-sm text-muted">Neighbourhoods with homes currently on Hearthstone.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areasFor(state.value).map((area) => {
          const { total } = areaStats(area.key);
          return (
            <li key={area.slug}>
              <Link href={areaGuidePath(state.value, area.slug)} className={CARD}>
                <span className="text-lg font-semibold">{area.area.name}</span>
                <span className="text-sm text-muted">
                  {formatNumber(total)} {total === 1 ? "listing" : "listings"}
                </span>
                <span className="mt-3 line-clamp-3 text-sm text-foreground/85">{area.area.blurb}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function AreaGuide({ state, area }: { state: Option; area: AreaEntry }) {
  const stats = areaStats(area.key);
  const listings = listingsInArea(area.key);
  const hasRentals = areasFor(state.value, "rent").some((a) => a.slug === area.slug);
  const hasSales = areasFor(state.value, "sale").some((a) => a.slug === area.slug);

  const tiles = [
    {
      label: "Average yearly rent",
      value: stats.rent.average != null ? `${formatAmount(stats.rent.average, "NGN")}/year` : "No listings yet",
      basis: stats.rent.count ? `From ${stats.rent.count} ${stats.rent.count === 1 ? "rental" : "rentals"}` : null,
    },
    {
      label: "Average sale price",
      value: stats.sale.average != null ? formatAmount(stats.sale.average, "NGN") : "No listings yet",
      basis: stats.sale.count ? `From ${stats.sale.count} ${stats.sale.count === 1 ? "home" : "homes"} for sale` : null,
    },
  ];

  return (
    <>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">{area.area.name}</h1>
      <p className="mt-1 text-sm text-muted">
        {area.area.city}, {state.label}
      </p>
      <p className="mt-4 max-w-3xl leading-relaxed text-foreground/85">{area.area.blurb}</p>

      <dl className="mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl border border-line bg-surface p-4">
            <dt className="text-xs text-muted">{t.label}</dt>
            <dd className="mt-1 text-xl font-semibold">{t.value}</dd>
            {t.basis && <dd className="mt-0.5 text-xs text-muted">{t.basis}</dd>}
          </div>
        ))}
      </dl>
      <p className="mt-2 max-w-3xl text-xs text-muted">
        Calculated from the sample listings on this site, so treat them as a rough guide.
        {stats.landCount > 0 && " Land plots are left out of the sale average."}
      </p>

      <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium">
        {hasRentals && (
          <Link href={locationPath("rent", state.value, area.slug)} className="inline-flex items-center gap-1 text-brand hover:underline">
            Homes to rent in {area.area.name} <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}
        {hasSales && (
          <Link href={locationPath("buy", state.value, area.slug)} className="inline-flex items-center gap-1 text-brand hover:underline">
            Homes for sale in {area.area.name} <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}
      </div>

      <h2 className="mt-10 text-xl font-semibold tracking-tight">Listings in {area.area.name}</h2>
      <div className="mt-6">
        <ListingGrid listings={listings} />
      </div>
    </>
  );
}
