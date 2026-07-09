import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function verifyAdminToken(token?: string) {
  if (!token) return false;
  try {
    const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabaseServer.auth.getUser(token);
    if (error || !user) return false;
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 1. Verify Authorization
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;
    
    const isAuthorized = await verifyAdminToken(token);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized: Only authenticated admins can upload images." }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const pathname = formData.get("pathname") as string | null;

    if (!file || !pathname) {
      return NextResponse.json({ error: "File and pathname are required" }, { status: 400 });
    }

    // 3. Upload directly to Vercel Blob from the server
    const blob = await put(pathname, file, {
      access: "public",
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Vercel Blob Server Upload Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
