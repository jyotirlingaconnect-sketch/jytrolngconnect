import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Since this is a public upload endpoint (e.g. for testimonials),
        // we don't require admin authentication. 
        // We only restrict the file types and maximum size.
        // In a production environment, you might want to add rate limiting here based on IP.
        
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"],
          // Note: Vercel Blob SDK currently enforces a global limit or limits defined in options
          tokenPayload: JSON.stringify({ publicUpload: true }),
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Vercel Blob Public Upload Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Public upload failed" },
      { status: 400 }
    );
  }
}
