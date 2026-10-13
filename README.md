# Hearthstone Realty: Day 13 Real Estate Platform

A server-rendered real estate listings site built with Next.js 16.4 (App Router), TypeScript and Tailwind CSS v4.

Nigeria is the main market, covering Lagos, Abuja, Port Harcourt and Ibadan. An **International** section adds the UK, UAE, Ghana, Kenya and South Africa, plus US listings around Houston, TX pulled live from the [SimplyRETS](https://simplyrets.com) API.

## Features

- **Home page** with:
  - a hero search (keyword, buy or rent, property type, maximum price);
  - city shortcuts with listing counts;
  - popular searches;
  - the newest Nigerian listings;
  - links to the international markets.
- **Nigerian search** at `/properties`.
  - Filters: keyword, buy or rent, state, property type, price range, bedrooms and sort order.
  - Property types include duplexes, bungalows, flats, mini flats, self-contains and land.
  - Prices are in naira, and rents are shown per year.
- **Location pages** at `/buy` and `/rent`, narrowed by state and area in the path (`/rent/lagos/lekki-phase-1`), with breadcrumbs. Type, price, bedrooms, sort and page stay in the query string.
- **Area guides** at `/areas`, `/areas/[state]` and `/areas/[state]/[area]`, with each area's average rent and sale price calculated from its listings.
- **Agent pages** at `/agents` and `/agents/[agentSlug]`, listing each agent's agency and properties.
- **International hub** at `/international`, with a search page for each country at `/international/[country]` (`uk`, `uae`, `ghana`, `kenya`, `south-africa`). Each country uses its own:
  - currency: £, AED, GH₵, Ksh or R;
  - rent period: per month, or per year in the UAE;
  - floor area unit: sq ft in the UK and UAE, sqm elsewhere;
  - property types, such as maisonettes and bedsitters in Kenya or chamber and hall in Ghana;
  - terms, such as UK tenure, council tax and EPC ratings, UAE cheque payments and Ejari, and South African levies.
- **US search** at `/international/us`, with SimplyRETS filters for type, price, beds and baths.
- **Filters live in the URL**, so every search can be shared and bookmarked. Pagination keeps the active filters.
- **Property detail pages** at `/properties/[slug]`, `/international/[country]/[id]` and `/international/us/[mlsId]`:
  - photo gallery with arrow-key navigation;
  - key stats, description, property details and features;
  - Nigerian specifics: title documents (C of O, Governor's Consent, Deed of Assignment), service charges, and agency, legal and caution fees;
  - agent contact card;
  - map link.
- **Nigerian property pages** also have:
  - readable URLs such as `/properties/4-bedroom-semi-detached-duplex-lekki-phase-1-1006`; old or outdated links (like `/properties/1006`) redirect permanently to the current one;
  - breadcrumbs and a link to the agent's page;
  - WhatsApp and call buttons (with a placeholder demo number);
  - a total move-in cost estimate for rentals, or a mortgage estimate for sales.
- **Sitemap** at `/sitemap.xml`, covering every property, location, area guide and agent URL.
- **Loading, empty, error and not-found states** throughout. The US API can be slow, so its results stream in behind skeletons.

## Data sources

Every market is normalized into one `Listing` type (`lib/listing.ts`), so the cards, filters, gallery and detail view are shared.

### Nigeria and international: sample datasets

Nigeria has no shared MLS feed, and the big portals (PropertyPro, Nigeria Property Centre and others) offer no public API. The same is true almost everywhere outside the US: there is no single international listings API, only scrapers. The site therefore ships its own demo datasets, one file per country in `lib/markets/sample/data/`:

- 42 Nigerian listings across 27 neighbourhoods;
- 53 more across the other five countries;
- prices are illustrative;
- agents and companies are fictional;
- photos are from [Unsplash](https://unsplash.com).

`lib/markets/sample/listings.ts` builds titles, descriptions, fees and photos from that data for any market, and handles search, sorting and paging in memory. Every listing page is prerendered at build time, and unknown countries or IDs return a 404.

To add a country, write a new data file (see `uk.ts` for the shape) and register it in `lib/markets/sample/index.ts`.

To use real listings later, replace the functions in `listings.ts` with calls to a database or API. They only need to return the same `Listing` shape.

### United States: SimplyRETS

The SimplyRETS demo feed uses randomly generated prices and details, so the US pages say so in a notice.

`lib/markets/us/simplyrets.ts` is a server-only client for the SimplyRETS REST API:

- Responses are validated with zod. Missing or unexpected fields fall back to `null` instead of failing the page.
- Requests are cached for an hour, so only the first visit to a given search waits for the API.

By default it uses the public demo credentials (`simplyrets` / `simplyrets`). To use your own feed, copy `.env.example` to `.env.local` and fill in your credentials:

```bash
SIMPLYRETS_API_KEY=your-key
SIMPLYRETS_API_SECRET=your-secret
```

Listing photos are served unoptimized (`images.unoptimized` in `next.config.ts`). The Next.js image optimizer stops waiting for an image host after a fixed 7 seconds, and SimplyRETS's image server is often slower than that.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script              | Purpose                              |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the dev server                 |
| `npm run build`     | Production build                     |
| `npm run start`     | Serve the production build           |
| `npm run lint`      | ESLint                               |
| `npm run typecheck` | Generate route types and run `tsc`   |

## Project structure

```
app/
  page.tsx                       Home: Nigerian search, cities, newest listings
  properties/                    Nigerian search and detail pages
  [purpose]/                     /buy and /rent location pages, by state and area
  areas/[[...path]]/             Area guides (one file for all three levels)
  agents/                        Agent directory and profiles
  international/                 Hub page and per-country search and detail pages
  international/us/              Live US search, detail, loading and error pages
  sitemap.ts                     /sitemap.xml
components/                      Cards, filters, gallery, detail view, layout, calculators
lib/
  listing.ts                     Shared Listing type
  urls.ts                        Slugs and URL builders for properties, locations, areas and agents
  locations.ts                   Valid purpose, state and area combinations, breadcrumbs, area stats
  agents.ts                      Agent profiles and their listings
  site.ts                        Absolute site URL for share links and the sitemap
  search-params.ts               URL param parsing helpers shared by both markets
  format.ts                      Currency, number and date formatting
  markets/sample/                Sample markets: engine, filters, photos
  markets/sample/data/           One data file per country
  markets/us/                    SimplyRETS client and US filters
```

## Route map

"Static" pages are prerendered at build time. "Dynamic" pages render on each request, because they read search params or call the live API.

| URL pattern | File | Type of dynamic route | Static or dynamic |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | None | Static |
| `/properties?…` | `app/properties/page.tsx` | None (filters in search params) | Dynamic |
| `/properties/[slug]` | `app/properties/[slug]/page.tsx` | Dynamic segment; the slug ends in the id, and stale slugs get a 308 via `permanentRedirect` | Static for canonical slugs (`generateStaticParams`); other slugs render on demand to redirect or 404 |
| `/[purpose]` (`/buy`, `/rent`) | `app/[purpose]/layout.tsx` + `page.tsx` | Dynamic segment limited to buy/rent (`generateStaticParams` in the layout, `dynamicParams = false`) | Dynamic (reads search params) |
| `/[purpose]/[state]` | `app/[purpose]/[state]/layout.tsx` + `page.tsx` | Nested dynamic segment; params generated top-down from the parent's | Dynamic (reads search params) |
| `/[purpose]/[state]/[area]` | `app/[purpose]/[state]/[area]/page.tsx` | Third nested dynamic segment, `dynamicParams = false` | Dynamic (reads search params) |
| `/areas`, `/areas/[state]`, `/areas/[state]/[area]` | `app/areas/[[...path]]/page.tsx` | Optional catch-all | Static (all paths generated) |
| `/agents` | `app/agents/page.tsx` | None | Static |
| `/agents/[agentSlug]` | `app/agents/[agentSlug]/page.tsx` | Dynamic segment, `dynamicParams = false` | Static (all agents generated) |
| `/international` | `app/international/page.tsx` | None | Static |
| `/international/[country]` | `app/international/[country]/page.tsx` | Dynamic segment | Dynamic (reads search params) |
| `/international/[country]/[id]` | `app/international/[country]/[id]/page.tsx` | Two dynamic segments, `dynamicParams = false` | Static (all listings generated) |
| `/international/us` | `app/international/us/page.tsx` | None (static segment that wins over `[country]`) | Dynamic (live API, search params) |
| `/international/us/[mlsId]` | `app/international/us/[mlsId]/page.tsx` | Dynamic segment | Dynamic (live API) |
| `/sitemap.xml` | `app/sitemap.ts` | None (metadata route) | Static |
