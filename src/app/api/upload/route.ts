import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function verifyAdminToken(token?: string) {
  if (!token) return false;
  try {
    const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabaseServer.auth.getUser(token);
    if (error) {
      console.error("Supabase getUser error:", error.message);
      return false;
    }
    if (!user) return false;
    return true;
  } catch (err) {
    console.error("verifyAdminToken exception:", err);
    return false;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let token: string | undefined;
        try {
          if (clientPayload) {
            const parsed = JSON.parse(clientPayload);
            token = parsed.token;
          }
        } catch {
          throw new Error("Invalid client payload format");
        }

        const isAuthorized = await verifyAdminToken(token);
        if (!isAuthorized) {
          throw new Error("Unauthorized: Only authenticated admins can upload images.");
        }

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"],
          tokenPayload: JSON.stringify({ authorized: true }),
        };
      },
      // Removed onUploadCompleted entirely because Vercel Blob Webhooks
      // cannot reach localhost without ngrok/localtunnel, which causes the SDK to crash.
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Vercel Blob Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload authorization failed" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    
    // Read Authorization header for token validation
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;

    const isAuthorized = await verifyAdminToken(token);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!url) {
      return NextResponse.json({ error: "Missing blob URL" }, { status: 400 });
    }

    // Delete the blob file from Vercel Blob Storage
    await del(url);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete file" },
      { status: 500 }
    );
  }
}
