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
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!mounted) return;
      if (error || !data?.user) {
        router.replace("/login");
      } else {
        setAuthorized(true);
      }
    };
    check();
    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  if (!authorized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
