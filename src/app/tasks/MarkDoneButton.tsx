"use client";

import { useState } from "react";
import { createClientBrowser } from "@/utils/supabase/client";

export default function MarkDoneButton({ taskId }: { taskId: string }) {
  const supabase = createClientBrowser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('task_instances')
        .update({ status: 'done', completed_at: new Date().toISOString() })
        .eq('id', taskId);
      if (updateError) throw updateError;
      window.location.reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={onClick}
        disabled={loading}
        className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-60"
      >
        {loading ? 'Updating...' : 'Mark Done'}
      </button>
      {error ? <span className="text-red-600 text-sm">{error}</span> : null}
    </div>
  );
}


