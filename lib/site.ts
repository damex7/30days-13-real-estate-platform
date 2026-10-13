/**
 * Absolute site origin, for share links and the sitemap. Set
 * NEXT_PUBLIC_SITE_URL to override; on Vercel the production domain is
 * provided automatically.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
