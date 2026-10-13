import { House } from "lucide-react";
import Link from "next/link";

import { MainNav } from "@/components/main-nav";

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
        <MainNav />
      </div>
    </header>
  );
}
