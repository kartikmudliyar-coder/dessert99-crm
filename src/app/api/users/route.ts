// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServer';

export async function GET() {
  const supabase = await supabaseServerClient();
  const { data, error } = await supabase.from('profiles').select('*').limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
