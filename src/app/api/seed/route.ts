import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, franchise_id')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Insert minimal demo data if not present
  type InsertResult = {
    error: { message: string } | null;
  } | null;

  const ops: Array<Promise<InsertResult>> = [];

  ops.push(
    supabase.from('recipes').insert([{ name: 'Chocolate Mousse', description: 'Rich, airy dessert.' }]).maybeSingle()
  );

  ops.push(
    supabase.from('inventory_items').insert([{ name: 'Cocoa Powder', sku: 'COCOA-001', unit: 'kg' }]).maybeSingle()
  );

  const results = await Promise.allSettled(ops);

  return NextResponse.json({ ok: true, results });
}


