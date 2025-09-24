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

  type SimpleResult = { ok: boolean; error?: string };

  const ops: Array<Promise<SimpleResult>> = [];

  ops.push((async () => {
    const { error } = await supabase
      .from('recipes')
      .insert([{ name: 'Chocolate Mousse', description: 'Rich, airy dessert.' }]);
    return { ok: !error, error: error?.message };
  })());

  ops.push((async () => {
    const { error } = await supabase
      .from('inventory_items')
      .insert([{ name: 'Cocoa Powder', sku: 'COCOA-001', unit: 'kg' }]);
    return { ok: !error, error: error?.message };
  })());

  const results = await Promise.all(ops);

  return NextResponse.json({ ok: true, results });
}


