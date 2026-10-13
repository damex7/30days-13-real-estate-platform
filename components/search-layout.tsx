import type { ReactNode } from "react";

export function SearchLayout({
  eyebrow,
  title,
  subtitle,
  filters,
  children,
}: {
  eyebrow?: ReactNode;
  title: string;
  subtitle: ReactNode;
  filters: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header>
        {eyebrow && <div className="mb-3 text-sm">{eyebrow}</div>}
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[17rem_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">{filters}</aside>
        <section aria-label="Search results">{children}</section>
      </div>
    </div>
  );
}
