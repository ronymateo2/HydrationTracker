import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sql } = body;

    if (!sql) {
      return NextResponse.json({ error: "SQL is required" }, { status: 400 });
    }

    // Create a Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // Execute the SQL directly
    const { data, error } = await supabaseAdmin.rpc("pgmigrate", { sql });

    if (error) {
      console.error("Migration error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error executing migration:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
