import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const BUTTON =
  "inline-flex h-10 items-center gap-1 rounded-lg border border-line bg-surface px-3 text-sm font-medium transition hover:border-brand hover:text-brand";
const DISABLED = "pointer-events-none opacity-40";

export function Pagination({
  page,
  prevHref,
  nextHref,
}: {
  page: number;
  prevHref: string | null;
  nextHref: string | null;
}) {
  if (!prevHref && !nextHref) return null;

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-between gap-4">
      {prevHref ? (
        <Link href={prevHref} className={BUTTON}>
          <ChevronLeft className="size-4" aria-hidden /> Previous
        </Link>
      ) : (
        <span className={cn(BUTTON, DISABLED)} aria-disabled>
          <ChevronLeft className="size-4" aria-hidden /> Previous
        </span>
      )}
      <span className="text-sm text-muted">Page {page}</span>
      {nextHref ? (
        <Link href={nextHref} className={BUTTON}>
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
