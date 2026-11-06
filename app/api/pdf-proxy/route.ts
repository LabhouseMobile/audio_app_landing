import type { IncomingMessage } from "node:http";
import { get } from "node:https";
import { NextRequest, NextResponse } from "next/server";
import { parsePdfSourceUrl } from "@/app/lib/pdf-proxy/source-url";

// node:https needs the Node.js runtime, not Edge.
export const runtime = "nodejs";

const UPSTREAM_TIMEOUT_MS = 20_000;
const MAX_PDF_BYTES = 100 * 1024 * 1024;

// The upstream request goes through node:https rather than fetch() on purpose:
// fetch() transparently decompresses gzip/deflate/br responses, while
// node:https hands over the raw bytes. Any signed-in user can upload an object
// with arbitrary Content-Encoding metadata into our own bucket, so the response
// body is attacker-controlled even when the URL is ours. This route never
// decodes it, and refuses any response that isn't sent as identity.
function requestUpstream(url: URL): Promise<IncomingMessage> {
  return new Promise((resolve, reject) => {
    const req = get(
      url,
      {
        headers: { Accept: "application/pdf" },
        timeout: UPSTREAM_TIMEOUT_MS,
      },
      resolve
    );
    req.on("timeout", () => req.destroy(new Error("Upstream timed out")));
    req.on("error", reject);
  });
}

// Resolves to null when the body exceeds MAX_PDF_BYTES.
async function readBody(res: IncomingMessage): Promise<ArrayBuffer | null> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of res) {
    total += chunk.length;
    if (total > MAX_PDF_BYTES) {
      res.destroy();
      return null;
    }
    chunks.push(chunk);
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.length;
  }
  return body.buffer;
}

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function GET(req: NextRequest) {
  const source = parsePdfSourceUrl(req.nextUrl.searchParams.get("url"));
  if (!source) {
    return jsonError("Invalid PDF source", 400);
  }

  try {
    const upstream = await requestUpstream(source);
    const status = upstream.statusCode ?? 502;

    // Redirects are not followed: an allowed URL must not lead elsewhere.
    if (status !== 200) {
      upstream.destroy();
      return jsonError(
        "Failed to fetch PDF",
        status >= 400 && status < 500 ? status : 502
      );
    }

    const encoding = upstream.headers["content-encoding"]?.trim().toLowerCase();
    if (encoding && encoding !== "identity") {
      upstream.destroy();
      return jsonError("Unsupported PDF encoding", 502);
    }

    const declaredLength = Number(upstream.headers["content-length"]);
    if (declaredLength > MAX_PDF_BYTES) {
      upstream.destroy();
      return jsonError("PDF too large", 502);
    }

    const pdf = await readBody(upstream);
    if (!pdf) {
      return jsonError("PDF too large", 502);
    }

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=document.pdf",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    // The source URL carries a download token, so it is not logged.
    console.error(
      "Error in PDF proxy API:",
      error instanceof Error ? error.message : error
    );
    return jsonError("Internal server error", 500);
  }
}
