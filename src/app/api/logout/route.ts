import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  return NextResponse.redirect('/login');
}
