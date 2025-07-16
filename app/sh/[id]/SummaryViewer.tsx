"use client";

import MarkdownDisplay from "@/app/components/markdown-display";
import { Summary } from "@/app/lib/firebase/recording/@types";
import ActionItemView from "./ActionItem";

interface SummaryViewerProps {
  summary: Summary;
  recordingId: string;
  userId: string;
  speakers: Record<string, string>;
}

export default function SummaryViewer({
  summary,
  recordingId,
  userId,
  speakers,
}: SummaryViewerProps) {
  const { actionItems } = summary;
  return (
    <>
      <div className="space-y-6 mt-6">
        {actionItems.map((item) => (
          <ActionItemView
            key={item.id}
            item={item}
            recordingId={recordingId}
            userId={userId}
            speakers={speakers}
          />
        ))}
      </div>
      <MarkdownDisplay content={summary.markdownText} containerClassName="" />
    </>
  );
}
