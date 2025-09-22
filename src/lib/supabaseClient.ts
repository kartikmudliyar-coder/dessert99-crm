// src/lib/supabaseServer.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const supabaseServerClient = () => {
  return createServerClient({ cookies });
};
