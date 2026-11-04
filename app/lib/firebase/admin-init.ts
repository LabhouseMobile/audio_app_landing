// How firebase-admin should authenticate, decided from the environment.
//
// - Key set (FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY):
//   use that service account key.
// - Otherwise: use the Cloud Run runtime service account (Application Default
//   Credentials). FIREBASE_PROJECT_ID, when set, picks the Firebase project.
//   Without it, firebase-admin uses the GCP project the service runs in. The
//   dev landing runs in the prod GCP project, so it must set
//   FIREBASE_PROJECT_ID or it would read prod Firestore.

export type AdminInit =
  | {
      kind: "serviceAccountKey";
      projectId: string;
      clientEmail: string;
      privateKey: string;
    }
  | { kind: "runtimeServiceAccount"; projectId?: string };

export function resolveAdminInit(
  env: Record<string, string | undefined>,
): AdminInit {
  const projectId = env.FIREBASE_PROJECT_ID || undefined;
  const clientEmail = env.FIREBASE_CLIENT_EMAIL;
  const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    return { kind: "serviceAccountKey", projectId, clientEmail, privateKey };
  }
  return projectId
    ? { kind: "runtimeServiceAccount", projectId }
    : { kind: "runtimeServiceAccount" };
}
