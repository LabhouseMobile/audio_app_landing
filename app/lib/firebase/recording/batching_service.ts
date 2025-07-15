import admin from "../firebase-admin";
import { TranscriptionSegment } from "./@types";

const BATCH_SIZE = 100;
class BatchingService {
  async save(
    userId: string,
    recordingId: string,
    transcriptionId: string,
    segments: TranscriptionSegment<number>[]
  ): Promise<void> {
    // * Splits into batches
    const segmentBatches = [];
    for (let i = 0; i < segments.length; i += BATCH_SIZE) {
      segmentBatches.push(segments.slice(i, i + BATCH_SIZE));
    }

    // * Save batches
    const promises = [];
    for (let i = 0; i < segmentBatches.length; ++i) {
      const batch = segmentBatches[i];
      const batchDocId = i.toString().padStart(16, "0");
      promises.push(
        this.getUserRecordingDocument(userId, recordingId)
          .collection("transcripts")
          .doc(transcriptionId)
          .collection("segments")
          .doc(batchDocId)
          .set({ segments: batch }) // Store the batch of segments
      );
    }

    await Promise.all(promises);
  }

  async load(
    userId: string,
    recordingId: string,
    transcriptionId: string
  ): Promise<TranscriptionSegment<number>[]> {
    const segments: TranscriptionSegment<number>[] = [];

    const segmentsCollection = await this.getUserRecordingDocument(
      userId,
      recordingId
    )
      .collection("transcripts")
      .doc(transcriptionId)
      .collection("segments")
      .get();

    segmentsCollection.forEach((doc) => {
      const data = doc.data();
      if (data) {
        segments.push(...data.segments);
      }
    });

    return segments;
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

export const batchingService = new BatchingService();
