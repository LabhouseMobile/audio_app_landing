'use client';

import { PdfFile } from '@/app/lib/firebase/recording/@types';
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';

const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  { ssr: false }
);

const Page = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false }
);

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
  wasmUrl: '/wasm/',
};

const resizeObserverOptions = {};

const maxWidth = 800;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3.0;
const SCALE_STEP = 0.25;

type Props = {
  pdfFile: PdfFile;
};

export default function PdfViewerNew({ pdfFile }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [workerReady, setWorkerReady] = useState<boolean>(false);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  const proxyUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return `/api/pdf-proxy?url=${encodeURIComponent(pdfFile.pdfPath)}`;
    }
    const url = `${window.location.origin}/api/pdf-proxy?url=${encodeURIComponent(pdfFile.pdfPath)}`;
    console.log('PDF proxy URL:', url);
    return url;
  }, [pdfFile.pdfPath]);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onDocumentLoadStart(): void {
    console.log('PDF loading started');
    setIsLoading(true);
    setError(null);
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    console.log('PDF loaded successfully', { numPages, proxyUrl });
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error): void {
    console.error('Error loading PDF:', error, { proxyUrl });
    setIsLoading(false);
    setError(error.message || 'Failed to load PDF document');
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + SCALE_STEP, MAX_SCALE));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - SCALE_STEP, MIN_SCALE));
  };

  const handleOpenInNewTab = () => {
    window.open(pdfFile.pdfPath, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('react-pdf').then((mod) => {
        mod.pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        console.log('PDF.js worker configured:', mod.pdfjs.GlobalWorkerOptions.workerSrc);
        setWorkerReady(true);
      }).catch((err) => {
        console.error('Failed to configure PDF.js worker:', err);
        setError('Failed to initialize PDF viewer');
        setIsLoading(false);
      });
    }
  }, []);

  const pageWidth = containerWidth
    ? Math.min(containerWidth * scale, maxWidth * scale)
    : maxWidth * scale;

  return (
    <div className="w-full">
      {/* Controls Bar */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-t-lg px-4 py-3 mb-0">
        <div className="flex items-center gap-4">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={scale <= MIN_SCALE}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Zoom out"
            >
              -
            </button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={scale >= MAX_SCALE}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Zoom in"
            >
              +
            </button>
          </div>

          {/* Page Number */}
          {numPages > 0 && (
            <div className="text-sm text-gray-600">
              Page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{numPages}</span>
            </div>
          )}
        </div>

        {/* Open in New Tab Button */}
        <button
          onClick={handleOpenInNewTab}
          className="px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
        >
          Open in New Tab
        </button>
      </div>

      {/* PDF Viewer Container */}
      <div
        className="border border-t-0 border-gray-200 rounded-b-lg bg-gray-50 overflow-auto"
        style={{ maxHeight: '80vh' }}
      >
        <div className="Example__container__document p-4" ref={setContainerRef} style={{ minWidth: '100%' }}>
          {error ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
              <div className="text-center max-w-md">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Failed to Load PDF
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  We couldn&apos;t load this PDF preview. You can try again later, or open the PDF in a new tab below.
                </p>
                <button
                  onClick={handleOpenInNewTab}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Open PDF in New Tab
                </button>
              </div>
            </div>
          ) : !workerReady ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
              <div className="text-center">
                <div className="mb-4">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Loading your document
                </h3>
                <p className="text-sm text-gray-600">
                  This will just take a moment...
                </p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {isLoading && (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 absolute inset-0 bg-gray-50 z-10 rounded-b-lg">
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Loading your document
                    </h3>
                    <p className="text-sm text-gray-600">
                      This will just take a moment...
                    </p>
                  </div>
                </div>
              )}
              <Document
                file={proxyUrl}
                options={options}
                onLoadStart={onDocumentLoadStart}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
              >
                <div 
                  className="flex flex-col items-center"
                  style={{ 
                    minWidth: Math.max(pageWidth, containerWidth || maxWidth),
                    width: '100%'
                  }}
                >
                  {Array.from(new Array(numPages), (_el, index) => {
                    const pageNum = index + 1;
                    return (
                      <div
                        key={`page_${pageNum}`}
                        className="mb-4"
                        style={{ width: pageWidth, flexShrink: 0 }}
                        onMouseEnter={() => setCurrentPage(pageNum)}
                      >
                        <Page
                          pageNumber={pageNum}
                          width={pageWidth}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                          loading={<div style={{ width: pageWidth, height: pageWidth * 1.414 }} />}
                        />
                      </div>
                    );
                  })}
                </div>
              </Document>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}