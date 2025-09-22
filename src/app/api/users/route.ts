// src/app/api/users/route.ts
import { supabaseServerClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = supabaseServerClient(req);

  const { data, error } = await supabase.from('users').select('*');

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}
