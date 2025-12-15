import admin from "../firebase-admin";
import { Transcription } from "./@types";
import { batchingService } from "./batching_service";

class TranscriptService {
  async get(
    userId: string,
    recordingId: string
  ): Promise<Transcription | undefined> {
    const collection = this.getUserRecordingDocument(
      userId,
      recordingId
    ).collection("transcripts");
    // First try to get a transcript with isAudioLanguage set to true
    let querySnapshot = await collection
      .where("isAudioLanguage", "==", true)
      .get();

    // If no transcript with isAudioLanguage=true, get any available transcript
    if (querySnapshot.empty) {
      querySnapshot = await collection.get();

      // If there are still no transcripts available at all
      if (querySnapshot.empty) {
        return undefined;
      }
    }

    const transcriptDoc = querySnapshot.docs[0];
    const data = transcriptDoc.data() as Transcription;
    return {
      ...data,
      segments: await batchingService.load(
        userId,
        recordingId,
        transcriptDoc.id
      ),
    };
  }

  private getUserRecordingDocument(
    userId: string,
    recordingId: string
  ): FirebaseFirestore.DocumentReference {
    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("recordings")
      .doc(recordingId);
  }
}

export const transcriptService = new TranscriptService();
