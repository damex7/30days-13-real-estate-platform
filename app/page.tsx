import { ArrowRight, Building, House, KeyRound, LandPlot, Search, Store, Tractor, TriangleAlert } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { EmptyState } from "@/components/empty-state";
import { ListingGrid, ListingGridSkeleton } from "@/components/listing-grid";
import { PRICE_OPTIONS, PROPERTY_TYPES, type PropertyType } from "@/lib/filters";
import { formatPriceCompact } from "@/lib/format";
import { getFeaturedListings } from "@/lib/simplyrets";

const TYPE_ICONS: Record<PropertyType, typeof House> = {
  residential: House,
  rental: KeyRound,
  multifamily: Building,
  commercial: Store,
  land: LandPlot,
  farm: Tractor,
};

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(15,118,110,0.45),transparent_50%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <p className="text-sm font-medium tracking-wide text-teal-300 uppercase">Greater Houston listings</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Find a place that feels like home.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-stone-300">
            Search homes, rentals and land with up-to-date photos, prices and agent details.
          </p>

          <Form
            action="/properties"
            className="mt-10 grid max-w-3xl gap-2 rounded-2xl bg-white p-2 text-stone-900 shadow-2xl sm:grid-cols-[1fr_auto_auto_auto]"
          >
            <label className="relative">
              <span className="sr-only">Search by city, ZIP, street or MLS number</span>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400" aria-hidden />
              <input
                name="q"
                type="search"
                placeholder="City, ZIP, street, MLS #"
                className="h-12 w-full rounded-xl pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-teal-600"
              />
            </label>
            <label>
              <span className="sr-only">Property type</span>
              <select name="type" defaultValue="" className="h-12 w-full rounded-xl bg-stone-100 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-600">
                <option value="">Any type</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Maximum price</span>
              <select name="maxprice" defaultValue="" className="h-12 w-full rounded-xl bg-stone-100 px-3 text-sm outline-none focus:ring-2 focus:ring-teal-600">
                <option value="">Any price</option>
                {PRICE_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    Up to {formatPriceCompact(p)}
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
        <h2 className="text-xl font-semibold tracking-tight">Browse by type</h2>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {PROPERTY_TYPES.map((t) => {
            const Icon = TYPE_ICONS[t.value];
            return (
              <li key={t.value}>
                <Link
                  href={`/properties?type=${t.value}`}
                  className="flex h-full flex-col gap-3 rounded-xl border border-line bg-surface p-4 text-sm font-medium transition hover:border-brand hover:text-brand"
                >
                  <Icon className="size-5 text-brand" aria-hidden />
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Newest listings</h2>
            <p className="mt-1 text-sm text-muted">Fresh on the market and still active.</p>
          </div>
          <Link href="/properties" className="flex shrink-0 items-center gap-1 text-sm font-medium text-brand hover:underline">
            View all <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-6">
          <Suspense fallback={<ListingGridSkeleton />}>
            <FeaturedListings />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function FeaturedListings() {
  // Render per request so a failed fetch at build time isn't frozen into the
  // static page; the listings themselves still come from the hour-long fetch cache.
  await connection();
  const listings = await getFeaturedListings().catch((error: unknown) => {
    console.error("Failed to load featured listings", error);
    return null;
  });

  if (!listings?.length) {
    return (
      <EmptyState
        icon={TriangleAlert}
        title="Listings are unavailable right now"
        description="We couldn't reach the listings feed. You can still try a search."
        action={{ href: "/properties", label: "Browse all homes" }}
      />
    );
  }

  return <ListingGrid listings={listings} />;
}
