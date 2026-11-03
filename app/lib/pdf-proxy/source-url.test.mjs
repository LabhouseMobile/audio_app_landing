// Run with `npm test` (node --experimental-strip-types --test).
import assert from "node:assert/strict";
import { test } from "node:test";

import { parsePdfSourceUrl } from "./source-url.ts";

const PROD =
  "https://firebasestorage.googleapis.com/v0/b/audiolabhouse.appspot.com/o/users%2Fu1%2Fpdfs%2Fdoc.pdf?alt=media&token=abc";
const DEV =
  "https://firebasestorage.googleapis.com/v0/b/audiodevlabhouse.firebasestorage.app/o/users%2Fu1%2Fpdfs%2Fdoc.pdf?alt=media&token=abc";

test("accepts download URLs in our prod and dev buckets", () => {
  assert.equal(parsePdfSourceUrl(PROD)?.href, PROD);
  assert.equal(parsePdfSourceUrl(DEV)?.href, DEV);
});

test("rejects missing or unparsable input", () => {
  assert.equal(parsePdfSourceUrl(null), null);
  assert.equal(parsePdfSourceUrl(""), null);
  assert.equal(parsePdfSourceUrl("not a url"), null);
});

test("rejects other buckets on the Firebase Storage host", () => {
  assert.equal(
    parsePdfSourceUrl(
      "https://firebasestorage.googleapis.com/v0/b/attacker.appspot.com/o/x.pdf?alt=media"
    ),
    null
  );
  // Prefix and suffix look-alikes of an allowed bucket name.
  assert.equal(
    parsePdfSourceUrl(
      "https://firebasestorage.googleapis.com/v0/b/audiolabhouse.appspot.com.evil/o/x.pdf"
    ),
    null
  );
  assert.equal(
    parsePdfSourceUrl(
      "https://firebasestorage.googleapis.com/v0/b/xaudiolabhouse.appspot.com/o/x.pdf"
    ),
    null
  );
});

test("rejects path tricks that hop out of an allowed bucket", () => {
  for (const raw of [
    "https://firebasestorage.googleapis.com/v0/b/audiolabhouse.appspot.com/o/../../b/attacker.appspot.com/o/x.pdf",
    "https://firebasestorage.googleapis.com/v0/b/audiolabhouse.appspot.com/o/%2e%2e/%2e%2e/b/attacker.appspot.com/o/x.pdf",
    "https://firebasestorage.googleapis.com/v0/b/audiolabhouse.appspot.com/o/",
    "https://firebasestorage.googleapis.com/v0/b/audiolabhouse.appspot.com/o/users/u1/x.pdf",
    "https://firebasestorage.googleapis.com/v0/b/audiolabhouse.appspot.com",
  ]) {
    assert.equal(parsePdfSourceUrl(raw), null, raw);
  }
});

test("rejects other schemes, hosts, ports and userinfo", () => {
  for (const raw of [
    PROD.replace("https:", "http:"),
    PROD.replace("firebasestorage.googleapis.com", "storage.googleapis.com"),
    PROD.replace("firebasestorage.googleapis.com", "firebasestorage.googleapis.com.evil.com"),
    PROD.replace("firebasestorage.googleapis.com", "firebasestorage.googleapis.com."),
    PROD.replace("firebasestorage.googleapis.com", "firebasestorage.googleapis.com:8443"),
    PROD.replace("https://", "https://user:pass@"),
    "https://firebasestorage.googleapis.com@evil.com/v0/b/audiolabhouse.appspot.com/o/x.pdf",
  ]) {
    assert.equal(parsePdfSourceUrl(raw), null, raw);
  }
});
