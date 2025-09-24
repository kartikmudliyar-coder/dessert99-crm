"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/utils/supabase/client";

export default function SalesEntry() {
  const supabase = createClientBrowser();
  const [franchiseId, setFranchiseId] = useState<string | null>(null);
  const [billNo, setBillNo] = useState("");
  const [items, setItems] = useState("[{\"name\":\"Brownie\",\"qty\":1,\"price\":120}]");
  const [total, setTotal] = useState<number>(120);
  const [method, setMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('franchise_id')
        .eq('id', user.id)
        .single();
      if (!mounted) return;
      setFranchiseId(profile?.franchise_id ?? null);
    })();
    return () => { mounted = false; };
  }, [supabase]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const parsed = JSON.parse(items);
      const { error: insErr } = await supabase
        .from('sales')
        .insert([{ franchise_id: franchiseId, bill_no: billNo || null, items: parsed, total_amount: total, payment_method: method }]);
      if (insErr) throw insErr;
      setBillNo("");
      setItems("[]");
      setTotal(0);
      setMethod("cash");
      window.location.reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to record sale';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded border p-4 bg-white space-y-3">
      <div className="font-medium">Record Sale</div>
      {error ? <div className="text-red-600 text-sm">{error}</div> : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm">Bill No (optional)</label>
          <input className="mt-1 w-full border rounded p-2" value={billNo} onChange={(e) => setBillNo(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Payment Method</label>
          <select className="mt-1 w-full border rounded p-2" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm">Items (JSON)</label>
        <textarea className="mt-1 w-full border rounded p-2" rows={3} value={items} onChange={(e) => setItems(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm">Total Amount</label>
        <input type="number" min="0" step="0.01" className="mt-1 w-full border rounded p-2" value={total} onChange={(e) => setTotal(Number(e.target.value))} />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60" disabled={loading}>{loading ? 'Saving...' : 'Save Sale'}</button>
    </form>
  );
}


