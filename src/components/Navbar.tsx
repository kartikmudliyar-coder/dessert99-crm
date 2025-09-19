"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-pink-500 text-white shadow-md">
      <h1 className="text-xl font-bold">🍨 Dessert99 CRM</h1>
      <div className="flex gap-4">
        <button onClick={() => router.push("/dashboard")}>Dashboard</button>
        <button onClick={() => router.push("/orders")}>Orders</button>
        <button onClick={handleLogout} className="font-semibold">
          Logout
        </button>
      </div>
    </nav>
  );
}
