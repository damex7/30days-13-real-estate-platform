import { SearchX } from "lucide-react";
import type { ReactNode } from "react";

import { EmptyState } from "@/components/empty-state";
import { ListingGrid } from "@/components/listing-grid";
import { Pagination } from "@/components/pagination";
import { SearchFilters } from "@/components/search-filters";
import { SearchLayout } from "@/components/search-layout";
import { formatNumber } from "@/lib/format";
import {
  SAMPLE_SORT_OPTIONS,
  describeSampleSearch,
  hasActiveSampleFilters,
  sampleFilterFields,
  sampleListingsHref,
  sampleLocationHref,
  type SampleFilters,
} from "@/lib/markets/sample/filters";
import { searchSampleListings } from "@/lib/markets/sample/listings";
import type { SampleMarket } from "@/lib/markets/sample/types";

/** Set on /buy and /rent pages, where the purpose, state and area come from the path. */
export type SearchLocation = {
  path: string;
  heading: string;
  /** Key into `market.areas`. */
  area?: string;
};

/** Search page body for any market backed by the sample dataset. */
export function SampleMarketSearch({
  market,
  filters,
  eyebrow,
  location,
}: {
  market: SampleMarket;
  filters: SampleFilters;
  eyebrow?: ReactNode;
  location?: SearchLocation;
}) {
  const { listings, hasNext, total } = searchSampleListings(market, { ...filters, area: location?.area });

  // On location pages the purpose and state are fixed by the path, so they
  // leave the form and the query strings; everything else works the same.
  const basePath = location?.path ?? market.basePath;
  const href = (overrides: Partial<SampleFilters> = {}) =>
    location ? sampleLocationHref(location.path, filters, overrides) : sampleListingsHref(market, filters, overrides);
  const fields = sampleFilterFields(market, filters).filter(
    (f) => !location || (f.name !== "purpose" && f.name !== "region"),
  );
  const showClear = hasActiveSampleFilters(
    location ? { ...filters, purpose: undefined, region: undefined } : filters,
  );

  return (
    <SearchLayout
      eyebrow={eyebrow}
      title={location?.heading ?? describeSampleSearch(market, filters)}
      subtitle={
        <>
          {formatNumber(total ?? 0)} {total === 1 ? "property" : "properties"}
          {filters.q && <> matching “{filters.q}”</>}
        </>
      }
      filters={
        <SearchFilters
          action={basePath}
          formKey={href()}
          keyword={filters.q}
          keywordPlaceholder={market.keywordPlaceholder}
          fields={fields}
          sortOptions={SAMPLE_SORT_OPTIONS}
          sort={filters.sort}
          showClear={showClear}
        />
      }
    >
      {listings.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No properties match those filters"
          description={`Try a wider price range, fewer bedrooms, or another ${market.regionLabel.toLowerCase()}.`}
          action={{ href: basePath, label: "Clear filters" }}
        />
      ) : (
        <>
          <ListingGrid listings={listings} />
          <Pagination
            page={filters.page}
            prevHref={filters.page > 1 ? href({ page: filters.page - 1 }) : null}
            nextHref={hasNext ? href({ page: filters.page + 1 }) : null}
          />
        </>
      )}
    </SearchLayout>
  );
}
