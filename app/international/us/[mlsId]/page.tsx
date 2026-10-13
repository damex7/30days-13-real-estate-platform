import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { ListingDetail, listingMetadata } from "@/components/listing-detail";
import { US_BASE_PATH } from "@/lib/markets/us/filters";
import { getUsListing } from "@/lib/markets/us/simplyrets";

type Props = PageProps<"/international/us/[mlsId]">;

// Shared by generateMetadata and the page so the listing is fetched once.
const loadListing = cache(async (mlsId: string) => {
  if (!/^\d{1,12}$/.test(mlsId)) notFound();
  const listing = await getUsListing(Number(mlsId));
  if (!listing) notFound();
  return listing;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return listingMetadata(await loadListing((await params).mlsId));
}

export default async function UsListingPage({ params }: Props) {
  const listing = await loadListing((await params).mlsId);
  return <ListingDetail listing={listing} backHref={US_BASE_PATH} />;
}
