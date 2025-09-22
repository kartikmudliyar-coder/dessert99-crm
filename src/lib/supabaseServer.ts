import { createServerClient } from "@supabase/auth-helpers-nextjs";

export function supabaseServerClient({ cookies }: { cookies: any }) {
  return createServerClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    cookies,
  });
}
