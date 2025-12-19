"use client";

import MarkdownDisplay from "@/app/components/markdown-display";
import { Summary } from "@/app/lib/firebase/recording/@types";
import ActionItemView from "./ActionItem";

interface SummaryViewerProps {
  summary: Summary;
  shareId: string;
  speakers: Record<string, string>;
}

export default function SummaryViewer({
  summary,
  shareId,
  speakers,
}: SummaryViewerProps) {
  const actionItems = summary.actionItems ?? [];
  return (
    <>
      <div className="space-y-6 mt-6">
        {actionItems.map((item) => (
          <ActionItemView
            key={item.id}
            item={item}
            shareId={shareId}
            speakers={speakers}
          />
        ))}
      </div>
      <MarkdownDisplay content={summary.markdownText} containerClassName="" />
    </>
  );
}
