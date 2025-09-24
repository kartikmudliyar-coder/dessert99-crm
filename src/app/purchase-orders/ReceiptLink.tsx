"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/utils/supabase/client";

export default function ReceiptLink({ path }: { path: string }) {
  const supabase = createClientBrowser();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.storage.from('receipts').createSignedUrl(path, 60);
      if (!mounted) return;
      setUrl(data?.signedUrl ?? null);
    })();
    return () => { mounted = false; };
  }, [supabase, path]);

  if (!url) return null;
  return <a className="text-sm text-blue-600 underline" href={url} target="_blank" rel="noreferrer">View receipt</a>;
}


