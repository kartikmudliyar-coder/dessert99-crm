"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientBrowser } from "@/utils/supabase/client";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClientBrowser();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setEmail(data.user?.email ?? null);
    };
    fetchUser();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="font-semibold">Dessert99 CRM</div>
      <div className="flex items-center gap-4">
        {email && <div className="text-sm">{email}</div>}
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
