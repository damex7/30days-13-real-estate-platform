import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
        <Icon className="size-6" aria-hidden />
      </span>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-6 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:bg-brand-hover"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
