/** The shape every market's data source is normalized into before rendering. */

export type Currency = "NGN" | "USD" | "GBP" | "AED" | "GHS" | "KES" | "ZAR";

export type StatusTone = "green" | "blue" | "amber" | "stone";

export type ListingPhoto = {
  /** Large image for the detail gallery. */
  full: string;
  /** Smaller image for cards and gallery thumbnails. */
  thumb: string;
};

export type Listing = {
  id: string;
  href: string;
  /** Human reference shown on the detail page, e.g. "MLS #1005221". */
  reference: string;
  title: string;
  address: string;
  locality: string | null;
  price: number | null;
  currency: Currency;
  /** Set for rentals: yearly in Nigeria and the UAE, monthly elsewhere. */
  pricePeriod: "year" | "month" | null;
  status: { label: string; tone: StatusTone } | null;
  typeLabel: string | null;
  beds: number | null;
  baths: number | null;
  area: { value: number; unit: "sq ft" | "sqm"; kind: "floor" | "land" } | null;
  yearBuilt: number | null;
  photos: ListingPhoto[];
  description: string | null;
  listedAt: string | null;
  daysOnMarket: number | null;
  coords: { lat: number; lng: number } | null;
  agent: { name: string; company: string | null; email: string | null; phone: string | null } | null;
  details: { label: string; value: string }[];
  features: string[];
  schools: { label: string; name: string }[];
  disclaimer: string | null;
};

export type ListingResults = {
  listings: Listing[];
  hasNext: boolean;
  /** Known for local data; the SimplyRETS API doesn't report it. */
  total: number | null;
};
