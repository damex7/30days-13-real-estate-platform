import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { buildListingsHref, type ListingFilters } from "@/lib/filters";
import { cn } from "@/lib/utils";

const BUTTON =
  "inline-flex h-10 items-center gap-1 rounded-lg border border-line bg-surface px-3 text-sm font-medium transition hover:border-brand hover:text-brand";
const DISABLED = "pointer-events-none opacity-40";

export function Pagination({ filters, hasNext }: { filters: ListingFilters; hasNext: boolean }) {
  const { page } = filters;
  if (page === 1 && !hasNext) return null;

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-between gap-4">
      {page > 1 ? (
        <Link href={buildListingsHref(filters, { page: page - 1 })} className={BUTTON}>
          <ChevronLeft className="size-4" aria-hidden /> Previous
        </Link>
      ) : (
        <span className={cn(BUTTON, DISABLED)} aria-disabled>
          <ChevronLeft className="size-4" aria-hidden /> Previous
        </span>
      )}
      <span className="text-sm text-muted">Page {page}</span>
      {hasNext ? (
        <Link href={buildListingsHref(filters, { page: page + 1 })} className={BUTTON}>
          Next <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span className={cn(BUTTON, DISABLED)} aria-disabled>
          Next <ChevronRight className="size-4" aria-hidden />
        </span>
      )}
    </nav>
  );
}
