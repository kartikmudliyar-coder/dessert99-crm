import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST() {
  await supabaseServer.auth.signOut();
  return NextResponse.json({ message: "Logged out" });
}
