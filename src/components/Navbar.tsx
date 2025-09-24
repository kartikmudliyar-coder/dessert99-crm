// src/components/Navbar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/utils/supabase/client';
import ScopeSelector from './ScopeSelector';

export default function Navbar() {
  const supabase = createClientBrowser();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      const user = data?.user ?? null;
      setEmail(user?.email ?? null);
      if (user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (!mounted) return;
        setRole(profile?.role ?? null);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <nav className="w-full bg-gray-100 p-4 flex justify-between items-center">
      <Link href="/dashboard" className="font-semibold">
        Dessert99 CRM
      </Link>

      <div className="flex items-center gap-4">
        <ScopeSelector />
        <div className="hidden md:flex items-center gap-4">
          <Link href="/recipes">Recipes</Link>
          <Link href="/inventory">Inventory</Link>
          <Link href="/purchase-orders">Purchase Orders</Link>
          <Link href="/tasks">Tasks</Link>
          <Link href="/notifications">Notifications</Link>
          {role === 'owner' ? <Link href="/sales">Sales</Link> : null}
        </div>
        {email ? <span className="text-sm">{role ? `${role} • ` : ''}Signed in as {email}</span> : null}
        <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}
