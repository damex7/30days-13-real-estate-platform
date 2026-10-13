import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ListingDetail, listingMetadata } from "@/components/listing-detail";
import { HOME_MARKET } from "@/lib/markets/sample";
import { getSampleListing, getSampleListingIds } from "@/lib/markets/sample/listings";

type Props = PageProps<"/properties/[id]">;

// The dataset is local, so every listing page is prerendered and unknown ids 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getSampleListingIds(HOME_MARKET).map((id) => ({ id }));
}

async function loadListing(params: Props["params"]) {
  const listing = getSampleListing(HOME_MARKET, (await params).id);
  if (!listing) notFound();
  return listing;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return listingMetadata(await loadListing(params));
}

export default async function ListingPage({ params }: Props) {
  return <ListingDetail listing={await loadListing(params)} backHref={HOME_MARKET.basePath} />;
}
