"use client";

import { useState } from "react";
import { createClientBrowser } from "@/utils/supabase/client";

export default function NewReceiptUpload({ poId }: { poId: string }) {
  const supabase = createClientBrowser();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const path = `receipts/${poId}-${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from('receipts').upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      // optionally link to PO via meta table or notifications
      window.location.reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={onUpload} className="px-2 py-1 text-xs bg-gray-700 text-white rounded disabled:opacity-60" disabled={loading || !file}>
        {loading ? 'Uploading...' : 'Upload receipt'}
      </button>
      {error ? <span className="text-red-600 text-xs">{error}</span> : null}
    </div>
  );
}


