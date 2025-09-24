import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const franchiseId: string | null = body?.franchise_id ?? null;
  const url = new URL(request.url);

  const res = NextResponse.json({ ok: true, franchise_id: franchiseId ?? null });
  res.cookies.set('franchise_scope', franchiseId ?? '', {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    secure: url.protocol === 'https:',
    maxAge: franchiseId ? 60 * 60 * 24 * 30 : 0,
  });
  return res;
}


