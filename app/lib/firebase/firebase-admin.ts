// lib/firebase-admin.ts
import * as admin from "firebase-admin";

import { resolveAdminInit } from "./admin-init";

if (!admin.apps.length) {
  const init = resolveAdminInit(process.env);

  if (init.kind === "serviceAccountKey") {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: init.projectId,
        clientEmail: init.clientEmail,
        privateKey: init.privateKey,
      }),
    });
  } else if (init.projectId) {
    admin.initializeApp({ projectId: init.projectId });
  } else {
    admin.initializeApp();
  }
}

export default admin;
