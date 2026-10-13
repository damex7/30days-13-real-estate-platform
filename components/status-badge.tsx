import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  Active: "bg-emerald-600 text-white",
  ActiveUnderContract: "bg-amber-500 text-white",
  Pending: "bg-amber-500 text-white",
  Closed: "bg-stone-700 text-white",
};

/** "ActiveUnderContract" → "Active under contract" */
function humanize(status: string) {
  const words = status.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function StatusBadge({ status, className }: { status: string | null; className?: string }) {
  if (!status) return null;
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium shadow-sm",
        STYLES[status] ?? "bg-stone-500 text-white",
        className,
      )}
    >
      {humanize(status)}
    </span>
  );
}
