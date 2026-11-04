// Run with `npm test` (node --experimental-strip-types --test).
import assert from "node:assert/strict";
import { test } from "node:test";

import { resolveAdminInit } from "./admin-init.ts";

const KEY = "-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n";

test("uses the service account key when all three variables are set", () => {
  assert.deepEqual(
    resolveAdminInit({
      FIREBASE_PROJECT_ID: "audiodevlabhouse",
      FIREBASE_CLIENT_EMAIL: "sa@audiodevlabhouse.iam.gserviceaccount.com",
      FIREBASE_PRIVATE_KEY: KEY,
    }),
    {
      kind: "serviceAccountKey",
      projectId: "audiodevlabhouse",
      clientEmail: "sa@audiodevlabhouse.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\n",
    },
  );
});

test("without a key, keeps FIREBASE_PROJECT_ID so dev doesn't fall back to the run project", () => {
  assert.deepEqual(resolveAdminInit({ FIREBASE_PROJECT_ID: "audiodevlabhouse" }), {
    kind: "runtimeServiceAccount",
    projectId: "audiodevlabhouse",
  });
});

test("a partial key falls back to the runtime service account with the project id", () => {
  assert.deepEqual(
    resolveAdminInit({
      FIREBASE_PROJECT_ID: "audiodevlabhouse",
      FIREBASE_CLIENT_EMAIL: "sa@audiodevlabhouse.iam.gserviceaccount.com",
    }),
    { kind: "runtimeServiceAccount", projectId: "audiodevlabhouse" },
  );
});

test("with nothing set (prod), uses the runtime service account and its own project", () => {
  assert.deepEqual(resolveAdminInit({}), { kind: "runtimeServiceAccount" });
  assert.deepEqual(resolveAdminInit({ FIREBASE_PROJECT_ID: "" }), {
    kind: "runtimeServiceAccount",
  });
});
