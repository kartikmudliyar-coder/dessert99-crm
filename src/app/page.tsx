// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/utils/supabase/client';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClientBrowser();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) router.replace('/dashboard');
      else router.replace('/login');
    });
  }, [router]);

  return <p className="p-6">Redirecting…</p>;
}
