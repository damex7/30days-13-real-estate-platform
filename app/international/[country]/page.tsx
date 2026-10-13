import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SampleMarketSearch } from "@/components/sample-market-search";
import { INTERNATIONAL_MARKETS, getInternationalMarket } from "@/lib/markets/sample";
import { describeSampleSearch, parseSampleFilters } from "@/lib/markets/sample/filters";

type Props = PageProps<"/international/[country]">;

// Only the configured sample markets exist; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return INTERNATIONAL_MARKETS.map((m) => ({ country: m.slug }));
}

async function load(props: Props) {
  const market = getInternationalMarket((await props.params).country);
  if (!market) notFound();
  return { market, filters: parseSampleFilters(market, await props.searchParams) };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { market, filters } = await load(props);
  return {
    title: describeSampleSearch(market, filters),
    description: `Sample homes for sale and rent in ${market.placeName ?? market.name}: ${market.tagline}.`,
  };
}

export default async function CountryPage(props: Props) {
  const { market, filters } = await load(props);
  return (
    <SampleMarketSearch
      market={market}
      filters={filters}
      eyebrow={
        <Link href="/international" className="inline-flex items-center gap-1.5 text-muted hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden /> International
        </Link>
      }
    />
  );
}
