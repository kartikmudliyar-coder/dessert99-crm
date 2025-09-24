"use client";

import { useEffect, useState } from 'react';

type Toast = { id: number; text: string };
type ToastEvent = CustomEvent<{ text: string }>;

export function showToast(text: string) {
  const event: ToastEvent = new CustomEvent('app-toast', { detail: { text } });
  window.dispatchEvent(event);
}

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    const onToast = (e: Event) => {
      const evt = e as ToastEvent;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, text: evt.detail.text }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    };
    window.addEventListener('app-toast', onToast as EventListener);
    return () => window.removeEventListener('app-toast', onToast as EventListener);
  }, []);
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div key={t.id} className="bg-black text-white text-sm px-3 py-2 rounded shadow">{t.text}</div>
      ))}
    </div>
  );
}


