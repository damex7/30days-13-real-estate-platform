/**
 * Sample Nigerian listings, the site's home market. Nigeria has no shared MLS
 * feed or public listings API, so the site ships its own demo dataset. Prices
 * are illustrative, agents and companies are fictional, and photos come from
 * Unsplash.
 */

import type { Agent, Area, SampleMarket, Seed } from "@/lib/markets/sample/types";

const AREAS: Record<string, Area> = {
  ikoyi: { name: "Ikoyi", city: "Lagos", region: "lagos", lat: 6.4549, lng: 3.4346, blurb: "Ikoyi is one of Lagos's most established addresses, with leafy streets, embassies and quick access to Victoria Island." },
  vi: { name: "Victoria Island", city: "Lagos", region: "lagos", lat: 6.4281, lng: 3.4219, blurb: "Victoria Island is the city's business district, minutes from banks, restaurants and the Atlantic coastline." },
  lekki1: { name: "Lekki Phase 1", city: "Lagos", region: "lagos", lat: 6.4478, lng: 3.4723, blurb: "Lekki Phase 1 is a planned estate with good roads, shopping on Admiralty Way and an easy bridge link to Ikoyi." },
  chevron: { name: "Chevron, Lekki", city: "Lagos", region: "lagos", lat: 6.4387, lng: 3.5321, blurb: "The Chevron axis of Lekki is popular with families for its gated estates and schools along the Lekki–Epe Expressway." },
  ajah: { name: "Ajah", city: "Lagos", region: "lagos", lat: 6.4682, lng: 3.5852, blurb: "Ajah offers more space for the money than central Lekki, with new estates and markets close by." },
  ibeju: { name: "Ibeju-Lekki", city: "Lagos", region: "lagos", lat: 6.4686, lng: 3.803, blurb: "Ibeju-Lekki is Lagos's growth corridor, home to the Lekki Free Trade Zone, the Dangote Refinery and the new Lekki Deep Sea Port." },
  ikejaGra: { name: "Ikeja GRA", city: "Lagos", region: "lagos", lat: 6.5795, lng: 3.35, blurb: "Ikeja GRA is a quiet, low-density neighbourhood close to the airport and the state secretariat." },
  magodo: { name: "Magodo Phase 2", city: "Lagos", region: "lagos", lat: 6.617, lng: 3.39, blurb: "Magodo Phase 2 is a gated residential estate on the mainland with controlled access and wide streets." },
  yaba: { name: "Yaba", city: "Lagos", region: "lagos", lat: 6.5095, lng: 3.3711, blurb: "Yaba is the mainland's tech and student hub, near UNILAG, YabaTech and plenty of transport links." },
  surulere: { name: "Surulere", city: "Lagos", region: "lagos", lat: 6.5, lng: 3.35, blurb: "Surulere is a lively, central mainland district with markets, the National Stadium and good road access." },
  maitama: { name: "Maitama", city: "Abuja", region: "abuja", lat: 9.088, lng: 7.493, blurb: "Maitama is Abuja's premier district, home to diplomats and senior officials, with wide, quiet streets." },
  asokoro: { name: "Asokoro", city: "Abuja", region: "abuja", lat: 9.043, lng: 7.53, blurb: "Asokoro is a secure, high-end district near the Presidential Villa with mature greenery." },
  wuse2: { name: "Wuse 2", city: "Abuja", region: "abuja", lat: 9.079, lng: 7.47, blurb: "Wuse 2 is central Abuja's busiest neighbourhood for restaurants, shopping and offices." },
  guzape: { name: "Guzape", city: "Abuja", region: "abuja", lat: 9.02, lng: 7.505, blurb: "Guzape is a fast-developing hillside district with new luxury homes and views across the city." },
  gwarimpa: { name: "Gwarimpa", city: "Abuja", region: "abuja", lat: 9.11, lng: 7.405, blurb: "Gwarimpa is one of the largest housing estates in West Africa, popular with families." },
  jabi: { name: "Jabi", city: "Abuja", region: "abuja", lat: 9.07, lng: 7.425, blurb: "Jabi sits beside Jabi Lake and its mall, with easy access to the city centre." },
  katampe: { name: "Katampe Extension", city: "Abuja", region: "abuja", lat: 9.115, lng: 7.455, blurb: "Katampe Extension is a hilly, upcoming district next to Maitama, popular for new builds." },
  lugbe: { name: "Lugbe", city: "Abuja", region: "abuja", lat: 8.98, lng: 7.38, blurb: "Lugbe is an affordable, growing suburb along the airport road." },
  lifeCamp: { name: "Life Camp", city: "Abuja", region: "abuja", lat: 9.08, lng: 7.4, blurb: "Life Camp is a residential district close to Gwarimpa and Jabi with many gated estates." },
  phGra: { name: "GRA Phase 2", city: "Port Harcourt", region: "rivers", lat: 4.824, lng: 7.005, blurb: "GRA Phase 2 is Port Harcourt's best-known residential area, close to restaurants and offices." },
  transAmadi: { name: "Trans Amadi", city: "Port Harcourt", region: "rivers", lat: 4.815, lng: 7.05, blurb: "Trans Amadi is Port Harcourt's industrial and commercial hub, popular with oil and gas workers." },
  rumuola: { name: "Rumuola", city: "Port Harcourt", region: "rivers", lat: 4.84, lng: 7.0, blurb: "Rumuola is a central, well-connected neighbourhood with affordable rents." },
  peterOdili: { name: "Peter Odili Road", city: "Port Harcourt", region: "rivers", lat: 4.79, lng: 7.06, blurb: "Peter Odili Road is lined with newer gated estates and shopping centres." },
  bodija: { name: "Bodija", city: "Ibadan", region: "oyo", lat: 7.43, lng: 3.91, blurb: "Bodija is one of Ibadan's established estates, close to the University of Ibadan." },
  akobo: { name: "Akobo", city: "Ibadan", region: "oyo", lat: 7.43, lng: 3.95, blurb: "Akobo is a growing residential area on the east of Ibadan with good value homes." },
  jericho: { name: "Jericho", city: "Ibadan", region: "oyo", lat: 7.4, lng: 3.87, blurb: "Jericho GRA is a quiet, leafy part of Ibadan close to hospitals and schools." },
  oluyole: { name: "Oluyole Estate", city: "Ibadan", region: "oyo", lat: 7.36, lng: 3.87, blurb: "Oluyole Estate is a planned residential and commercial estate in southern Ibadan." },
};

