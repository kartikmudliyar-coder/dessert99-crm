"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        router.replace("/dashboard"); // logged in → dashboard
      } else {
        router.replace("/login"); // not logged in → login
      }
    };

    checkUser();
  }, [router]);

  return <p>Redirecting...</p>;
}
