"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/utils/supabase/client";

export default function ScopeSelector() {
  const supabase = createClientBrowser();
  const [franchises, setFranchises] = useState<Array<{ id: string; name: string }>>([]);
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, franchise_id')
        .eq('id', user.id)
        .single();
      if (!mounted) return;

      // Owners: list all franchises; franchise owners: list their franchise only
      if (profile?.role === 'owner') {
        const { data: rows } = await supabase.from('franchises').select('id, name').order('name');
        if (!mounted) return;
        setFranchises(rows ?? []);
      } else if (profile?.franchise_id) {
        const { data: row } = await supabase.from('franchises').select('id, name').eq('id', profile.franchise_id).single();
        if (!mounted) return;
        setFranchises(row ? [row] : []);
      }

      // Initialize from cookie
      const cookieMatch = document.cookie.match(/(?:^|; )franchise_scope=([^;]*)/);
      const current = cookieMatch ? decodeURIComponent(cookieMatch[1]) : '';
      setValue(current);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [supabase]);

  const onChange = async (id: string) => {
    setValue(id);
    await fetch('/api/scope', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ franchise_id: id || null }),
    });
    window.location.reload();
  };

  if (loading || franchises.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Scope</span>
      <select className="border rounded p-1 text-sm" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All</option>
        {franchises.map((f) => (
          <option key={f.id} value={f.id}>{f.name}</option>
        ))}
      </select>
    </div>
  );
}


