import { ListingCard, ListingCardSkeleton } from "@/components/listing-card";
import type { Listing } from "@/lib/listing";

const GRID = "grid gap-6 sm:grid-cols-2 xl:grid-cols-3";

export function ListingGrid({ listings }: { listings: Listing[] }) {
  return (
    <ul className={GRID}>
      {listings.map((listing) => (
        <li key={listing.id}>
          <ListingCard listing={listing} />
        </li>
      ))}
    </ul>
  );
}

export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={GRID} role="status" aria-label="Loading listings">
      {Array.from({ length: count }, (_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}
