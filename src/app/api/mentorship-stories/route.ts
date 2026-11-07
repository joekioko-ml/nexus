import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("mentorship_stories")
      .select("id, media_url, caption, created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Unable to load mentorship stories." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Admin access is not configured or authorized." }, { status: 401 });
  }

  try {
    const { media_url, caption } = await request.json();
    const parsedUrl = new URL(media_url);
    if (parsedUrl.hostname !== "res.cloudinary.com" || typeof caption !== "string" || caption.length > 500) {
      return NextResponse.json({ error: "Choose a Cloudinary asset and a caption up to 500 characters." }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("mentorship_stories")
      .insert({ media_url: parsedUrl.toString(), caption: caption.trim() })
      .select("id, media_url, caption, created_at")
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save the story. Check the database table configuration." }, { status: 500 });
  }
}
