import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  const url = new URL('/login', request.url);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const url = new URL('/login', request.url);
  return NextResponse.redirect(url);
}
