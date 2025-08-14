"use client";

import { PdfFile, Summary, Transcription } from "@/app/lib/firebase/recording/@types";
import clsx from "clsx";
import { useState } from "react";
import PdfViewer from "./PdfViewer";
import SummaryViewer from "./SummaryViewer";
import TranscriptViewer from "./TranscriptViewer";

type Tab = "summary" | "transcript" | "pdf";

type Props = {
  summary: Summary;
  transcript: Transcription;
  recordingId: string;
  userId: string;
  pdfFile?: PdfFile;
};

export default function Tabs({
  summary,
  transcript,
  recordingId,
  userId,
  pdfFile,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("summary");

  const availableTabs: Tab[] = ["summary"];
  if (pdfFile) {
    availableTabs.push("pdf");
  } else {
    availableTabs.push("transcript");
  }

  const currentTab = availableTabs.includes(activeTab) ? activeTab : availableTabs[0];

  const renderTabContent = () => {
    switch (currentTab) {
      case "summary":
        return (
          <SummaryViewer
            summary={summary}
            recordingId={recordingId}
            userId={userId}
            speakers={transcript.speakers}
          />
        );
      case "transcript":
        return <TranscriptViewer transcription={transcript} />;
      case "pdf":
        return pdfFile ? <PdfViewer pdfFile={pdfFile} /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="px-6 md:px-10">
      <div className="inline-flex space-x-2 bg-[#F2F2F7] rounded-full p-1 mb-6 mt-6">
        {availableTabs.map((tab) => (
          <div
            key={tab}
            className={clsx("rounded-full", {
              "bg-white": currentTab === tab,
            })}
          >
            <button
              onClick={() => setActiveTab(tab as Tab)}
              className={`py-1 px-4 text-md font-medium  ${
                currentTab === tab ? "text-blue-500" : "text-gray-500"
              }`}
            >
              {tab === "pdf"
                ? tab.toUpperCase()
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </div>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
}
