import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = supabaseServer();
  await supabase.auth.signOut();
  return NextResponse.json({ message: "Logged out" });
}
