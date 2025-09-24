"use client";

import { useState } from "react";
import { createClientBrowser } from "@/utils/supabase/client";
import { showToast } from "@/components/Toaster";

export default function RecipeImageActions({ id, imagePath }: { id: string; imagePath: string }) {
  const supabase = createClientBrowser();
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      const { error: delErr } = await supabase.storage.from('product images').remove([imagePath]);
      if (delErr) throw delErr;
      const { error: upErr } = await supabase.from('recipes').update({ image_path: null }).eq('id', id);
      if (upErr) throw upErr;
      showToast('Image removed');
      window.location.reload();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Failed to remove image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={onDelete} disabled={loading} className="mt-2 px-2 py-1 text-xs bg-red-600 text-white rounded disabled:opacity-60">
      {loading ? 'Removing...' : 'Remove image'}
    </button>
  );
}


