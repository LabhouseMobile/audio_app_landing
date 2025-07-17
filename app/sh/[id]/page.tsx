import HeaderBanner from "@/app/components/header-banner";
import admin from "@/app/lib/firebase/firebase-admin";
import {
  PublicLink,
  Summary,
  Transcription,
} from "@/app/lib/firebase/recording/@types";
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

type AudioFile = {
  duration: number;
  path: string;
};

type YoutubeFile = AudioFile & {
  videoUrl: string;
};

type RecordingData = {
  userId: string;
  recordingId: string;
  summary: Summary;
  speakers: Record<string, string>;
  title: string;
  emoji: string;
  createdAt: string;
  audioFile?: AudioFile;
  youtubeFile?: YoutubeFile;
  transcript: Transcription;
};

export async function generateMetadata({ params }: Props) {
  const startTime = Date.now();
  console.log(`[PERF] generateMetadata started for shareId: ${params.id}`);

  const shareId = params.id;
  const publicLink = await admin
    .firestore()
    .collection("public_links")
    .doc(shareId)
    .get();

  const { title, createdAt } = publicLink.data() as PublicLink;

  const metadata = {
    title: title,
    keywords: [
      title,
      "audio recording",
      "transcript",
      "meeting notes",
      "voice memo",
      "speech to text",
      "summary ai",
      "summary ai note taker",
      "summary ai note taker app",
    ],
    creator: "Summary AI",
    publisher: "Summary AI",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://summaryai.app"),
    alternates: {
      canonical: `/sh/${shareId}`,
    },
    openGraph: {
      title: title,
      type: "article",
      publishedTime: createdAt.toDate().toLocaleDateString(),
      images: [
        {
          url: "/logo-512.png", // Your app's logo or a default image
          width: 1200,
          height: 630,
          alt: "Summary AI",
        },
      ],
      siteName: "Summary AI Note Taker",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      images: ["/logo.png"], // Your app's logo or a default image
      creator: "@Summary AI", // Replace with your Twitter handle
      site: "@Summary AI Note Taker", // Replace with your Twitter handle
    },
  };

  const endTime = Date.now();
  console.log(`[PERF] generateMetadata completed in ${endTime - startTime}ms`);

  return metadata;
}

export default async function ViewPage({ params }: Props) {
  const startTime = Date.now();
  console.log(`[PERF] ViewPage started for shareId: ${params.id}`);

  const shareId = params.id;

  try {
    const data = await getRecordingData(shareId);

    if (!data) {
      console.log(`[PERF] ViewPage - no data found, returning notFound`);
      return notFound();
    }

    const {
      summary,
      title,
      emoji,
      createdAt,
      transcript,
      userId,
      recordingId,
    } = data;

    const endTime = Date.now();
    console.log(`[PERF] ViewPage completed in ${endTime - startTime}ms`);

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
                  (data.audioFile?.duration ||
                    data.youtubeFile?.duration ||
                    0) / 1000000
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
  const startTime = Date.now();
  console.log(`[PERF] getRecordingData started for id: ${id}`);

  if (!admin.apps.length) {
    const initStartTime = Date.now();
    console.log(`[PERF] Initializing Firebase admin app`);

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

    const initEndTime = Date.now();
    console.log(
      `[PERF] Firebase admin app initialized in ${
        initEndTime - initStartTime
      }ms`
    );
  }

  const db = admin.firestore();

  try {
    const publicLinkStartTime = Date.now();
    console.log(`[PERF] Fetching public_links document`);

    const publicLinkDoc = await db.collection("public_links").doc(id).get();
    const userId = publicLinkDoc.data()?.userId;
    const recordingId = publicLinkDoc.data()?.recordingId;

    const publicLinkEndTime = Date.now();
    console.log(
      `[PERF] public_links document fetched in ${
        publicLinkEndTime - publicLinkStartTime
      }ms`
    );

    if (!userId || !recordingId) {
      console.log(`[PERF] Missing userId or recordingId from public_links`);
      return null;
    }

    const recordingStartTime = Date.now();
    console.log(
      `[PERF] Fetching recording document for userId: ${userId}, recordingId: ${recordingId}`
    );

    const doc = await db
      .collection("users")
      .doc(userId)
      .collection("recordings")
      .doc(recordingId)
      .get();

    const recordingEndTime = Date.now();
    console.log(
      `[PERF] Recording document fetched in ${
        recordingEndTime - recordingStartTime
      }ms`
    );

    if (!doc.exists) {
      console.log(`[PERF] Recording document does not exist`);
      return null;
    }

    const transcriptStartTime = Date.now();
    console.log(`[PERF] Fetching transcript`);

    const transcript = await transcriptService.get(userId, recordingId);

    const transcriptEndTime = Date.now();
    console.log(
      `[PERF] Transcript fetched in ${
        transcriptEndTime - transcriptStartTime
      }ms`
    );

    const data = doc.data();

    const totalTime = Date.now() - startTime;
    console.log(`[PERF] getRecordingData completed in ${totalTime}ms`);

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
