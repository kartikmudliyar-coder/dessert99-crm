"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { createClientBrowser } from "@/utils/supabase/client";

type Order = { id: string; item: string; qty: number };

export default function OrdersPage() {
  const supabase = createClientBrowser();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase.from("orders").select("*");
      if (!error && data) setOrders(data as Order[]);
    };
    fetch();
  }, [supabase]);

  return (
    <AuthGuard>
      <div className="h-screen flex flex-col">
        <Navbar />
        <main className="p-6">
          <h2 className="text-xl font-semibold mb-4">Orders</h2>
          <ul>
            {orders.map((o) => (
              <li key={o.id}>
                {o.item} — {o.qty}
              </li>
            ))}
          </ul>
        </main>
      </div>
    </AuthGuard>
  );
}
