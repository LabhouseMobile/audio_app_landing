import admin from "@/app/lib/firebase/firebase-admin";
import { PdfFile } from "@/app/lib/firebase/recording/@types";
import { NextRequest, NextResponse } from "next/server";

/**
 * PDF download by shareId only. Resolves the PDF path server-side so
 * userId/recordingId and Firebase URLs are never exposed to the client.
 */
export async function GET(req: NextRequest) {
  try {
    const shareId = req.nextUrl.searchParams.get("shareId");

    if (!shareId) {
      return NextResponse.json(
        { error: "Missing shareId parameter" },
        { status: 400 }
      );
    }

    const db = admin.firestore();

    const publicLinkDoc = await db.collection("public_links").doc(shareId).get();
    const userId = publicLinkDoc.data()?.userId;
    const recordingId = publicLinkDoc.data()?.recordingId;

    if (!userId || !recordingId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const recordingDoc = await db
      .collection("users")
      .doc(userId)
      .collection("recordings")
      .doc(recordingId)
      .get();

    if (!recordingDoc.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const pdfFile = recordingDoc.data()?.pdfFile as PdfFile | undefined;
    if (!pdfFile?.pdfPath) {
      return NextResponse.json(
        { error: "No PDF for this recording" },
        { status: 404 }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(pdfFile.pdfPath);
    } catch {
      return NextResponse.json(
        { error: "Invalid PDF source" },
        { status: 400 }
      );
    }

    if (parsedUrl.hostname !== "firebasestorage.googleapis.com") {
      return NextResponse.json(
        { error: "Invalid PDF source" },
        { status: 400 }
      );
    }

    const response = await fetch(pdfFile.pdfPath, {
      headers: { Accept: "application/pdf" },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch PDF" },
        { status: response.status }
      );
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=document.pdf",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error in PDF download API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    );
  }
}
