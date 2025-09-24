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
    <nav className="w-full bg-[--color-brand-light] p-4 flex justify-between items-center">
      <Link href="/dashboard" className="font-semibold text-[--color-brand]">
        Dessert99 CRM
      </Link>

      <div className="flex items-center gap-4">
        <ScopeSelector />
        <div className="hidden md:flex items-center gap-4">
          {/* Everyone can view recipes */}
          <Link href="/recipes">Recipes</Link>
          {/* Owner, franchise_owner, shop_user see inventory and tasks */}
          {role && ['owner','franchise_owner','shop_user'].includes(role) ? <Link href="/inventory">Inventory</Link> : null}
          {role && ['owner','franchise_owner','shop_user'].includes(role) ? <Link href="/tasks">Tasks</Link> : null}
          {/* Purchase Orders hidden from shop_user; shown to owner, franchise_owner, order_team */}
          {role && ['owner','franchise_owner','order_team'].includes(role) ? <Link href="/purchase-orders">Purchase Orders</Link> : null}
          {/* Notifications visible to all */}
          <Link href="/notifications">Notifications</Link>
          {/* Attendance for shop users and above */}
          {role && ['owner','franchise_owner','shop_user'].includes(role) ? <Link href="/attendance">Attendance</Link> : null}
          {/* Owner-only */}
          {role === 'owner' ? <Link href="/sales">Sales</Link> : null}
          {role === 'owner' ? <Link href="/onboarding">Onboarding</Link> : null}
        </div>
        {email ? <span className="text-sm text-gray-700">{role ? `${role} • ` : ''}Signed in as {email}</span> : null}
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>
    </nav>
  );
}
