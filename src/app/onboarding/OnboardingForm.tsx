"use client";

import { useState } from "react";
import { createClientBrowser } from "@/utils/supabase/client";
import { showToast } from "@/components/Toaster";

export default function OnboardingForm() {
  const supabase = createClientBrowser();
  const [brand, setBrand] = useState("");
  const [franchise, setFranchise] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not signed in');
      const { data: brandRow, error: bErr } = await supabase
        .from('brands')
        .insert([{ name: brand }])
        .select('id')
        .single();
      if (bErr) throw bErr;
      const brandId = brandRow.id as string;
      const { data: franchiseRow, error: fErr } = await supabase
        .from('franchises')
        .insert([{ name: franchise, brand_id: brandId }])
        .select('id')
        .single();
      if (fErr) throw fErr;
      const franchiseId = franchiseRow.id as string;
      const { error: pErr } = await supabase
        .from('profiles')
        .update({ brand_id: brandId, franchise_id: franchiseId })
        .eq('id', user.id);
      if (pErr) throw pErr;
      showToast('Onboarding complete');
      window.location.href = '/dashboard';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Onboarding failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded border p-4 bg-white space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm">Brand Name</label>
          <input className="mt-1 w-full border rounded p-2" value={brand} onChange={(e) => setBrand(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm">First Franchise Name</label>
          <input className="mt-1 w-full border rounded p-2" value={franchise} onChange={(e) => setFranchise(e.target.value)} required />
        </div>
      </div>
      {error ? <div className="text-red-600 text-sm">{error}</div> : null}
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60" disabled={loading}>
        {loading ? 'Saving...' : 'Complete Setup'}
      </button>
    </form>
  );
}


