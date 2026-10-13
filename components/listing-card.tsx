import { Bath, BedDouble, ImageOff, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { formatNumber, formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/listing";

export function ListingCard({ listing }: { listing: Listing }) {
  const photo = listing.photos[0];

  return (
    <Link
      href={listing.href}
      className="group block overflow-hidden rounded-xl border border-line bg-surface transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-line">
        {photo ? (
          <Image
            src={photo.thumb}
            alt={listing.title}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-muted">
            <ImageOff className="size-8" aria-label="No photo available" />
          </div>
        )}
        <StatusBadge status={listing.status} className="absolute top-3 left-3" />
      </div>

      <div className="space-y-2 p-4">
        <p className="text-xl font-semibold tracking-tight">{formatPrice(listing)}</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          {listing.beds != null && (
            <li className="flex items-center gap-1.5">
              <BedDouble className="size-4" aria-hidden /> {listing.beds} bd
            </li>
          )}
          {listing.baths != null && (
            <li className="flex items-center gap-1.5">
              <Bath className="size-4" aria-hidden /> {listing.baths} ba
            </li>
          )}
          {listing.area && (
            <li className="flex items-center gap-1.5">
              <Ruler className="size-4" aria-hidden /> {formatNumber(listing.area.value)} {listing.area.unit}
            </li>
          )}
        </ul>
        <div className="text-sm">
          <p className="truncate font-medium">{listing.title}</p>
          <p className="truncate text-muted">
            {[listing.address, listing.locality].filter(Boolean).join(", ")}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface" aria-hidden>
      <div className="aspect-[4/3] animate-pulse bg-line" />
      <div className="space-y-3 p-4">
        <div className="h-6 w-1/2 animate-pulse rounded bg-line" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-line" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-line" />
      </div>
    </div>
  );
}
