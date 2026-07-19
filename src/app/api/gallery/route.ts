import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export async function GET() {
  try {
    const { data: galleryItems, error } = await supabase
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error fetching gallery:", error);
      return NextResponse.json(
        { error: "Failed to fetch gallery items" },
        { status: 500 }
      );
    }

    return NextResponse.json({ items: galleryItems || [] });
  } catch (error) {
    console.error("Server Error fetching gallery:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
