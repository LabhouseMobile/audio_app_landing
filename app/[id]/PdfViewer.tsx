"use client";

import { PdfFile } from "@/app/lib/firebase/recording/@types";
import { useState } from "react";

type Props = {
  pdfFile: PdfFile;
};

export default function PdfViewer({ pdfFile }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className="w-full h-[600px] border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Failed to load PDF</p>
          <a
            href={pdfFile.pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            Open PDF in new tab
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] border border-gray-200 rounded-lg overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-gray-500">Loading PDF...</div>
        </div>
      )}
      <iframe
        src={pdfFile.pdfPath}
        className="w-full h-full border-0"
        title="PDF Document"
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
}
