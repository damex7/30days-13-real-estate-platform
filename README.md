# Hearthstone Realty: Day 13 Real Estate Platform

A server-rendered real estate listings site built with Next.js 16.4 (App Router), TypeScript and Tailwind CSS v4. Listing data comes live from the [SimplyRETS](https://simplyrets.com) API.

## Features

- **Home page** with a hero search, quick links by property type, and the newest active listings.
- **Listings search** at `/properties`. Filters for keyword, property type, price range, minimum beds and baths, and sort order are kept in the URL, so every search can be shared and bookmarked. Pagination keeps the active filters.
- **Property detail pages** at `/properties/[mlsId]`:
  - photo gallery with arrow-key navigation;
  - key stats, description, property details, features and schools;
  - agent contact card;
  - map link.
- **Loading, empty, error and not-found states** throughout. The demo API can be slow, so results stream in behind skeletons.

## Data source

`lib/simplyrets.ts` is a server-only client for the SimplyRETS REST API:

- Responses are validated with zod and normalized into a flat `Listing` type. Unexpected or missing fields fall back to `null` instead of failing the page.
- Requests are cached for an hour (`next: { revalidate: 3600, tags: ["listings"] }`). Only the first visit to a given search has to wait for the API.
- Search params are parsed and clamped in `lib/filters.ts`. Invalid values are ignored rather than causing errors.

By default the app uses the public demo credentials (`simplyrets` / `simplyrets`). These return sample listings around Houston, TX. To use your own feed, copy `.env.example` to `.env.local` and fill in your credentials:

```bash
SIMPLYRETS_API_KEY=your-key
SIMPLYRETS_API_SECRET=your-secret
```

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
  page.tsx                     Home: hero search, types, newest listings
  properties/page.tsx          Search results with filters and pagination
  properties/error.tsx         Retryable error boundary for API failures
  properties/[mlsId]/          Listing detail, loading and not-found
components/                    Cards, grid, filters, gallery, header and footer
lib/
  simplyrets.ts                API client and Listing normalization
  filters.ts                   URL search param schema and filter options
  format.ts                    Price, number, date and label helpers
```
