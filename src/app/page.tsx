"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientBrowser } from "@/utils/supabase/client";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClientBrowser();
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    };

    checkUser();
  }, [router]);

  return <p>Redirecting...</p>;
}
