// src/lib/supabaseServer.ts
import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';

export const supabaseServerClient = (req: NextRequest) => {
  return createServerClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    req,
  });
};
