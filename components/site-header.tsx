import { House } from "lucide-react";
import Link from "next/link";

const NAV = [
  { href: "/properties", label: "Browse homes" },
  { href: "/properties?type=rental", label: "Rentals" },
  { href: "/properties?type=land", label: "Land" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-brand text-brand-foreground">
            <House className="size-4" aria-hidden />
          </span>
          <span>Hearthstone</span>
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-1 text-sm">
            {NAV.map((item, i) => (
              <li key={item.href} className={i > 0 ? "hidden sm:block" : undefined}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-muted transition hover:bg-line/60 hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
