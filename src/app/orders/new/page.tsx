"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { createClientBrowser } from "@/utils/supabase/client";

export default function NewOrderPage() {
  const supabase = createClientBrowser();
  const router = useRouter();
  const [item, setItem] = useState("");
  const [qty, setQty] = useState(1);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const { error } = await supabase.from("orders").insert([{ item, qty }]);
    if (!error) {
      router.push("/orders");
    } else {
      alert(error.message);
    }
  };

  return (
    <AuthGuard>
      <div className="h-screen flex flex-col">
        <Navbar />
        <main className="p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">New Order</h2>
          <form onSubmit={submit} className="flex flex-col gap-3">
            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="Item"
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="p-2 border rounded"
              min={1}
              required
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
          </form>
        </main>
      </div>
    </AuthGuard>
  );
}
