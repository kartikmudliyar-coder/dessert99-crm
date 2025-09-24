"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/utils/supabase/client";

export default function NewPurchaseOrderForm() {
  const supabase = createClientBrowser();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [expectedDate, setExpectedDate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [franchiseId, setFranchiseId] = useState<string | null>(null);

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
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        franchise_id: franchiseId,
        status: 'requested',
        total_amount: totalAmount,
        expected_delivery_date: expectedDate || null,
      };
      const { error: insertError } = await supabase.from('purchase_orders').insert([payload]);
      if (insertError) throw insertError;
      setTotalAmount(0);
      setExpectedDate("");
      window.location.reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create purchase order';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = !franchiseId || submitting;

  return (
    <form onSubmit={onSubmit} className="rounded border p-4 bg-white space-y-3">
      <div className="font-medium">Create Purchase Order</div>
      {error ? <div className="text-red-600 text-sm">{error}</div> : null}
      <div>
        <label className="block text-sm">Total Amount</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="mt-1 w-full border rounded p-2"
          value={totalAmount}
          onChange={(e) => setTotalAmount(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label className="block text-sm">Expected Delivery Date</label>
        <input
          type="date"
          className="mt-1 w-full border rounded p-2"
          value={expectedDate}
          onChange={(e) => setExpectedDate(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        disabled={disabled}
      >
        {submitting ? 'Creating...' : 'Create PO'}
      </button>
    </form>
  );
}


