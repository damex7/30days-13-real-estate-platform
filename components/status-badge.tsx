import type { Listing, StatusTone } from "@/lib/listing";
import { cn } from "@/lib/utils";

const TONES: Record<StatusTone, string> = {
  green: "bg-emerald-600 text-white",
  blue: "bg-sky-600 text-white",
  amber: "bg-amber-500 text-white",
  stone: "bg-stone-700 text-white",
};

export function StatusBadge({ status, className }: { status: Listing["status"]; className?: string }) {
  if (!status) return null;
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium shadow-sm", TONES[status.tone], className)}>
      {status.label}
    </span>
  );
}
