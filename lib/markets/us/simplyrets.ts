import "server-only";

import { z } from "zod";

import type { Listing, ListingResults, StatusTone } from "@/lib/listing";
import { US_BASE_PATH, US_PAGE_SIZE, type UsFilters } from "@/lib/markets/us/filters";

const API_URL = "https://api.simplyrets.com";
// The public sandbox credentials; swap in real ones through the environment.
const API_KEY = process.env.SIMPLYRETS_API_KEY || "simplyrets";
const API_SECRET = process.env.SIMPLYRETS_API_SECRET || "simplyrets";
const AUTH = `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64")}`;

const REVALIDATE_SECONDS = 3600;
// The sandbox can take well over a minute to answer an uncached query.
const TIMEOUT_MS = 90_000;

// Every leaf falls back to null so one odd field never drops a whole listing.
const str = z.string().nullish().catch(null);
const num = z.number().nullish().catch(null);
const obj = <T extends z.ZodRawShape>(shape: T) => z.object(shape).nullish().catch(null);

const contact = obj({ email: str, office: str, cell: str });

const rawListingSchema = z.object({
  mlsId: z.number(),
  listPrice: num,
  listDate: str,
  remarks: str,
  disclaimer: str,
  photos: z.array(z.string()).catch([]),
  address: obj({ full: str, city: str, state: str, postalCode: str }),
  property: obj({
    type: str,
    bedrooms: num,
    bathsFull: num,
    bathsHalf: num,
    area: num,
    yearBuilt: num,
    lotSize: z.union([z.string(), z.number()]).nullish().catch(null),
    garageSpaces: num,
    stories: num,
    style: str,
    subdivision: str,
    heating: str,
    cooling: str,
    roof: str,
    foundation: str,
    pool: str,
    view: str,
    interiorFeatures: str,
    exteriorFeatures: str,
  }),
  mls: obj({ status: str, daysOnMarket: num }),
  geo: obj({ lat: num, lng: num, marketArea: str }),
  agent: obj({ firstName: str, lastName: str, contact }),
  office: obj({ name: str, contact }),
  school: obj({ district: str, elementarySchool: str, middleSchool: str, highSchool: str }),
  association: obj({ fee: num }),
});

type RawListing = z.output<typeof rawListingSchema>;

const TYPE_LABELS: Record<string, string> = {
  RES: "Single family home",
  CND: "Condo",
  RNT: "Rental",
  MLF: "Multi-family home",
  CRE: "Commercial property",
  LND: "Land",
  FRM: "Farm",
};

const STATUS_TONES: Record<string, StatusTone> = {
  Active: "green",
  ActiveUnderContract: "amber",
  Pending: "amber",
  Closed: "stone",
};

