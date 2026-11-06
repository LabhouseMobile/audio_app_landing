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

export const ALLOWED_PDF_BUCKETS: readonly string[] = [
  "audiolabhouse.appspot.com",
  "audiodevlabhouse.firebasestorage.app",
];

const STORAGE_HOST = "firebasestorage.googleapis.com";

// The object path is URL-encoded by getDownloadURL, so it never contains a
// literal "/".
const DOWNLOAD_PATH = /^\/v0\/b\/([^/]+)\/o\/([^/]+)$/;

/**
 * Returns the URL to fetch when `raw` is a download URL for an object in one
 * of ALLOWED_PDF_BUCKETS, otherwise null.
 *
 * The returned URL is rebuilt rather than passed through: its origin and
 * `alt=media` are literals, its bucket comes from ALLOWED_PDF_BUCKETS, and the
 * only parts taken from `raw` (object name and `token`) are re-encoded with
 * encodeURIComponent. CodeQL's request-forgery query recognizes exactly that
 * shape as safe; it can't follow the checks above.
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
  if (!match) return null;
  const bucket = ALLOWED_PDF_BUCKETS.find((b) => b === match[1]);
  if (!bucket) return null;

  let objectName: string;
  try {
    objectName = decodeURIComponent(match[2]);
  } catch {
    return null;
  }

  const token = url.searchParams.get("token");
  const query =
    token === null
      ? "alt=media"
      : `alt=media&token=${encodeURIComponent(token)}`;

  return new URL(
    `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(objectName)}?${query}`
  );
}
