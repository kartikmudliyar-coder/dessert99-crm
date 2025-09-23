// src/utils/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export const createClientBrowser = () => {
  return createBrowserClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });
};
