// src/components/AuthGuard.tsx
'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/utils/supabase/client';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const supabase = createClientBrowser();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!data?.user) {
        router.replace('/login');
      } else {
        setChecking(false);
      }
    };
    checkUser();
    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  if (checking) return <div className="p-6">Checking authentication…</div>;

  return <>{children}</>;
}
