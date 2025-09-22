"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientBrowser } from "@/utils/supabase/client";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const supabase = createClientBrowser();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) router.replace("/login");
      else setAuthorized(true);
    };

    checkAuth();
  }, [router, supabase]);

  if (!authorized) return <p>Loading...</p>;
  return <>{children}</>;
}
