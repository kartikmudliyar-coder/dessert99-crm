import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const supabaseServer = () => {
  return createServerClient({
    cookies,
  });
};
