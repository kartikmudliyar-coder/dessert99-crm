// src/utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser/client helper to be used in "use client" files.
 * Exports:
 *  - createClientBrowser()  // preferred
 *  - createClient()         // alias (backwards compat)
 */
export function createClientBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
}

// convenient alias (many files import `createClient`)
export const createClient = createClientBrowser;
