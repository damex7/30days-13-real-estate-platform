import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { EmptyState } from "@/components/empty-state";
import { ListingGrid, ListingGridSkeleton } from "@/components/listing-grid";
import { Pagination } from "@/components/pagination";
import { SearchFilters } from "@/components/search-filters";
import {
  buildListingsHref,
  parseFilters,
  propertyTypeLabel,
  type ListingFilters,
} from "@/lib/filters";
import { searchListings } from "@/lib/simplyrets";

export async function generateMetadata(props: PageProps<"/properties">): Promise<Metadata> {
  const filters = parseFilters(await props.searchParams);
  const label = propertyTypeLabel(filters.type);
  return {
    title: label ? `${label} listings` : "Browse homes",
    description: "Search listings by keyword, type, price, beds and baths.",
  };
}

export default async function PropertiesPage(props: PageProps<"/properties">) {
  const filters = parseFilters(await props.searchParams);
  const label = propertyTypeLabel(filters.type);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{label ?? "All listings"}</h1>
        <p className="mt-1 text-sm text-muted">
          {filters.q ? <>Results for “{filters.q}”</> : "Homes, rentals and land across Greater Houston"}
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[17rem_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <SearchFilters filters={filters} />
        </aside>
        <section aria-label="Search results">
          {/* A fresh key per query shows the skeleton while new results load. */}
          <Suspense key={buildListingsHref(filters)} fallback={<ListingGridSkeleton count={9} />}>
            <Results filters={filters} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}

async function Results({ filters }: { filters: ListingFilters }) {
  const { listings, hasNext } = await searchListings(filters);

  if (listings.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No homes match those filters"
        description="Try widening your price range, lowering the bed or bath count, or searching a different area."
        action={{ href: "/properties", label: "Clear filters" }}
      />
    );
  }

  return (
    <>
      <ListingGrid listings={listings} />
      <Pagination filters={filters} hasNext={hasNext} />
    </>
  );
}
