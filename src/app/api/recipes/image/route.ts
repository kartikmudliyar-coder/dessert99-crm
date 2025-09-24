import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  const supabase = createSupabaseServerClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return new NextResponse('Missing id', { status: 400 });

  const { data: recipe } = await supabase
    .from('recipes')
    .select('image_path')
    .eq('id', id)
    .single();

  const path = recipe?.image_path as string | null;
  if (!path) return NextResponse.redirect('/api/placeholder');

  const { data, error } = await supabase.storage.from('product images').createSignedUrl(path, 60);
  if (error || !data?.signedUrl) return new NextResponse('Failed to sign', { status: 500 });

  return NextResponse.redirect(data.signedUrl);
}


