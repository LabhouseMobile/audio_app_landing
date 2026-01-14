import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const pdfUrl = searchParams.get("url");

    if (!pdfUrl) {
      return NextResponse.json(
        { error: "Missing PDF URL parameter" },
        { status: 400 }
      );
    }

    // Validate that the URL is from Firebase Storage (security check)
    if (!pdfUrl.includes("firebasestorage.googleapis.com")) {
      return NextResponse.json(
        { error: "Invalid PDF source" },
        { status: 400 }
      );
    }

    // Fetch the PDF from Firebase Storage (server-side, no CORS issues)
    const response = await fetch(pdfUrl, {
      headers: {
        Accept: "application/pdf",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch PDF" },
        { status: response.status }
      );
    }

    // Get the PDF as a buffer
    const pdfBuffer = await response.arrayBuffer();

    // Return the PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=document.pdf",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  } catch (error) {
    console.error("Error in PDF proxy API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
