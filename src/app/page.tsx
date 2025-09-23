'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/utils/supabase/client';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClientBrowser();

    supabase.auth.getUser().then((res) => {
      const data = res.data;
      if (data?.user) router.replace('/dashboard');
      else router.replace('/login');
    });
  }, [router]);

  return <div>Loading...</div>;
}
