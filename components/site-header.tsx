import { House } from "lucide-react";
import Link from "next/link";

const NAV = [
  { href: "/properties?purpose=sale", label: "Buy" },
  { href: "/properties?purpose=rent", label: "Rent" },
  { href: "/properties?type=land", label: "Land", desktopOnly: true },
  { href: "/international", label: "International" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-brand text-brand-foreground">
            <House className="size-4" aria-hidden />
          </span>
          <span className="hidden min-[400px]:inline">Hearthstone</span>
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-0.5 text-sm sm:gap-1">
            {NAV.map((item) => (
              <li key={item.href} className={item.desktopOnly ? "hidden sm:block" : undefined}>
                <Link
                  href={item.href}
                  className="rounded-md px-2.5 py-2 text-muted transition hover:bg-line/60 hover:text-foreground sm:px-3"
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
