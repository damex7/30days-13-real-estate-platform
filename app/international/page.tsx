import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { formatNumber } from "@/lib/format";
import { INTERNATIONAL_MARKETS } from "@/lib/markets/sample";
import { countSampleListings, sampleMarketCover } from "@/lib/markets/sample/listings";
import { US_BASE_PATH } from "@/lib/markets/us/filters";

export const metadata: Metadata = {
  title: "International listings",
  description:
    "Browse sample homes in the UK, UAE, Ghana, Kenya and South Africa, plus live US listings from the SimplyRETS demo feed.",
};

type MarketCard = {
  href: string;
  name: string;
  tagline: string;
  meta: string;
  cover: string | null;
  badge: { label: string; live: boolean };
};

export default function InternationalPage() {
  const cards: MarketCard[] = [
    ...INTERNATIONAL_MARKETS.map((market) => ({
      href: market.basePath,
      name: market.name,
      tagline: market.tagline,
      meta: `${formatNumber(countSampleListings(market))} listings · ${market.currency}`,
      cover: sampleMarketCover(market)?.thumb ?? null,
      badge: { label: "Sample data", live: false },
    })),
    {
      href: US_BASE_PATH,
      name: "United States",
      tagline: "Houston, Texas and surrounding cities",
      meta: "Live MLS feed · USD",
      cover: "https://d2bd5h5te3s67r.cloudfront.net/trial/home2.jpg",
      badge: { label: "Live API", live: true },
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">International listings</h1>
        <p className="mt-2 text-muted">
          Looking beyond Nigeria? Browse homes in five more countries, each priced in its local currency with local
          property types and terms. The US listings come live from the SimplyRETS demo feed; the rest are sample
          data.
        </p>
      </header>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="group block overflow-hidden rounded-xl border border-line bg-surface transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-line">
                {card.cover && (
                  <Image
                    src={card.cover}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
                <span
                  className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm ${
                    card.badge.live ? "bg-emerald-600 text-white" : "bg-white/90 text-stone-800"
                  }`}
                >
                  {card.badge.label}
                </span>
              </div>
              <div className="flex items-end justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="text-lg font-semibold tracking-tight">{card.name}</p>
                  <p className="truncate text-sm text-muted">{card.tagline}</p>
                  <p className="mt-2 text-xs text-muted">{card.meta}</p>
                </div>
                <ArrowRight className="size-5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
