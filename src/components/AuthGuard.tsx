"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/utils/supabase/client";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router, supabase]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
