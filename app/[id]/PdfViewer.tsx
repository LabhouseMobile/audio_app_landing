"use client";

import { PdfFile } from "@/app/lib/firebase/recording/@types";
import { useEffect, useRef, useState } from "react";

type Props = {
  pdfFile: PdfFile;
};

export default function PdfViewer({ pdfFile }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Generate Google PDF viewer URL as fallback
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfFile.pdfPath)}&embedded=true`;

  const clearLoadingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleLoad = () => {
    console.log("[PdfViewer] PDF loaded");
    clearLoadingTimeout();
    setIsLoading(false);
  };

  const handleError = () => {
    console.error("[PdfViewer] Failed to load PDF:", pdfFile.pdfPath);
    clearLoadingTimeout();
    setIsLoading(false);
    setHasError(true);
  };

  // Effect to reset when PDF path changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setUseGoogleViewer(false);
  }, [pdfFile.pdfPath]);

  // Effect to handle timeout and fallback
  useEffect(() => {
    if (hasError) return;

    timeoutRef.current = setTimeout(() => {
      if (!useGoogleViewer && iframeRef.current) {
        try {
          const iframe = iframeRef.current;
          if (iframe.contentDocument) {
            const body = iframe.contentDocument.body;
            const errorText = body?.textContent?.toLowerCase() || "";
            const bodyHTML = body?.innerHTML?.toLowerCase() || "";
            
          
            if (errorText.includes("error") || errorText.includes("forbidden") || errorText.includes("access denied")) {
              console.error("[PdfViewer] Error detected in iframe:", body?.textContent);
              setHasError(true);
              return;
            }
            
            // If the PDF didn't load, try the Google viewer as fallback
            if (!bodyHTML.includes("pdf") && !body?.querySelector("embed") && !body?.querySelector("object")) {
              console.log("[PdfViewer] Trying Google viewer as fallback");
              setUseGoogleViewer(true);
              setIsLoading(true);
              return;
            }
          }
        } catch {
          // If CORS is blocked or other error occurs, try the Google viewer as fallback
          setUseGoogleViewer(true);
          setIsLoading(true);
          return;
        }
      }

      setIsLoading(false);
      timeoutRef.current = null;
    }, 8000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pdfFile.pdfPath, useGoogleViewer, hasError]);

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
        ref={iframeRef}
        src={useGoogleViewer ? googleViewerUrl : pdfFile.pdfPath}
        className="w-full h-full border-0"
        title="PDF Document"
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
}
