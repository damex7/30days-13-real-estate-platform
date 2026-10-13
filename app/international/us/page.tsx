import { ArrowLeft, SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { EmptyState } from "@/components/empty-state";
import { ListingGrid, ListingGridSkeleton } from "@/components/listing-grid";
import { Pagination } from "@/components/pagination";
import { SearchFilters } from "@/components/search-filters";
import { SearchLayout } from "@/components/search-layout";
import {
  US_BASE_PATH,
  US_SORT_OPTIONS,
  hasActiveUsFilters,
  parseUsFilters,
  usFilterFields,
  usListingsHref,
  usTypeLabel,
  type UsFilters,
} from "@/lib/markets/us/filters";
import { searchUsListings } from "@/lib/markets/us/simplyrets";

export async function generateMetadata(props: PageProps<"/international/us">): Promise<Metadata> {
  const filters = parseUsFilters(await props.searchParams);
  const label = usTypeLabel(filters.type);
  return {
    title: label ? `US ${label.toLowerCase()} listings` : "US listings",
    description: "Sample US listings around Houston, TX from the SimplyRETS demo feed.",
  };
}

export default async function UsPropertiesPage(props: PageProps<"/international/us">) {
  const filters = parseUsFilters(await props.searchParams);
  const label = usTypeLabel(filters.type);

  return (
    <SearchLayout
      eyebrow={
        <Link href="/international" className="inline-flex items-center gap-1.5 text-muted hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden /> International
        </Link>
      }
      title={label ? `${label} in the United States` : "United States listings"}
      subtitle={
        filters.q ? (
          <>Results for “{filters.q}”</>
        ) : (
          "Sample listings around Houston, TX from the SimplyRETS demo feed"
        )
      }
      filters={
        <SearchFilters
          action={US_BASE_PATH}
          formKey={usListingsHref(filters)}
          keyword={filters.q}
          keywordPlaceholder="City, ZIP, street, MLS #"
          fields={usFilterFields(filters)}
          sortOptions={US_SORT_OPTIONS}
          sort={filters.sort}
          showClear={hasActiveUsFilters(filters)}
        />
      }
    >
      {/* A fresh key per query shows the skeleton while new results load. */}
      <Suspense key={usListingsHref(filters)} fallback={<ListingGridSkeleton count={9} />}>
        <Results filters={filters} />
      </Suspense>
    </SearchLayout>
  );
}

async function Results({ filters }: { filters: UsFilters }) {
  const { listings, hasNext } = await searchUsListings(filters);

  if (listings.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No homes match those filters"
        description="Try widening your price range, lowering the bed or bath count, or searching a different area."
        action={{ href: US_BASE_PATH, label: "Clear filters" }}
      />
    );
  }

  return (
    <>
      <ListingGrid listings={listings} />
      <Pagination
        page={filters.page}
        prevHref={filters.page > 1 ? usListingsHref(filters, { page: filters.page - 1 }) : null}
        nextHref={hasNext ? usListingsHref(filters, { page: filters.page + 1 }) : null}
      />
    </>
  );
}
