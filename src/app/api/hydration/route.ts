import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createClient } from "@/lib/supabase-server";

// Get user's hydration logs for a specific date range
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = token.sub;
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const supabase = createClient();

  let query = supabase.from("beverage_logs").select("*").eq("user_id", userId);

  if (startDate) {
    query = query.gte("created_at", startDate);
  }

  if (endDate) {
    query = query.lte("created_at", endDate);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// Add a new hydration log
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = token.sub;
  const body = await request.json();
  const { beverage_type, amount } = body;

  if (!beverage_type || !amount) {
    return NextResponse.json(
      { error: "Beverage type and amount are required" },
      { status: 400 },
    );
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("beverage_logs")
    .insert({
      user_id: userId,
      beverage_type,
      amount,
      created_at: new Date().toISOString(),
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
