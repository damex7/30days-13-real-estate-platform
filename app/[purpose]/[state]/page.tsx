import type { Metadata } from "next";

import { LocationSearch, locationMetadata } from "@/components/location-search";
import { resolveLocation } from "@/lib/locations";

type Props = PageProps<"/[purpose]/[state]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return locationMetadata(resolveLocation(await params));
}

export default async function StatePage({ params, searchParams }: Props) {
  return <LocationSearch location={resolveLocation(await params)} searchParams={await searchParams} />;
}
