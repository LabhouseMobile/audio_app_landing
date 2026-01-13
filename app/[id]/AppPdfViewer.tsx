'use client'

import { PdfFile } from '@/app/lib/firebase/recording/@types'
import { RPDefaultLayout, RPPages, RPProvider } from '@pdf-viewer/react'
import { useMemo } from 'react'

type Props = {
  pdfFile: PdfFile
}

const AppPdfViewer = ({ pdfFile }: Props) => {
  // Use the proxy API route to avoid CORS issues with Firebase Storage
  const proxyUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return `/api/pdf-proxy?url=${encodeURIComponent(pdfFile.pdfPath)}`
    }
    return `${window.location.origin}/api/pdf-proxy?url=${encodeURIComponent(pdfFile.pdfPath)}`
  }, [pdfFile.pdfPath])
  
  return (
    <div className="w-full min-h-[600px] h-[80vh] border border-gray-200 rounded-lg overflow-hidden">
      <RPProvider src={proxyUrl}>
        <RPDefaultLayout style={{ height: '100%', width: '100%' }}>
          <RPPages />
        </RPDefaultLayout>
      </RPProvider>
    </div>
  )
}

export default AppPdfViewer

