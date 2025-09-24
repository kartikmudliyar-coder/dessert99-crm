"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/utils/supabase/client";

type RoleTarget = "all" | "owner" | "franchise_owner" | "shop_user" | "order_team";

export default function Composer() {
  const supabase = createClientBrowser();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [toRole, setToRole] = useState<RoleTarget>("all");
  const [franchiseId, setFranchiseId] = useState<string | null>(null);
  const [myRole, setMyRole] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setMyRole(profile?.role ?? null);
      setFranchiseId(profile?.franchise_id ?? null);
    })();
    return () => { mounted = false; };
  }, [supabase]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        title,
        body,
        to_role: toRole === 'all' ? null : toRole,
        franchise_id: myRole === 'franchise_owner' ? franchiseId : franchiseId,
      };
      const { error: insertError } = await supabase.from('notifications').insert([payload]);
      if (insertError) throw insertError;
      setTitle("");
      setBody("");
      setToRole("all");
      window.location.reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send notification';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Only owner and franchise_owner can send (per RLS)
  if (myRole !== 'owner' && myRole !== 'franchise_owner' && myRole !== 'order_team') {
    return null;
  }

  return (
    <form onSubmit={onSubmit} className="rounded border p-4 bg-white space-y-3">
      <div className="font-medium">Send Notification</div>
      {error ? <div className="text-red-600 text-sm">{error}</div> : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm">Title</label>
          <input className="mt-1 w-full border rounded p-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm">Target Role</label>
          <select className="mt-1 w-full border rounded p-2" value={toRole} onChange={(e) => setToRole(e.target.value as RoleTarget)}>
            <option value="all">All</option>
            <option value="owner">Owners</option>
            <option value="franchise_owner">Franchise Owners</option>
            <option value="shop_user">Shop Users</option>
            <option value="order_team">Order Team</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm">Body</label>
        <textarea className="mt-1 w-full border rounded p-2" rows={3} value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}


