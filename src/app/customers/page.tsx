"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { createClientBrowser } from "@/utils/supabase/client";

type Customer = { id: string; name: string; phone?: string };

export default function CustomersPage() {
  const supabase = createClientBrowser();
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase.from("customers").select("*");
      if (!error && data) setCustomers(data as Customer[]);
    };
    fetch();
  }, [supabase]);

  return (
    <AuthGuard>
      <div className="h-screen flex flex-col">
        <Navbar />
        <main className="p-6">
          <h2 className="text-xl font-semibold mb-4">Customers</h2>
          <ul>
            {customers.map((c) => (
              <li key={c.id} className="mb-2">
                {c.name} {c.phone && `• ${c.phone}`}
              </li>
            ))}
          </ul>
        </main>
      </div>
    </AuthGuard>
  );
}
