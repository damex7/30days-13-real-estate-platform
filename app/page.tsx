import { ArrowRight, Globe, MapPin, Search } from "lucide-react";
import Form from "next/form";
import Link from "next/link";

import { ListingGrid } from "@/components/listing-grid";
import { formatNumber } from "@/lib/format";
import { statesFor } from "@/lib/locations";
import { HOME_MARKET, INTERNATIONAL_MARKETS } from "@/lib/markets/sample";
import {
  sampleListingsHref,
  sampleLocationHref,
  samplePriceOptions,
  type SampleFilters,
} from "@/lib/markets/sample/filters";
import { countSampleListingsByCity, getNewestSampleListings } from "@/lib/markets/sample/listings";
import { US_BASE_PATH } from "@/lib/markets/us/filters";
import { locationPath } from "@/lib/urls";

const ngListingsHref = (filters: Partial<SampleFilters>) => sampleListingsHref(HOME_MARKET, filters);

// Searches with a single purpose (and state) use the /buy and /rent location
// paths; ones that span purposes or several areas stay on /properties.
const POPULAR_SEARCHES = [
  { label: "Flats for rent in Lagos", href: sampleLocationHref(locationPath("rent", "lagos"), { type: "flat" }) },
  { label: "Homes in Lekki", href: ngListingsHref({ q: "lekki" }) },
  { label: "Duplexes for sale in Abuja", href: sampleLocationHref(locationPath("buy", "abuja"), { type: "detached-duplex" }) },
  { label: "Land for sale", href: sampleLocationHref(locationPath("buy"), { type: "land" }) },
  { label: "Rent under ₦5M a year", href: sampleLocationHref(locationPath("rent"), { maxprice: 5_000_000 }) },
  { label: "Mini flats for rent", href: sampleLocationHref(locationPath("rent"), { type: "mini-flat" }) },
  { label: "Homes over ₦500M", href: sampleLocationHref(locationPath("buy"), { minprice: 500_000_000 }) },
  { label: "Homes in Port Harcourt", href: ngListingsHref({ region: "rivers" }) },
];

const SELECT =
  "h-12 w-full rounded-xl bg-stone-100 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-600";

export default function HomePage() {
  const newest = getNewestSampleListings(HOME_MARKET);
  const cities = countSampleListingsByCity(HOME_MARKET);
  const saleStates = new Set(statesFor("sale").map((s) => s.value));
  const rentStates = new Set(statesFor("rent").map((s) => s.value));

  return (
    <>
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(15,118,110,0.45),transparent_50%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <p className="text-sm font-medium tracking-wide text-teal-300 uppercase">
            Lagos · Abuja · Port Harcourt · Ibadan
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Find a home you&apos;ll love in Nigeria.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-stone-300">
            Houses, flats and land for sale and rent, priced in naira, with the details that matter: title
            documents, service charges and fees.
          </p>

          <Form
            action={HOME_MARKET.basePath}
            className="mt-10 grid max-w-4xl gap-2 rounded-2xl bg-white p-2 text-stone-900 shadow-2xl sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto_auto]"
          >
            <label className="relative sm:col-span-2 lg:col-span-1">
              <span className="sr-only">Search by area, estate or street</span>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400" aria-hidden />
              <input
                name="q"
                type="search"
                placeholder="Area, estate or street"
                className="h-12 w-full rounded-xl pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-teal-600"
              />
            </label>
            <label>
              <span className="sr-only">Buy or rent</span>
              <select name="purpose" defaultValue="" className={SELECT}>
                <option value="">Buy or rent</option>
                <option value="sale">Buy</option>
                <option value="rent">Rent</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Property type</span>
              <select name="type" defaultValue="" className={SELECT}>
                <option value="">Any type</option>
                {HOME_MARKET.types.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Maximum price</span>
              <select name="maxprice" defaultValue="" className={SELECT}>
                <option value="">Any price</option>
                {samplePriceOptions(HOME_MARKET).map((p) => (
                  <option key={p.value} value={p.value}>
                    Up to {p.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="h-12 rounded-xl bg-teal-700 px-6 text-sm font-medium text-white transition hover:bg-teal-800"
            >
              Search
            </button>
          </Form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold tracking-tight">Browse by city</h2>
        <ul className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {cities.map((c) => (
            <li
              key={c.city}
              className="flex h-full items-center gap-3 rounded-xl border border-line bg-surface p-4"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                <MapPin className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block font-medium">{c.city}</span>
                <span className="block text-sm text-muted">
                  {formatNumber(c.count)} {c.count === 1 ? "listing" : "listings"}
                </span>
                <span className="mt-1 flex gap-3 text-sm font-medium text-brand">
                  {saleStates.has(c.region) && (
                    <Link href={locationPath("buy", c.region)} className="hover:underline">
                      For sale<span className="sr-only"> in {c.city}</span>
                    </Link>
                  )}
                  {rentStates.has(c.region) && (
                    <Link href={locationPath("rent", c.region)} className="hover:underline">
                      To rent<span className="sr-only"> in {c.city}</span>
                    </Link>
                  )}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 text-sm font-medium text-muted">Popular searches</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((s) => (
            <li key={s.label}>
              <Link
                href={s.href}
                className="inline-block rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm transition hover:border-brand hover:text-brand"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Newest listings</h2>
            <p className="mt-1 text-sm text-muted">Fresh on the market across Nigeria.</p>
          </div>
          <Link href={HOME_MARKET.basePath} className="flex shrink-0 items-center gap-1 text-sm font-medium text-brand hover:underline">
            View all <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-6">
          <ListingGrid listings={newest} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                <Globe className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-semibold">Looking abroad?</h2>
                <p className="mt-1 text-sm text-muted">
                  Browse homes in five more countries, plus live US listings from the SimplyRETS feed.
                </p>
              </div>
            </div>
            <Link
              href="/international"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-line px-4 text-sm font-medium transition hover:border-brand hover:text-brand"
            >
              All international listings <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            {[...INTERNATIONAL_MARKETS, { name: "United States", basePath: US_BASE_PATH }].map((m) => (
              <li key={m.basePath}>
                <Link
                  href={m.basePath}
                  className="inline-block rounded-full border border-line px-3.5 py-1.5 text-sm transition hover:border-brand hover:text-brand"
                >
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