const AGENTS: Record<string, Agent> = {
  adaeze: { name: "Adaeze Okafor", company: "Eko Haven Realty" },
  emeka: { name: "Emeka Nwosu", company: "Admiralty Homes" },
  tunde: { name: "Tunde Bakare", company: "Lagoon Coast Properties" },
  folake: { name: "Folake Adebayo", company: "Mainland Keys Realty" },
  halima: { name: "Halima Yusuf", company: "Capital Crest Properties" },
  chinedu: { name: "Chinedu Eze", company: "Garden City Homes" },
  segun: { name: "Segun Ajayi", company: "Oluyole Realty" },
};

const SEEDS: Seed[] = [
  // Lagos: Ikoyi and Victoria Island
  { id: 1001, purpose: "sale", type: "detached-duplex", beds: 6, baths: 7, toilets: 8, area: "ikoyi", street: "Banana Island Road", price: 2_800_000_000, size: 1200, listed: "2026-10-08", agent: "adaeze", titleSuffix: "with Pool and BQ", doc: "Governor's Consent", condition: "Newly built", parking: 6, features: ["Swimming pool", "Cinema room", "Elevator", "Boys' quarters (BQ)", "Smart home system", "24/7 power supply", "CCTV"] },
  { id: 1002, purpose: "sale", type: "flat", beds: 3, baths: 3, toilets: 4, area: "ikoyi", street: "Bourdillon Road", price: 480_000_000, size: 280, listed: "2026-09-30", agent: "adaeze", doc: "Governor's Consent", serviceCharge: 6_000_000, condition: "Newly built", parking: 2, features: ["Swimming pool", "Gym", "Elevator", "24/7 power supply", "Fully serviced"] },
  { id: 1003, purpose: "rent", type: "flat", beds: 3, baths: 3, toilets: 4, area: "ikoyi", street: "Glover Road", price: 28_000_000, size: 250, listed: "2026-10-05", agent: "adaeze", serviceCharge: 5_000_000, furnished: true, parking: 2, features: ["Fully serviced", "Swimming pool", "Gym", "24/7 power supply", "Elevator"] },
  { id: 1042, purpose: "rent", type: "detached-duplex", beds: 5, baths: 6, toilets: 7, area: "ikoyi", street: "Osborne Road", price: 60_000_000, size: 650, listed: "2026-09-21", agent: "adaeze", serviceCharge: 6_000_000, titleSuffix: "with Pool", parking: 4, features: ["Swimming pool", "Boys' quarters (BQ)", "Fully serviced", "24/7 power supply", "Gated estate"] },
  { id: 1004, purpose: "sale", type: "flat", beds: 4, baths: 4, toilets: 5, area: "vi", street: "Ozumba Mbadiwe Avenue", price: 650_000_000, size: 380, listed: "2026-09-12", agent: "emeka", title: "4 Bedroom Penthouse", doc: "Governor's Consent", serviceCharge: 7_500_000, parking: 3, features: ["Ocean view", "Rooftop terrace", "Elevator", "Swimming pool", "24/7 power supply"] },
  { id: 1005, purpose: "rent", type: "flat", beds: 2, baths: 2, toilets: 3, area: "vi", street: "Adeola Odeku Street", price: 12_000_000, size: 150, listed: "2026-10-02", agent: "emeka", serviceCharge: 3_000_000, furnished: true, parking: 1, features: ["Fully serviced", "24/7 power supply", "Gym", "Elevator"] },

  // Lagos: Lekki and beyond
  { id: 1006, purpose: "sale", type: "semi-detached-duplex", beds: 4, baths: 4, toilets: 5, area: "lekki1", street: "Off Admiralty Way", price: 280_000_000, size: 350, listed: "2026-10-09", agent: "emeka", titleSuffix: "with BQ", doc: "Governor's Consent", condition: "Newly built", parking: 3, features: ["Boys' quarters (BQ)", "Fitted kitchen", "POP ceilings", "Ample parking", "Gated estate"] },
  { id: 1007, purpose: "sale", type: "detached-duplex", beds: 5, baths: 5, toilets: 6, area: "lekki1", street: "Fola Osibo Road", price: 550_000_000, size: 500, listed: "2026-08-28", agent: "emeka", titleSuffix: "with Pool", doc: "Governor's Consent", parking: 4, features: ["Swimming pool", "Boys' quarters (BQ)", "Cinema room", "Smart home system", "Inverter backup"] },
  { id: 1008, purpose: "rent", type: "flat", beds: 3, baths: 3, toilets: 4, area: "lekki1", street: "Freedom Way", price: 8_500_000, size: 180, listed: "2026-09-25", agent: "tunde", serviceCharge: 1_500_000, parking: 2, features: ["Fully serviced", "24/7 power supply", "Borehole water", "24-hour security"] },
  { id: 1009, purpose: "sale", type: "terraced-duplex", beds: 4, baths: 4, toilets: 5, area: "chevron", street: "Chevron Drive", price: 165_000_000, size: 260, listed: "2026-09-18", agent: "tunde", titleSuffix: "with BQ", doc: "Deed of Assignment", condition: "Newly built", parking: 2, features: ["Gated estate", "Boys' quarters (BQ)", "Fitted kitchen", "24-hour security"] },
  { id: 1010, purpose: "rent", type: "semi-detached-duplex", beds: 4, baths: 4, toilets: 5, area: "chevron", street: "Orchid Road", price: 7_000_000, size: 300, listed: "2026-10-01", agent: "tunde", serviceCharge: 800_000, parking: 2, features: ["Gated estate", "Boys' quarters (BQ)", "Borehole water", "Prepaid meter"] },
  { id: 1011, purpose: "sale", type: "terraced-duplex", beds: 3, baths: 3, toilets: 4, area: "ajah", street: "Abraham Adesanya Road", price: 85_000_000, size: 200, listed: "2026-09-08", agent: "tunde", doc: "Deed of Assignment", parking: 2, features: ["Gated estate", "Fitted kitchen", "Interlocked compound"] },
  { id: 1012, purpose: "rent", type: "flat", beds: 2, baths: 2, toilets: 3, area: "ajah", street: "Badore Road", price: 2_800_000, size: 110, listed: "2026-10-06", agent: "tunde", parking: 1, features: ["Prepaid meter", "Borehole water", "Gated estate"] },
  { id: 1013, purpose: "sale", type: "land", area: "ibeju", street: "Lekki–Epe Expressway", price: 28_000_000, size: 600, listed: "2026-09-03", agent: "tunde", doc: "Registered Survey & Excision", features: ["Dry land", "Gated estate", "Close to the Free Trade Zone"] },
  { id: 1014, purpose: "sale", type: "land", area: "ibeju", street: "Eleko Junction", price: 18_000_000, size: 648, listed: "2026-08-20", agent: "tunde", doc: "Survey & Deed of Assignment", features: ["Dry land", "Instant allocation", "Payment plan available"] },
  { id: 1015, purpose: "sale", type: "bungalow", beds: 3, baths: 3, toilets: 4, area: "ibeju", street: "Awoyaya", price: 65_000_000, size: 180, listed: "2026-09-14", agent: "tunde", doc: "Deed of Assignment", condition: "Newly built", parking: 2, features: ["Gated estate", "Fitted kitchen", "Borehole water", "Interlocked compound"] },

  // Lagos: mainland
  { id: 1016, purpose: "sale", type: "detached-duplex", beds: 5, baths: 6, toilets: 7, area: "ikejaGra", street: "Isaac John Street", price: 650_000_000, size: 700, listed: "2026-09-22", agent: "folake", titleSuffix: "with BQ", doc: "Certificate of Occupancy (C of O)", parking: 5, features: ["Boys' quarters (BQ)", "Swimming pool", "Ample parking", "24/7 power supply"] },
  { id: 1017, purpose: "rent", type: "flat", beds: 3, baths: 3, toilets: 4, area: "ikejaGra", street: "Joel Ogunnaike Street", price: 6_000_000, size: 170, listed: "2026-10-07", agent: "folake", serviceCharge: 1_200_000, parking: 2, features: ["Fully serviced", "24/7 power supply", "24-hour security", "Borehole water"] },
  { id: 1018, purpose: "sale", type: "detached-duplex", beds: 4, baths: 5, toilets: 6, area: "magodo", street: "Shangisha", price: 320_000_000, size: 450, listed: "2026-08-30", agent: "folake", titleSuffix: "with BQ", doc: "Certificate of Occupancy (C of O)", parking: 4, features: ["Boys' quarters (BQ)", "Gated estate", "Fitted kitchen", "Ample parking"] },
  { id: 1019, purpose: "rent", type: "mini-flat", beds: 1, baths: 1, toilets: 2, area: "yaba", street: "Alagomeji", price: 1_800_000, size: 45, listed: "2026-10-10", agent: "folake", features: ["Prepaid meter", "Borehole water", "Tiled floors"] },
  { id: 1020, purpose: "rent", type: "self-contain", beds: 1, baths: 1, toilets: 1, area: "yaba", street: "Akoka", price: 850_000, size: 25, listed: "2026-10-04", agent: "folake", features: ["Prepaid meter", "Close to UNILAG", "Shared compound"] },
  { id: 1021, purpose: "rent", type: "flat", beds: 2, baths: 2, toilets: 3, area: "yaba", street: "Herbert Macaulay Way", price: 3_200_000, size: 90, listed: "2026-09-27", agent: "folake", condition: "Renovated", parking: 1, features: ["Prepaid meter", "Borehole water", "Newly renovated"] },
  { id: 1022, purpose: "sale", type: "flat", beds: 3, baths: 3, toilets: 4, area: "surulere", street: "Adeniran Ogunsanya Street", price: 75_000_000, size: 150, listed: "2026-09-05", agent: "folake", doc: "Deed of Assignment", parking: 2, features: ["Gated compound", "Borehole water", "Ample parking"] },
  { id: 1023, purpose: "rent", type: "flat", beds: 3, baths: 2, toilets: 3, area: "surulere", street: "Bode Thomas Street", price: 3_500_000, size: 130, listed: "2026-09-29", agent: "folake", parking: 1, features: ["Prepaid meter", "Borehole water", "Ample parking"] },

  // Abuja
  { id: 1024, purpose: "sale", type: "detached-duplex", beds: 6, baths: 7, toilets: 8, area: "maitama", street: "Mississippi Street", price: 2_200_000_000, size: 1500, listed: "2026-09-20", agent: "halima", titleSuffix: "with Pool", doc: "Certificate of Occupancy (C of O)", parking: 6, features: ["Swimming pool", "Boys' quarters (BQ)", "Cinema room", "Elevator", "Smart home system", "24/7 power supply"] },
  { id: 1025, purpose: "sale", type: "detached-duplex", beds: 5, baths: 6, toilets: 7, area: "asokoro", street: "Yakubu Gowon Crescent", price: 1_100_000_000, size: 1000, listed: "2026-08-25", agent: "halima", titleSuffix: "with BQ", doc: "Certificate of Occupancy (C of O)", parking: 5, features: ["Boys' quarters (BQ)", "Swimming pool", "24-hour security", "Ample parking"] },
  { id: 1026, purpose: "rent", type: "flat", beds: 3, baths: 3, toilets: 4, area: "wuse2", street: "Aminu Kano Crescent", price: 9_000_000, size: 160, listed: "2026-10-03", agent: "halima", serviceCharge: 1_500_000, parking: 2, features: ["Fully serviced", "24/7 power supply", "Elevator", "Gym"] },
  { id: 1027, purpose: "sale", type: "semi-detached-duplex", beds: 5, baths: 5, toilets: 6, area: "guzape", street: "Guzape Hills", price: 480_000_000, size: 450, listed: "2026-09-16", agent: "halima", doc: "Certificate of Occupancy (C of O)", condition: "Newly built", parking: 3, features: ["Boys' quarters (BQ)", "Smart home system", "City views", "Fitted kitchen"] },
  { id: 1028, purpose: "sale", type: "terraced-duplex", beds: 4, baths: 4, toilets: 5, area: "gwarimpa", street: "6th Avenue", price: 175_000_000, size: 250, listed: "2026-09-10", agent: "halima", titleSuffix: "with BQ", doc: "Certificate of Occupancy (C of O)", parking: 2, features: ["Boys' quarters (BQ)", "Gated estate", "Fitted kitchen"] },
  { id: 1029, purpose: "rent", type: "detached-duplex", beds: 5, baths: 5, toilets: 6, area: "gwarimpa", street: "1st Avenue", price: 10_000_000, size: 500, listed: "2026-09-24", agent: "halima", titleSuffix: "with BQ", parking: 4, features: ["Boys' quarters (BQ)", "Ample parking", "Borehole water", "Prepaid meter"] },
  { id: 1030, purpose: "rent", type: "flat", beds: 2, baths: 2, toilets: 3, area: "jabi", street: "Obafemi Awolowo Way", price: 4_500_000, size: 100, listed: "2026-10-08", agent: "halima", serviceCharge: 600_000, parking: 1, features: ["Fully serviced", "Borehole water", "24-hour security"] },
  { id: 1031, purpose: "sale", type: "land", area: "katampe", street: "Katampe Extension Hill", price: 150_000_000, size: 1000, listed: "2026-08-18", agent: "halima", doc: "Certificate of Occupancy (C of O)", features: ["Residential plot", "Good access road", "Hilltop views"] },
  { id: 1032, purpose: "sale", type: "bungalow", beds: 3, baths: 3, toilets: 4, area: "lugbe", street: "Airport Road", price: 55_000_000, size: 200, listed: "2026-09-01", agent: "halima", doc: "Deed of Assignment", parking: 2, features: ["Gated estate", "Borehole water", "Interlocked compound"] },
  { id: 1033, purpose: "sale", type: "semi-detached-duplex", beds: 4, baths: 4, toilets: 5, area: "lifeCamp", street: "Life Camp", price: 220_000_000, size: 320, listed: "2026-09-26", agent: "halima", titleSuffix: "with BQ", doc: "Certificate of Occupancy (C of O)", parking: 3, features: ["Boys' quarters (BQ)", "Gated estate", "Fitted kitchen", "POP ceilings"] },

  // Port Harcourt
  { id: 1034, purpose: "sale", type: "detached-duplex", beds: 5, baths: 5, toilets: 6, area: "phGra", street: "Tombia Street", price: 280_000_000, size: 600, listed: "2026-09-15", agent: "chinedu", doc: "Certificate of Occupancy (C of O)", parking: 4, features: ["Ample parking", "24/7 power supply", "Borehole water", "24-hour security"] },
  { id: 1035, purpose: "rent", type: "flat", beds: 3, baths: 3, toilets: 4, area: "transAmadi", street: "Trans Amadi Layout", price: 3_500_000, size: 150, listed: "2026-10-05", agent: "chinedu", serviceCharge: 500_000, parking: 1, features: ["Fully serviced", "24-hour security", "Borehole water"] },
  { id: 1036, purpose: "rent", type: "mini-flat", beds: 1, baths: 1, toilets: 2, area: "rumuola", street: "Rumuola Road", price: 1_200_000, size: 50, listed: "2026-09-30", agent: "chinedu", features: ["Prepaid meter", "Borehole water"] },
  { id: 1037, purpose: "sale", type: "terraced-duplex", beds: 4, baths: 4, toilets: 5, area: "peterOdili", street: "Peter Odili Road", price: 120_000_000, size: 240, listed: "2026-08-27", agent: "chinedu", titleSuffix: "with BQ", doc: "Deed of Assignment", parking: 2, features: ["Gated estate", "Boys' quarters (BQ)", "Fitted kitchen"] },

  // Ibadan
  { id: 1038, purpose: "sale", type: "detached-duplex", beds: 4, baths: 4, toilets: 5, area: "bodija", street: "Awolowo Avenue", price: 150_000_000, size: 600, listed: "2026-09-09", agent: "segun", titleSuffix: "with BQ", doc: "Certificate of Occupancy (C of O)", parking: 4, features: ["Boys' quarters (BQ)", "Ample parking", "Borehole water", "Large compound"] },
  { id: 1039, purpose: "sale", type: "bungalow", beds: 3, baths: 3, toilets: 4, area: "akobo", street: "Akobo Road", price: 42_000_000, size: 180, listed: "2026-09-19", agent: "segun", doc: "Deed of Assignment", parking: 2, features: ["Fenced compound", "Borehole water", "Tiled floors"] },
  { id: 1040, purpose: "rent", type: "flat", beds: 3, baths: 3, toilets: 4, area: "jericho", street: "Jericho GRA", price: 1_800_000, size: 140, listed: "2026-10-02", agent: "segun", parking: 1, features: ["Prepaid meter", "Borehole water", "Quiet neighbourhood"] },
  { id: 1041, purpose: "sale", type: "land", area: "oluyole", street: "Oluyole Estate", price: 22_000_000, size: 600, listed: "2026-08-22", agent: "segun", doc: "Certificate of Occupancy (C of O)", features: ["Residential plot", "Fenced estate", "Good access road"] },
];

