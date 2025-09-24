"use client";

import { useEffect, useState } from 'react';

type Toast = { id: number; text: string };

export function showToast(text: string) {
  const event = new CustomEvent('app-toast', { detail: { text } });
  window.dispatchEvent(event);
}

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    function onToast(e: any) {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, text: e.detail.text }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    }
    window.addEventListener('app-toast', onToast as any);
    return () => window.removeEventListener('app-toast', onToast as any);
  }, []);
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div key={t.id} className="bg-black text-white text-sm px-3 py-2 rounded shadow">{t.text}</div>
      ))}
    </div>
  );
}


