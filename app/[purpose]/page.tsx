import type { Metadata } from "next";

import { LocationSearch, locationMetadata } from "@/components/location-search";
import { resolveLocation } from "@/lib/locations";

type Props = PageProps<"/[purpose]">;

// generateMetadata receives the same params Promise as the page, so the title
// follows the URL: "Flats and houses for rent in Nigeria".
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return locationMetadata(resolveLocation(await params));
}

export default async function PurposePage({ params, searchParams }: Props) {
  return <LocationSearch location={resolveLocation(await params)} searchParams={await searchParams} />;
}
