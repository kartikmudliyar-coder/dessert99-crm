// src/app/api/users/route.ts
import { supabaseServerClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = supabaseServerClient();
  const { data, error } = await supabase.from("users").select("*");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data });
}
