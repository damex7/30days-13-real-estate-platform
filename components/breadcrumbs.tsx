import Link from "next/link";

export type Crumb = { label: string; href?: string };

/** Home › Rent › Lagos › Lekki Phase 1. The last item is the current page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {items.map((item, i) => {
          const current = i === items.length - 1;
          return (
            <li key={`${i}-${item.label}`} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && <span aria-hidden>›</span>}
              {item.href && !current ? (
                <Link href={item.href} className="hover:text-foreground hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={current ? "page" : undefined} className="truncate text-foreground">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
