// Which URLs /api/pdf-proxy is allowed to fetch.
//
// Shared PDFs are Firebase Storage download URLs, as produced by
// getDownloadURL():
//   https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<url-encoded path>?alt=media&token=…
// Only our own default buckets (prod and dev) are accepted. Every other bucket
// on firebasestorage.googleapis.com belongs to someone else, and an attacker
// can serve any bytes and headers from their own bucket.
//
// This file has no imports so `node --experimental-strip-types --test` can
// load it directly (see source-url.test.mjs).

export const ALLOWED_PDF_BUCKETS: ReadonlySet<string> = new Set([
  "audiolabhouse.appspot.com",
  "audiodevlabhouse.firebasestorage.app",
]);

const STORAGE_HOST = "firebasestorage.googleapis.com";

// The object path is URL-encoded by getDownloadURL, so it never contains a
// literal "/".
const DOWNLOAD_PATH = /^\/v0\/b\/([^/]+)\/o\/[^/]+$/;

/**
 * Returns the parsed URL when `raw` is a download URL for an object in one of
 * ALLOWED_PDF_BUCKETS, otherwise null.
 */
export function parsePdfSourceUrl(raw: string | null): URL | null {
  if (!raw) return null;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;
  if (url.hostname !== STORAGE_HOST) return null;
  if (url.port !== "") return null;
  if (url.username !== "" || url.password !== "") return null;

  // url.pathname is already normalized, so "../" segments can't hop buckets.
  const match = DOWNLOAD_PATH.exec(url.pathname);
  if (!match || !ALLOWED_PDF_BUCKETS.has(match[1])) return null;

  return url;
}
