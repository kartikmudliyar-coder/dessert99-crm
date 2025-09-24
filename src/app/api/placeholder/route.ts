import { NextResponse } from 'next/server';

export async function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="12">No Image</text></svg>`;
  return new NextResponse(svg, { status: 200, headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=60' } });
}


