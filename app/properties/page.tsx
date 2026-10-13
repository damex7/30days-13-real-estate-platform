import type { Metadata } from "next";

import { SampleMarketSearch } from "@/components/sample-market-search";
import { HOME_MARKET } from "@/lib/markets/sample";
import { describeSampleSearch, parseSampleFilters } from "@/lib/markets/sample/filters";

export async function generateMetadata(props: PageProps<"/properties">): Promise<Metadata> {
  const filters = parseSampleFilters(HOME_MARKET, await props.searchParams);
  return {
    title: describeSampleSearch(HOME_MARKET, filters),
    description: "Search houses, flats and land for sale and rent across Lagos, Abuja, Port Harcourt and Ibadan.",
  };
}

export default async function PropertiesPage(props: PageProps<"/properties">) {
  const filters = parseSampleFilters(HOME_MARKET, await props.searchParams);
  return <SampleMarketSearch market={HOME_MARKET} filters={filters} />;
}
