"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/utils/supabase/client";

export default function CheckActions() {
  const supabase = createClientBrowser();
  const [hasOpen, setHasOpen] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from('attendance')
        .select('id, check_in, check_out')
        .eq('user_id', user.id)
        .gte('check_in', `${today}T00:00:00.000Z`)
        .lte('check_in', `${today}T23:59:59.999Z`)
        .order('check_in', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!mounted) return;
      if (data && !data.check_out) setHasOpen({ id: data.id });
      else setHasOpen(null);
    })();
    return () => { mounted = false; };
  }, [supabase]);

  const checkIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not signed in');
      const { error: insErr } = await supabase
        .from('attendance')
        .insert([{ user_id: user.id, check_in: new Date().toISOString() }]);
      if (insErr) throw insErr;
      window.location.reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to check in';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async () => {
    if (!hasOpen) return;
    setLoading(true);
    setError(null);
    try {
      const { error: upErr } = await supabase
        .from('attendance')
        .update({ check_out: new Date().toISOString() })
        .eq('id', hasOpen.id);
      if (upErr) throw upErr;
      window.location.reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to check out';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-3">
      {error ? <span className="text-red-600 text-sm">{error}</span> : null}
      {hasOpen ? (
        <button onClick={checkOut} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-60">Check out</button>
      ) : (
        <button onClick={checkIn} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60">Check in</button>
      )}
    </div>
  );
}


