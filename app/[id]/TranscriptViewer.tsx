"use client";

import {
  Transcription,
  TranscriptionSegment,
} from "@/app/lib/firebase/recording/@types";

interface TranscriptViewerProps {
  transcription: Transcription;
}

// Generate a consistent color for each speaker
export const getSpeakerColor = (
  speakerId: string,
  speakers: Record<string, string>
): string => {
  const speakerKeys = Object.keys(speakers);
  const speakerIndex = speakerKeys.indexOf(speakerId);

  // Predefined colors for speakers
  const colors = [
    "text-indigo-400",
    "text-emerald-400",
    "text-pink-400",
    "text-orange-400",
    "text-red-400",
    "text-teal-400",
    "text-purple-400",
    "text-blue-400",
  ];

  return colors[speakerIndex % colors.length] || "text-gray-600";
};

// Format time in seconds to MM:SS format
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

// Detect if a text segment ends with sentence-ending punctuation
const isSentenceEnd = (text: string): boolean => {
  const trimmedText = text.trim();
  if (!trimmedText) return false;

  const lowerTrimmed = trimmedText.toLowerCase();
  // Matches one or more sentence-like punctuation marks at the end, optionally
  // followed by closing quotes or brackets, e.g.: "word.", "word...", "word?!", etc
  const looksLikeSentencePunctuation = /[.?!…]+["')\]]*$/.test(trimmedText);

  if (!looksLikeSentencePunctuation) {
    return false;
  }

  // Check for common abbreviations that shouldn't be treated as sentence endings
  const commonAbbreviations = [
    "mr.",
    "mrs.",
    "ms.",
    "dr.",
    "prof.",
    "sr.",
    "jr.",
    "st.",
    "vs.",
    "etc.",
    "e.g.",
    "i.e.",
  ];

  const isAbbreviation = commonAbbreviations.some((abbr) =>
    lowerTrimmed.endsWith(abbr)
  );

  return !isAbbreviation;
};

// Group segments by sentences
const getSegmentsBySentences = (
  segments: TranscriptionSegment<number>[],
  numOfSentences: number = 1,
  options: {
    removeSpeakers?: boolean;
    maxSegmentsPerGroup?: number;
    maxWordsPerSegment?: number;
  } = {}
): TranscriptionSegment<number>[][] => {
  const {
    removeSpeakers = false,
    maxSegmentsPerGroup = 60,
    maxWordsPerSegment = 50,
  } = options;

  const result: TranscriptionSegment<number>[][] = [];
  let currentNumOfSentences = numOfSentences;
  let currentSegment: TranscriptionSegment<number>[] = [];

  // Filter out empty segments and trim text
  const nonEmptySegments = segments
    .map((segment) => ({
      ...segment,
      text: segment.text.trim(),
    }))
    .filter((segment) => segment.text.length > 0);

  for (const seg of nonEmptySegments) {
    const processedSeg: TranscriptionSegment<number> = removeSpeakers
      ? { ...seg, speaker: "" }
      : seg;

    // Check for long segments and split if needed
    const words = processedSeg.text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    if (wordCount > maxWordsPerSegment) {
      // Split segment into smaller chunks by words
      const splitSegments: TranscriptionSegment<number>[] = words.map(
        (word) => ({
          ...processedSeg,
          text: word,
        })
      );

      // Recurse with the split segments
      const recursiveResult = getSegmentsBySentences(
        splitSegments,
        1,
        options
      );

      // Add recursive results to final result
      result.push(...recursiveResult);
      continue;
    }

    // Start a new group if current is empty
    if (currentSegment.length === 0) {
      currentSegment.push(processedSeg);
      continue;
    }

    currentSegment.push(processedSeg);

    // Check for sentence-ending punctuation
    if (isSentenceEnd(processedSeg.text)) {
      currentNumOfSentences--;
    }

    // Finalize group when sentence or fallback limit is met
    if (
      currentNumOfSentences <= 0 ||
      currentSegment.length >= maxSegmentsPerGroup
    ) {
      result.push(currentSegment);
      currentSegment = [];
      currentNumOfSentences = numOfSentences;
    }
  }

  // Add any remaining segments
  if (currentSegment.length > 0) {
    result.push(currentSegment);
  }

  return result;
};

// Group segments by speakers first, then apply sentence segmentation
const getSegmentsBySpeakersAndSentences = (
  segments: TranscriptionSegment<number>[]
): TranscriptionSegment<number>[][] => {
  const result: TranscriptionSegment<number>[][] = [];
  let currentSpeaker: TranscriptionSegment<number>[] = [];
  // Filter out empty segments and trim text
  const nonEmptySegments = segments
    .map((segment) => ({
      ...segment,
      text: segment.text.trim(),
    }))
    .filter((segment) => segment.text.length > 0);

  for (const seg of nonEmptySegments) {
    if (currentSpeaker.length === 0) {
      currentSpeaker.push(seg);
      continue;
    } else if (currentSpeaker[0].speaker === seg.speaker) {
      currentSpeaker.push(seg);
      continue;
    }

    // Different speaker: apply sentence segmentation to current speaker group
    result.push(...getSegmentsBySentences(currentSpeaker, 2));
    currentSpeaker = [seg];
  }

  // Apply sentence segmentation to remaining speaker segments
  if (currentSpeaker.length > 0) {
    result.push(...getSegmentsBySentences(currentSpeaker, 2));
  }

  return result;
};

export default function TranscriptViewer({
  transcription,
}: TranscriptViewerProps) {
  const groupedSegments = getSegmentsBySpeakersAndSentences(
    transcription.segments
  );

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-6">
      <div className="space-y-4">
        {groupedSegments.map((group, index) => {
          const firstSegment = group[0];
          const speakerId = firstSegment.speaker;
          const speakerName =
            speakerId && transcription.speakers[speakerId]
              ? transcription.speakers[speakerId]
              : speakerId || "";
          const speakerColor = speakerId
            ? getSpeakerColor(speakerId, transcription.speakers)
            : "text-gray-600";

          const startTime = formatTime(firstSegment.start);
          const combinedText = group
            .map((segment) => segment.text)
            .join(" ");

          return (
            <div key={`group-${index}`} className="py-2">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {startTime}
                </span>
                <span className={`font-semibold ${speakerColor}`}>
                  {speakerName}
                </span>
              </div>
              <div className="text-gray-800 leading-relaxed">
                {combinedText}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
