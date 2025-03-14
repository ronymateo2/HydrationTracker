import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createClient } from "@/lib/supabase-server";

// Get user profile
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = token.sub; // This is a UUID string
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is the error code for no rows returned
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// Create or update user profile
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = token.sub; // This is a UUID string
  const body = await request.json();
  const { age, gender, weight, activity_level, daily_goal } = body;

  if (!daily_goal) {
    return NextResponse.json(
      { error: "Daily goal is required" },
      { status: 400 },
    );
  }

  const supabase = createClient();

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  const now = new Date().toISOString();

  if (existingProfile) {
    // Update existing profile
    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        age,
        gender,
        weight,
        activity_level,
        daily_goal,
        updated_at: now,
      })
      .eq("user_id", userId)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } else {
    // Create new profile
    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        user_id: userId,
        age,
        gender,
        weight,
        activity_level,
        daily_goal,
        created_at: now,
        updated_at: now,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  }
}
