import HeaderBanner from "@/app/components/header-banner";
import admin from "@/app/lib/firebase/firebase-admin";
import { Summary, Transcription } from "@/app/lib/firebase/recording/@types";
import { transcriptService } from "@/app/lib/firebase/recording/transcript_service";
import { notFound } from "next/navigation";
import Tabs from "./Tabs";

function formatDateWithDuration(
  createdAt: string,
  durationSeconds: number
): string {
  const date = new Date(createdAt);
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const durationMinutes = Math.round(durationSeconds / 60);
  const durationText =
    durationMinutes === 1 ? "1 min" : `${durationMinutes} mins`;

  return `${dayOfWeek}, ${month} ${day}, ${time} (${durationText})`;
}

type Props = {
  params: { id: string };
};

type RecordingData = {
  userId: string;
  recordingId: string;
  summary: Summary;
  speakers: Record<string, string>;
  title: string;
  emoji: string;
  createdAt: string;
  audioFile: {
    duration: number;
    path: string;
  };
  transcript: Transcription;
};

export async function generateMetadata({ params }: Props) {
  const shareId = params.id;

  const data = await getRecordingData(shareId);

  if (!data) return notFound();

  const { summary, title, emoji } = data;
  return {
    title: `${emoji} ${title}`,
    description: summary.markdownText,
  };
}

export default async function ViewPage({ params }: Props) {
  const shareId = params.id;

  try {
    const data = await getRecordingData(shareId);

    if (!data) return notFound();

    const {
      summary,
      title,
      emoji,
      createdAt,
      transcript,
      userId,
      recordingId,
    } = data;

    return (
      <>
        <HeaderBanner includeCTA={true} />
        <main className="max-w-3xl mx-auto py-10 px-4">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-3xl font-bold">{emoji}</h1>
            <div className="flex flex-col justify-start items-start gap-2 w-full">
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-sm text-gray-500">
                {formatDateWithDuration(
                  createdAt,
                  data.audioFile.duration / 1000000
                )}
              </p>
            </div>
          </div>
          <Tabs
            summary={summary}
            transcript={transcript}
            recordingId={recordingId}
            userId={userId}
          />
        </main>
      </>
    );
  } catch (error) {
    console.error("Error fetching shared recording:", error);
    return notFound();
  }
}

async function getRecordingData(id: string): Promise<RecordingData | null> {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Missing Firebase environment variables");
    }
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  const db = admin.firestore();

  try {
    const publicLinkDoc = await db.collection("public_links").doc(id).get();
    const userId = publicLinkDoc.data()?.userId;
    const recordingId = publicLinkDoc.data()?.recordingId;
    if (!userId || !recordingId) return null;

    console.log("userId", userId);
    console.log("recordingId", recordingId);

    const doc = await db
      .collection("users")
      .doc(userId)
      .collection("recordings")
      .doc(recordingId)
      .get();

    if (!doc.exists) return null;

    const transcript = await transcriptService.get(userId, recordingId);

    const data = doc.data();
    return {
      ...data,
      transcript,
      userId,
      recordingId,
    } as RecordingData;
  } catch (e) {
    console.error("Failed to fetch recording:", e);
    return null;
  }
}
