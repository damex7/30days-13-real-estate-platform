import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SampleMarketSearch } from "@/components/sample-market-search";
import { childLocations, type Location } from "@/lib/locations";
import { HOME_MARKET } from "@/lib/markets/sample";
import { parseSampleFilters } from "@/lib/markets/sample/filters";
import { labelFor, type RawSearchParams } from "@/lib/search-params";

export function locationMetadata(location: Location): Metadata {
  return {
    title: location.heading,
    description: `Browse ${location.heading.toLowerCase()} on Hearthstone Realty, with prices in naira.`,
    alternates: { canonical: location.path },
  };
}

/**
 * Shared body for /[purpose], /[purpose]/[state] and /[purpose]/[state]/[area].
 *
 * Path or search params? The location goes in the PATH: /rent/lagos/lekki-phase-1
 * names a page that exists in its own right, so it gets a clean URL, its own
 * title and breadcrumbs, a sitemap entry, and params checked against the data.
 * The other filters (type, price, beds, sort, page) stay in SEARCH PARAMS:
 * they're optional refinements that combine freely, so giving each mix its own
 * path would explode the number of routes for no benefit.
 */
export function LocationSearch({ location, searchParams }: { location: Location; searchParams: RawSearchParams }) {
  const parsed = parseSampleFilters(HOME_MARKET, searchParams);
  // Purpose and state from the path win over any stray ?purpose= or ?region=.
  const filters = { ...parsed, purpose: location.purpose, region: location.state?.value };
  const type = labelFor(HOME_MARKET.types, filters.type);
  const children = childLocations(location);

  return (
    <SampleMarketSearch
      market={HOME_MARKET}
      filters={filters}
      location={{
        path: location.path,
        heading: type ? `${type} listings ${location.purposePhrase} in ${location.placeName}` : location.heading,
        area: location.area?.key,
      }}
      eyebrow={
        <div className="space-y-3">
          <Breadcrumbs items={location.crumbs} />
          {children.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {children.map((c) => (
                <li key={c.value}>
                  <Link
                    href={c.value}
                    className="inline-block rounded-full border border-line bg-surface px-3 py-1 transition hover:border-brand hover:text-brand"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      }
    />
  );
}
