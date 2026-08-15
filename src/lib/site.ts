/** Canonical production origin. www is the canonical host; the apex redirects
    to it in next.config.ts, so every absolute URL we emit (metadata, JSON-LD,
    sitemap, payment return_url) has to point at www to avoid an extra hop. */
export const SITE_URL = "https://www.runy-online.ru";

/**
 * Hosts we are willing to build a YooKassa return_url from.
 *
 * The checkout route derives the origin from `x-forwarded-host`, which is
 * attacker-controlled on any request that reaches the function directly. An
 * unchecked value would let someone mint a real payment whose confirmation
 * page bounces the buyer to a host they picked. Anything not listed here falls
 * back to SITE_URL.
 */
const ALLOWED_RETURN_HOSTS = new Set([
  "runy-online.ru",
  "www.runy-online.ru",
  "runic-reading.vercel.app",
]);

/**
 * Resolves the origin used for the payment return_url.
 *
 * NEXT_PUBLIC_SITE_URL wins when set — it is operator-controlled and lets a
 * deploy pin its own origin. Otherwise the forwarded host is accepted only if
 * it is allowlisted, and SITE_URL covers everything else (preview URLs,
 * spoofed headers, direct-to-function calls).
 */
export function resolveReturnOrigin(request: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");

  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost && ALLOWED_RETURN_HOSTS.has(forwardedHost.toLowerCase())) {
    const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
    return `${forwardedProto}://${forwardedHost}`;
  }

  return SITE_URL;
}
