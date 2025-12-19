import admin from "@/app/lib/firebase/firebase-admin";
import { ActionItem, PublicLink } from "@/app/lib/firebase/recording/@types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { shareId, actionItemId, checked } = body;

    if (!shareId || !actionItemId || typeof checked !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = admin.firestore();

    // Look up userId and recordingId from the public link
    const publicLinkDoc = await db
      .collection("public_links")
      .doc(shareId)
      .get();
    const publicLinkData = publicLinkDoc.data() as PublicLink | undefined;

    if (!publicLinkData) {
      return NextResponse.json(
        { error: "Invalid share link" },
        { status: 404 }
      );
    }

    const { userId, recordingId } = publicLinkData;

    const docRef = db
      .collection("users")
      .doc(userId)
      .collection("recordings")
      .doc(recordingId);

    const doc = await docRef.get();

    if (!doc.exists) {
      console.error("Document not found in Firestore");
      return NextResponse.json(
        {
          error: "Recording not found",
          path: `users/${userId}/recordings/${recordingId}`,
        },
        { status: 404 }
      );
    }

    const data = doc.data();

    const actionItems = data?.summary?.actionItems || [];
    const updated = actionItems.map((item: ActionItem) =>
      item.id === actionItemId ? { ...item, isDone: checked } : item
    );

    await docRef.update({
      summary: { ...data?.summary, actionItems: updated },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in toggle-action API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
