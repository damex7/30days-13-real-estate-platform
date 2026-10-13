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
  type SampleFilters,
} from "@/lib/markets/sample/filters";
import { searchSampleListings } from "@/lib/markets/sample/listings";
import type { SampleMarket } from "@/lib/markets/sample/types";

/** Search page body for any market backed by the sample dataset. */
export function SampleMarketSearch({
  market,
  filters,
  eyebrow,
}: {
  market: SampleMarket;
  filters: SampleFilters;
  eyebrow?: ReactNode;
}) {
  const { listings, hasNext, total } = searchSampleListings(market, filters);

  return (
    <SearchLayout
      eyebrow={eyebrow}
      title={describeSampleSearch(market, filters)}
      subtitle={
        <>
          {formatNumber(total ?? 0)} {total === 1 ? "property" : "properties"}
          {filters.q && <> matching “{filters.q}”</>}
        </>
      }
      filters={
        <SearchFilters
          action={market.basePath}
          formKey={sampleListingsHref(market, filters)}
          keyword={filters.q}
          keywordPlaceholder={market.keywordPlaceholder}
          fields={sampleFilterFields(market, filters)}
          sortOptions={SAMPLE_SORT_OPTIONS}
          sort={filters.sort}
          showClear={hasActiveSampleFilters(filters)}
        />
      }
    >
      {listings.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No properties match those filters"
          description={`Try a wider price range, fewer bedrooms, or another ${market.regionLabel.toLowerCase()}.`}
          action={{ href: market.basePath, label: "Clear filters" }}
        />
      ) : (
        <>
          <ListingGrid listings={listings} />
          <Pagination
            page={filters.page}
            prevHref={filters.page > 1 ? sampleListingsHref(market, filters, { page: filters.page - 1 }) : null}
            nextHref={hasNext ? sampleListingsHref(market, filters, { page: filters.page + 1 }) : null}
          />
        </>
      )}
    </SearchLayout>
  );
}
