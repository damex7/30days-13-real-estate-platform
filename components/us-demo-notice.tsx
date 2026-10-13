import { Info } from "lucide-react";

/** Shown on every US page: the SimplyRETS demo feed is not real market data. */
export function UsDemoNotice({ className }: { className?: string }) {
  return (
    <p
      role="note"
      className={`flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 ${className ?? ""}`}
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>
        <strong className="font-semibold">Demo data.</strong> The SimplyRETS demo feed uses randomly generated prices
        and details, so these listings don&apos;t describe real homes or real market prices.
      </span>
    </p>
  );
}
