// src/lib/supabaseServer.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Returns a Supabase client configured for server usage (SSR / route handlers / server actions).
 * Always await this function in server code:
 *   const supabase = await supabaseServerClient();
 */
export async function supabaseServerClient() {
  // Next.js cookies() can be async in some runtimes — await it.
  const cookieStore = await cookies();

  // Build the cookie adapter expected by @supabase/ssr
  // We only implement the read helpers here (server components can't set cookies).
  // If you need to set cookies (refresh flow), do it in middleware or a route handler.
  const cookieOptions: Partial<CookieOptions> = {
    get(name: string) {
      return cookieStore.get(name)?.value ?? null;
    },
    getAll() {
      // Readable cookie store may have getAll(); otherwise return empty array
      const arr = typeof cookieStore.getAll === 'function' ? cookieStore.getAll() : [];
      return arr.map((c) => c.value);
    },
    // set/remove operations are intentionally left out or no-op here.
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: cookieOptions as CookieOptions,
    }
  );
}
