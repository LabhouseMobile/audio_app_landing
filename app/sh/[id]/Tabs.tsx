"use client";

import { Summary, Transcription } from "@/app/lib/firebase/recording/@types";
import clsx from "clsx";
import { useState } from "react";
import SummaryViewer from "./SummaryViewer";
import TranscriptViewer from "./TranscriptViewer";

type Tab = "summary" | "transcript";

type Props = {
  summary: Summary;
  transcript: Transcription;
  recordingId: string;
  userId: string;
};

export default function Tabs({
  summary,
  transcript,
  recordingId,
  userId,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("summary");

  return (
    <div className="px-10">
      <div className="inline-flex space-x-2 bg-[#F2F2F7] rounded-full p-1 mb-6 mt-6">
        {["summary", "transcript"].map((tab) => (
          <div
            key={tab}
            className={clsx("rounded-full", {
              "bg-white": activeTab === tab,
            })}
          >
            <button
              onClick={() => setActiveTab(tab as Tab)}
              className={`py-1 px-4 text-md font-medium  ${
                activeTab === tab ? "text-blue-500" : "text-gray-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </div>
        ))}
      </div>

      {activeTab === "summary" && (
        <SummaryViewer
          summary={summary}
          recordingId={recordingId}
          userId={userId}
          speakers={transcript.speakers}
        />
      )}
      {activeTab === "transcript" && (
        <TranscriptViewer transcription={transcript} />
      )}
    </div>
  );
}
