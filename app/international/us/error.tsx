"use client";

import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ListingsError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-amber-100 text-amber-700">
        <TriangleAlert className="size-6" aria-hidden />
      </span>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">We couldn&apos;t load these listings</h1>
      <p className="mt-2 text-sm text-muted">
        The listings feed is slow or unavailable right now. Give it another try in a moment.
      </p>
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:bg-brand-hover"
        >
          Try again
        </button>
        <Link href="/" className="text-sm text-muted hover:text-foreground hover:underline">
          Back home
        </Link>
      </div>
    </div>
  );
}
