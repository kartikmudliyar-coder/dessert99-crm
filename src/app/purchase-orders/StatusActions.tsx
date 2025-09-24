"use client";

import { useState } from "react";
import { createClientBrowser } from "@/utils/supabase/client";

type Status = 'requested' | 'approved_by_franchise' | 'sent_to_hq' | 'fulfilled' | 'rejected';

export default function StatusActions({ id, current, role }: { id: string; current: Status; role: string | null }) {
  const supabase = createClientBrowser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (next: Status) => {
    setLoading(true);
    setError(null);
    try {
      const { error: upErr } = await supabase
        .from('purchase_orders')
        .update({ status: next })
        .eq('id', id);
      if (upErr) throw upErr;
      window.location.reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const canFranchiseAdvance = role === 'franchise_owner';
  const canHqAdvance = role === 'order_team' || role === 'owner';

  return (
    <div className="inline-flex items-center gap-2">
      {error ? <span className="text-red-600 text-sm">{error}</span> : null}
      {canFranchiseAdvance && current === 'requested' ? (
        <button onClick={() => update('approved_by_franchise')} disabled={loading} className="px-2 py-1 text-xs bg-blue-600 text-white rounded">Approve</button>
      ) : null}
      {canHqAdvance && (current === 'approved_by_franchise' || current === 'requested') ? (
        <button onClick={() => update('sent_to_hq')} disabled={loading} className="px-2 py-1 text-xs bg-indigo-600 text-white rounded">Send to HQ</button>
      ) : null}
      {canHqAdvance && current !== 'fulfilled' && current !== 'rejected' ? (
        <>
          <button onClick={() => update('fulfilled')} disabled={loading} className="px-2 py-1 text-xs bg-green-600 text-white rounded">Fulfill</button>
          <button onClick={() => update('rejected')} disabled={loading} className="px-2 py-1 text-xs bg-red-600 text-white rounded">Reject</button>
        </>
      ) : null}
    </div>
  );
}