export const nigeria: SampleMarket = {
  slug: "ng",
  code: "NG",
  name: "Nigeria",
  basePath: "/properties",
  currency: "NGN",
  rentPeriod: "year",
  sizeUnit: "sqm",
  regionLabel: "State",
  regions: [
    { value: "lagos", label: "Lagos" },
    { value: "abuja", label: "Abuja (FCT)" },
    { value: "rivers", label: "Rivers" },
    { value: "oyo", label: "Oyo" },
  ],
  types: [
    { value: "detached-duplex", label: "Detached duplex", category: "house", titleNoun: "Detached Duplex" },
    { value: "semi-detached-duplex", label: "Semi-detached duplex", category: "house", titleNoun: "Semi-Detached Duplex" },
    { value: "terraced-duplex", label: "Terraced duplex", category: "house", titleNoun: "Terraced Duplex" },
    { value: "bungalow", label: "Bungalow", category: "bungalow", titleNoun: "Bungalow" },
    { value: "flat", label: "Flat / apartment", category: "flat", titleNoun: "Flat" },
    { value: "mini-flat", label: "Mini flat", category: "small", titleNoun: "Mini Flat" },
    { value: "self-contain", label: "Self-contain", category: "small", titleNoun: "Self-Contain" },
    { value: "land", label: "Land", category: "land" },
  ],
  areas: AREAS,
  agents: AGENTS,
  seeds: SEEDS,
  // Wide enough for both yearly rents and sale prices.
  priceOptions: [
    500_000, 1_000_000, 2_500_000, 5_000_000, 10_000_000, 25_000_000, 50_000_000, 100_000_000,
    250_000_000, 500_000_000, 1_000_000_000, 2_500_000_000,
  ],
  docLabel: "Title document",
  serviceCharge: { label: "Service charge", period: "year" },
  rentTerms: [
    ["Agency fee", "10% of annual rent"],
    ["Legal fee", "10% of annual rent"],
    ["Caution deposit", "Refundable, agreed at signing"],
  ],
  luxuryFrom: { sale: 400_000_000, rent: 15_000_000 },
  keywordPlaceholder: "Area, estate, street",
  tagline: "Lagos · Abuja · Port Harcourt · Ibadan",
};
