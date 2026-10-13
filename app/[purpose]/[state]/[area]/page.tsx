import type { Metadata } from "next";

import { LocationSearch, locationMetadata } from "@/components/location-search";
import { areasFor, purposeFromSegment, resolveLocation } from "@/lib/locations";

type Props = PageProps<"/[purpose]/[state]/[area]">;

// Third level: runs once per { purpose, state } pair from the layouts above and
// returns only the areas with listings for that pair.
export function generateStaticParams({
  params,
}: {
  params: Awaited<LayoutProps<"/[purpose]/[state]">["params"]>;
}) {
  const purpose = purposeFromSegment(params.purpose);
  return purpose ? areasFor(params.state, purpose).map((area) => ({ area: area.slug })) : [];
}

// Areas not returned above (/buy/lagos/nowhere) are a 404.
export const dynamicParams = false;

// These pages read searchParams, so they render per request rather than at
// build time. The params are still limited to the combinations generated above.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return locationMetadata(resolveLocation(await params));
}

export default async function AreaPage({ params, searchParams }: Props) {
  return <LocationSearch location={resolveLocation(await params)} searchParams={await searchParams} />;
}
