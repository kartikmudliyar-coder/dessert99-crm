"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientBrowser } from "@/utils/supabase/client";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const supabase = createClientBrowser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
      } else {
        setIsAuthenticated(true);
      }
    };
    checkUser();
  }, [router, supabase]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}
