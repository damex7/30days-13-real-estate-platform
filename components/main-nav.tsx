"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { cn } from "@/lib/utils";

type SearchParams = Pick<URLSearchParams, "get">;

type NavItem = {
  href: string;
  label: string;
  desktopOnly?: boolean;
  isActive: (pathname: string, search: SearchParams) => boolean;
};

const onSearch = (pathname: string) => pathname === "/properties";
const under = (pathname: string, base: string) => pathname === base || pathname.startsWith(`${base}/`);

const NAV: NavItem[] = [
  {
    href: "/buy",
    label: "Buy",
    isActive: (p, s) =>
      s.get("type") !== "land" && (under(p, "/buy") || (onSearch(p) && s.get("purpose") === "sale")),
  },
  {
    href: "/rent",
    label: "Rent",
    isActive: (p, s) =>
      s.get("type") !== "land" && (under(p, "/rent") || (onSearch(p) && s.get("purpose") === "rent")),
  },
  {
    href: "/properties?type=land",
    label: "Land",
    desktopOnly: true,
    isActive: (p, s) => onSearch(p) && s.get("type") === "land",
  },
  {
    href: "/international",
    label: "International",
    isActive: (p) => p === "/international" || p.startsWith("/international/"),
  },
];

function NavLinks({ search }: { search: SearchParams }) {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-0.5 text-sm sm:gap-1">
      {NAV.map((item) => {
        const active = item.isActive(pathname, search);
        return (
          <li key={item.href} className={item.desktopOnly ? "hidden sm:block" : undefined}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-md px-2.5 py-2 transition sm:px-3",
                active
                  ? "bg-brand-soft font-medium text-brand"
                  : "text-muted hover:bg-line/60 hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function NavLinksWithSearch() {
  return <NavLinks search={useSearchParams()} />;
}

/**
 * Buy and Rent live at /buy and /rent, but Land and older /properties?purpose=
 * links still depend on the query string. Prerendered pages can't read it on
 * the server; the fallback highlights what the pathname alone decides and the
 * rest fills in on the client.
 */
export function MainNav() {
  return (
    <nav aria-label="Main">
      <Suspense fallback={<NavLinks search={new URLSearchParams()} />}>
        <NavLinksWithSearch />
      </Suspense>
    </nav>
  );
}
