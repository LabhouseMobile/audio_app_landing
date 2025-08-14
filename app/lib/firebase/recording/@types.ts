import { Timestamp } from "firebase-admin/firestore";

export interface TranscriptionSegment<T> {
  id: string;
  speaker: string;
  start: T;
  text: string;
}

type SegmentationType = "sentences" | "speakers" | "original";

export interface Transcription {
  id: string;
  isAudioLanguage: boolean;
  language: string;
  segmentationTypes: SegmentationType[];
  createdAt: string;
  updatedAt: string;
  speakers: Record<string, string>;
  speakersText: string;
  text: string;
  segments: TranscriptionSegment<number>[];
}

export interface Summary {
  markdownText: string;
  actionItems: ActionItem[];
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  actor: string;
  isDone: boolean;
}

export interface PublicLink {
  recordingId: string;
  userId: string;
  title: string;
  createdAt: Timestamp;
}

export interface PdfFile {
  duration: number;
  pdfPath: string;
}
