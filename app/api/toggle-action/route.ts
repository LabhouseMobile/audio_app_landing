import admin from "@/app/lib/firebase/firebase-admin";
import { ActionItem } from "@/app/lib/firebase/recording/@types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Request body:", body);

    const { recordingId, actionItemId, checked, userId } = body;

    const db = admin.firestore();
    console.log("Firestore initialized");

    const docRef = db
      .collection("users")
      .doc(userId)
      .collection("recordings")
      .doc(recordingId);

    const doc = await docRef.get();
    console.error("Document exists:", doc.exists);

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
    console.log("Document updated successfully");

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
