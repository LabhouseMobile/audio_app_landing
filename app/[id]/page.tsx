import HeaderBanner from "@/app/components/header-banner";
import { MixpanelAnalyticsProvider } from "@/app/lib/analytics/mixpanel_service";
import admin from "@/app/lib/firebase/firebase-admin";
import {
  PdfFile,
  PublicLink,
  Summary,
  SummaryCustomization,
  Transcription,
} from "@/app/lib/firebase/recording/@types";
import { transcriptService } from "@/app/lib/firebase/recording/transcript_service";
import { headers } from "next/headers";
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

  const isEmptyDuration = durationSeconds === 0;

  const durationMinutes = Math.round(durationSeconds / 60);
  const durationText =
    durationMinutes === 1 ? "1 min" : `${durationMinutes} mins`;

  return `${dayOfWeek}, ${month} ${day}, ${time} ${
    isEmptyDuration ? "" : `(${durationText})`
  }`;
}

async function getButtonText() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  console.log("[DEVICE] User-Agent:", userAgent);

  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);

  if (isAndroid) {
    return "Download for Android";
  } else if (isIOS) {
    return "Download for iPhone";
  } else {
    return "Download App";
  }
}

type Props = {
  params: Promise<{ id: string }>;
};

type AudioFile = {
  duration: number;
  path: string;
};

type YoutubeFile = AudioFile & {
  videoUrl: string;
};

/** A single speaker identified against a user's voice profile. */
export interface IdentifiedSpeaker {
  speakerId: string | null;
  identifiedAt?: string;
  matchScore?: number | null;
}

/** Speakers identified by the voice-matching pipeline, stored on the recording. */
export interface IdentifiedSpeakers {
  self?: IdentifiedSpeaker;
}

type RecordingData = {
  userId: string;
  recordingId: string;
  summary: Summary;
  summaryCustomization?: SummaryCustomization;
  speakers: Record<string, string>;
  identifiedSpeakers?: IdentifiedSpeakers;
  title: string;
  emoji: string;
  createdAt: string;
  audioFile?: AudioFile;
  youtubeFile?: YoutubeFile;
  pdfFile?: PdfFile;
  transcript?: Transcription;
};

type UserVoiceData = {
  speakerId: string;
  userName: string;
};

type UserData = {
  voiceSample?: UserVoiceData;
};

export async function generateMetadata({ params }: Props) {
  const startTime = Date.now();
  const { id } = await params;
  console.log(`[PERF] generateMetadata started for shareId: ${id}`);

  const shareId = id;
  const publicLink = await admin
    .firestore()
    .collection("public_links")
    .doc(shareId)
    .get();
  const data = publicLink.data() as PublicLink | undefined;
  if (!data) {
    return notFound();
  }
  const { title, createdAt } = publicLink.data() as PublicLink;

  const metadata = {
    title: title,
    // Prevent search engines from indexing user-generated content
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    creator: "Summary AI",
    publisher: "Summary AI",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://summaryai.app"),
    openGraph: {
      title: title,
      type: "article",
      publishedTime: createdAt.toDate().toLocaleDateString(),
      images: [
        {
          url: "/logo-512.png",
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
      images: ["/logo.png"],
      creator: "@Summary AI",
      site: "@Summary AI Note Taker",
    },
  };

  const endTime = Date.now();
  console.log(`[PERF] generateMetadata completed in ${endTime - startTime}ms`);

  return metadata;
}

export default async function ViewPage({ params }: Props) {
  const startTime = Date.now();
  const { id } = await params;
  console.log(`[PERF] ViewPage started for shareId: ${id}`);

  const shareId = id;

  try {
    const data = await getRecordingData(shareId);

    if (!data) {
      console.log(`[PERF] ViewPage - no data found, returning notFound`);
      if (process.env.MIXPANEL_API_KEY) {
        const mixpanelAnalyticsProvider = new MixpanelAnalyticsProvider(
          process.env.MIXPANEL_API_KEY,
          false,
          "summaryPage"
        );
        mixpanelAnalyticsProvider.summaryPage({
          shortId: shareId,
          status: "failed_404",
        });
      }
      return notFound();
    }

    if (process.env.MIXPANEL_API_KEY) {
      const mixpanelAnalyticsProvider = new MixpanelAnalyticsProvider(
        process.env.MIXPANEL_API_KEY,
        false,
        "summaryPage",
        data.userId
      );
      mixpanelAnalyticsProvider.summaryPage({
        recordingId: data.recordingId,
        userId: data.userId,
        title: data.title,
        shortId: shareId,
        status: "success",
      });
    }

    const { summary, speakers, identifiedSpeakers, summaryCustomization, title, emoji, createdAt, transcript, pdfFile } = data;

    const buttonText = await getButtonText();

    const endTime = Date.now();
    console.log(`[PERF] ViewPage completed in ${endTime - startTime}ms`);

    const userVoiceData = await getUserVoiceData(data.userId);
    const finalSpeakers = getSpeakers(speakers, transcript?.speakers ?? {}, identifiedSpeakers?.self?.speakerId ?? null, userVoiceData?.userName ?? null);

    return (
      <>
        <HeaderBanner
          includeCTA={true}
          buttonText={buttonText}
          buttonUrl="https://link.summaryai.app/iatfqj"
        />
        <main className="max-w-3xl mx-auto py-10 px-4 overflow-x-hidden">
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
            speakers={finalSpeakers}
            summaryCustomization={summaryCustomization}
            transcript={transcript}
            shareId={shareId}
            pdfFile={pdfFile}
          />
        </main>
      </>
    );
  } catch (error) {
    console.error("Error fetching shared recording:", error);
    return notFound();
  }
}

function getSpeakers(speakers: Record<string, string>, transcriptSpeakers: Record<string, string>, selfSpeakerId: string | null, selfSpeakerName: string | null): Record<string, string> {
  const finalSpeakers = speakers ?? transcriptSpeakers;
  if (selfSpeakerId && selfSpeakerName) {
    finalSpeakers[selfSpeakerId] = selfSpeakerName;
  }
  return finalSpeakers;
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
      admin.initializeApp();
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }

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

async function getUserVoiceData(userId: string): Promise<UserVoiceData | null> {
  const db = admin.firestore();
  const userDoc = await db.collection("users").doc(userId).get();
  const userData = userDoc.data() as UserData;
  return userData?.voiceSample ?? null;
}