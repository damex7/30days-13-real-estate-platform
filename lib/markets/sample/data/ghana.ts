/** Sample Ghanaian listings. Prices are illustrative and agents are fictional. */

import type { SampleMarket } from "@/lib/markets/sample/types";

export const ghana: SampleMarket = {
  slug: "ghana",
  code: "GH",
  name: "Ghana",
  basePath: "/international/ghana",
  currency: "GHS",
  rentPeriod: "month",
  sizeUnit: "sqm",
  regionLabel: "Region",
  regions: [
    { value: "greater-accra", label: "Greater Accra" },
    { value: "ashanti", label: "Ashanti" },
  ],
  types: [
    { value: "detached-house", label: "Detached house", category: "house", titleNoun: "Detached House" },
    { value: "townhouse", label: "Townhouse", category: "house", titleNoun: "Townhouse" },
    { value: "apartment", label: "Apartment", category: "flat", titleNoun: "Apartment" },
    { value: "chamber-and-hall", label: "Chamber and hall", category: "small", titleNoun: "Chamber and Hall" },
    { value: "land", label: "Land", category: "land" },
  ],
  areas: {
    eastLegon: { name: "East Legon", city: "Accra", region: "greater-accra", lat: 5.636, lng: -0.161, blurb: "East Legon is one of Accra's most popular residential areas, close to the airport, the University of Ghana and A&C Mall." },
    cantonments: { name: "Cantonments", city: "Accra", region: "greater-accra", lat: 5.576, lng: -0.172, blurb: "Cantonments is an upscale, central Accra neighbourhood home to embassies and the Marina Mall." },
    airportRes: { name: "Airport Residential Area", city: "Accra", region: "greater-accra", lat: 5.6, lng: -0.18, blurb: "Airport Residential Area is a leafy, secure district beside Kotoka International Airport." },
    osu: { name: "Osu", city: "Accra", region: "greater-accra", lat: 5.556, lng: -0.182, blurb: "Osu is Accra's buzzing nightlife and shopping district, centred on Oxford Street." },
    spintex: { name: "Spintex", city: "Accra", region: "greater-accra", lat: 5.635, lng: -0.095, blurb: "Spintex Road is a busy suburb between Accra and Tema with good-value homes." },
    tema: { name: "Community 25", city: "Tema", region: "greater-accra", lat: 5.7, lng: -0.005, blurb: "Tema is Ghana's port city, a planned town of numbered communities with quick access to the motorway." },
    oyarifa: { name: "Oyarifa", city: "Accra", region: "greater-accra", lat: 5.74, lng: -0.17, blurb: "Oyarifa is a fast-growing area north of Accra, near the Aburi hills." },
    ahodwo: { name: "Ahodwo", city: "Kumasi", region: "ashanti", lat: 6.665, lng: -1.62, blurb: "Ahodwo is a quiet, upmarket part of Kumasi close to hotels, schools and the city centre." },
  },
  agents: {
    kwame: { name: "Kwame Asante", company: "Adinkra Homes" },
    efua: { name: "Efua Mensah", company: "Coastline Realty Ghana" },
    akosua: { name: "Akosua Boateng", company: "Ashanti Gate Properties" },
  },
  seeds: [
    { id: 4001, purpose: "sale", type: "detached-house", beds: 4, baths: 5, area: "eastLegon", street: "American House", price: 6_500_000, size: 380, listed: "2026-10-07", agent: "kwame", titleSuffix: "with Boys' Quarters", doc: "Land Title Certificate", parking: 3, features: ["Boys' quarters", "Swimming pool", "Gated community", "Standby generator"] },
    { id: 4002, purpose: "sale", type: "apartment", beds: 3, baths: 3, area: "cantonments", street: "Embassy Road", price: 4_600_000, size: 210, listed: "2026-09-26", agent: "kwame", doc: "Leasehold (99 years)", serviceCharge: 3_500, parking: 2, features: ["Swimming pool", "Gym", "24-hour security", "Backup generator"] },
    { id: 4003, purpose: "sale", type: "townhouse", beds: 4, baths: 4, area: "airportRes", street: "Liberation Road", price: 7_800_000, size: 320, listed: "2026-09-12", agent: "kwame", doc: "Leasehold (50 years)", parking: 2, features: ["Gated community", "Private garden", "Staff quarters", "Water storage tank"] },
    { id: 4004, purpose: "rent", type: "apartment", beds: 2, baths: 2, area: "eastLegon", street: "Lagos Avenue", price: 15_000, size: 120, listed: "2026-10-04", agent: "efua", furnished: true, parking: 1, features: ["Fully furnished", "Swimming pool", "Backup generator", "24-hour security"] },
    { id: 4005, purpose: "rent", type: "apartment", beds: 1, baths: 1, area: "osu", street: "Oxford Street", price: 9_000, size: 70, listed: "2026-10-09", agent: "efua", furnished: true, features: ["Walk to Oxford Street", "Air conditioning", "Backup generator"] },
    { id: 4006, purpose: "rent", type: "chamber-and-hall", beds: 1, baths: 1, area: "spintex", street: "Spintex Road", price: 1_800, size: 40, listed: "2026-10-01", agent: "efua", features: ["Self-contained", "Prepaid meter", "Polytank water storage"] },
    { id: 4007, purpose: "sale", type: "detached-house", beds: 3, baths: 3, area: "tema", street: "Community 25", price: 1_600_000, size: 200, listed: "2026-09-19", agent: "efua", doc: "Leasehold (Tema Development Corporation)", parking: 2, features: ["Gated estate", "Fitted kitchen", "Walled compound"] },
    { id: 4008, purpose: "sale", type: "land", area: "oyarifa", street: "Oyarifa Ridge", price: 280_000, size: 650, listed: "2026-08-26", agent: "kwame", doc: "Indenture and site plan", features: ["Residential plot", "Walled estate", "Near the Aburi road"] },
    { id: 4009, purpose: "sale", type: "detached-house", beds: 4, baths: 4, area: "ahodwo", street: "Ahodwo Roundabout", price: 2_800_000, size: 320, listed: "2026-09-09", agent: "akosua", doc: "Land Title Certificate", parking: 2, features: ["Boys' quarters", "Walled compound", "Borehole"] },
    { id: 4010, purpose: "rent", type: "detached-house", beds: 3, baths: 3, area: "ahodwo", street: "Nhyiaeso", price: 6_500, size: 220, listed: "2026-10-02", agent: "akosua", parking: 2, features: ["Walled compound", "Borehole", "Quiet neighbourhood"] },
  ],
  priceOptions: [2_000, 5_000, 10_000, 25_000, 50_000, 500_000, 1_000_000, 2_500_000, 5_000_000, 10_000_000],
  docLabel: "Title",
  serviceCharge: { label: "Service charge", period: "month" },
  rentTerms: [
    ["Advance", "12–24 months paid upfront"],
    ["Agent's commission", "10% of the first year's rent"],
  ],
  luxuryFrom: { sale: 8_000_000, rent: 50_000 },
  keywordPlaceholder: "Area or street",
  tagline: "Accra, Tema and Kumasi",
};
