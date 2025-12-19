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

// Group consecutive segments by speaker
const groupConsecutiveSegmentsBySpeaker = (
  segments: TranscriptionSegment<number>[]
): Array<{ speakerId: string; segments: TranscriptionSegment<number>[] }> => {
  const groups: Array<{
    speakerId: string;
    segments: TranscriptionSegment<number>[];
  }> = [];

  if (segments.length === 0) return groups;

  let currentGroup = {
    speakerId: segments[0].speaker,
    segments: [segments[0]],
  };

  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];

    if (segment.speaker === currentGroup.speakerId) {
      // Same speaker, add to current group
      currentGroup.segments.push(segment);
    } else {
      // Different speaker, save current group and start new one
      groups.push(currentGroup);
      currentGroup = {
        speakerId: segment.speaker,
        segments: [segment],
      };
    }
  }

  // Add the last group
  groups.push(currentGroup);

  return groups;
};

export default function TranscriptViewer({
  transcription,
}: TranscriptViewerProps) {
  const groupedSegments = groupConsecutiveSegmentsBySpeaker(
    transcription.segments
  );

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-6">
      <div className="space-y-4">
        {groupedSegments.map((group, index) => {
          const speakerName =
            transcription.speakers[group.speakerId] || group.speakerId;
          const speakerColor = getSpeakerColor(
            group.speakerId,
            transcription.speakers
          );
          const startTime = formatTime(group.segments[0].start);
          const combinedText = group.segments
            .map((segment) => segment.text)
            .join(" ");

          return (
            <div key={`${group.speakerId}-${index}`} className="py-2">
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