/** "ActiveUnderContract" → "Active under contract" */
function humanize(status: string) {
  const words = status.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function splitList(value: string | null | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toListing(raw: RawListing): Listing {
  const p = raw.property;
  const id = String(raw.mlsId);
  const typeLabel = p?.type ? (TYPE_LABELS[p.type] ?? p.type) : null;
  const city = raw.address?.city;
  const status = raw.mls?.status;
  const baths =
    p?.bathsFull == null && p?.bathsHalf == null ? null : (p?.bathsFull ?? 0) + (p?.bathsHalf ?? 0) * 0.5;
  const agentName = [raw.agent?.firstName, raw.agent?.lastName].filter(Boolean).join(" ");

  const details = [
    ["Style", p?.style],
    ["Year built", p?.yearBuilt],
    ["Stories", p?.stories],
    ["Garage spaces", p?.garageSpaces != null ? Math.round(p.garageSpaces) : null],
    ["Lot size", typeof p?.lotSize === "string" ? p.lotSize.replace(/\s+/g, " ") : p?.lotSize],
    ["Subdivision", p?.subdivision],
    ["Heating", p?.heating],
    ["Cooling", p?.cooling],
    ["Roof", p?.roof],
    ["Foundation", p?.foundation],
    ["Pool", p?.pool],
    ["View", p?.view],
    ["HOA fee", raw.association?.fee != null ? `$${raw.association.fee.toLocaleString("en-US")}` : null],
  ]
    .filter((entry): entry is [string, string | number] => entry[1] != null && entry[1] !== "")
    .map(([label, value]) => ({ label, value: String(value) }));

  const schools = [
    ["Elementary", raw.school?.elementarySchool],
    ["Middle", raw.school?.middleSchool],
    ["High", raw.school?.highSchool],
    ["District", raw.school?.district],
  ]
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([label, name]) => ({ label, name }));

  return {
    id,
    href: `${US_BASE_PATH}/${id}`,
    reference: `MLS #${id}`,
    title: `${typeLabel ?? "Home"}${city ? ` in ${city}` : ""}`,
    address: raw.address?.full ?? "Address withheld",
    locality:
      [city, [raw.address?.state, raw.address?.postalCode].filter(Boolean).join(" ")]
        .filter(Boolean)
        .join(", ") || null,
    price: raw.listPrice ?? null,
    currency: "USD",
    pricePeriod: null,
    status: status ? { label: humanize(status), tone: STATUS_TONES[status] ?? "stone" } : null,
    typeLabel,
    beds: p?.bedrooms ?? null,
    baths,
    area: p?.area != null ? { value: p.area, unit: "sq ft", kind: "floor" } : null,
    yearBuilt: p?.yearBuilt ?? null,
    // CloudFront serves one size per photo.
    photos: raw.photos.map((src) => ({ full: src, thumb: src })),
    description: raw.remarks ?? null,
    listedAt: raw.listDate ?? null,
    daysOnMarket: raw.mls?.daysOnMarket ?? null,
    coords: raw.geo?.lat != null && raw.geo?.lng != null ? { lat: raw.geo.lat, lng: raw.geo.lng } : null,
    agent: agentName
      ? {
          name: agentName,
          company: raw.office?.name ?? null,
          email: raw.agent?.contact?.email ?? null,
          phone: raw.agent?.contact?.cell ?? raw.agent?.contact?.office ?? null,
        }
      : null,
    details,
    features: [...new Set([...splitList(p?.interiorFeatures), ...splitList(p?.exteriorFeatures)])],
    schools,
    disclaimer: raw.disclaimer ?? null,
  };
}

function parseListings(data: unknown) {
  if (!Array.isArray(data)) throw new Error("SimplyRETS returned an unexpected payload");
  return data.flatMap((item) => {
    const result = rawListingSchema.safeParse(item);
    return result.success ? [toListing(result.data)] : [];
  });
}

async function request(path: string, retries = 1): Promise<Response> {
  try {
    return await fetch(`${API_URL}${path}`, {
      headers: { Authorization: AUTH, Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["listings"] },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    // The sandbox host drops connections now and then; one retry usually lands.
    const isTimeout = error instanceof DOMException && error.name === "TimeoutError";
    if (retries > 0 && !isTimeout) return request(path, retries - 1);
    throw error;
  }
}

export async function searchUsListings(filters: UsFilters): Promise<ListingResults> {
  const params = new URLSearchParams({
    limit: String(US_PAGE_SIZE),
    offset: String((filters.page - 1) * US_PAGE_SIZE),
    sort: filters.sort,
  });
  if (filters.q) params.set("q", filters.q);
  if (filters.type) params.set("type", filters.type);
  if (filters.minprice != null) params.set("minprice", String(filters.minprice));
  if (filters.maxprice != null) params.set("maxprice", String(filters.maxprice));
  if (filters.minbeds != null) params.set("minbeds", String(filters.minbeds));
  if (filters.minbaths != null) params.set("minbaths", String(filters.minbaths));

  const res = await request(`/properties?${params}`);
  if (!res.ok) throw new Error(`SimplyRETS search failed with ${res.status}`);
  const listings = parseListings(await res.json());
  // No total count is returned, so paging relies on the Link header.
  const hasNext = /rel="next"/.test(res.headers.get("link") ?? "") && listings.length === US_PAGE_SIZE;
  return { listings, hasNext, total: null };
}

export async function getUsListing(mlsId: number) {
  const res = await request(`/properties/${mlsId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`SimplyRETS listing ${mlsId} failed with ${res.status}`);
  const result = rawListingSchema.safeParse(await res.json());
  return result.success ? toListing(result.data) : null;
}
