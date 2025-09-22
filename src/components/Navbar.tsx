"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@/utils/supabase/client";

export default function Navbar() {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);
    };
    fetchUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100">
      <div>Dessert99 CRM</div>
      <div className="flex gap-4 items-center">
        {userEmail && <span>{userEmail}</span>}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
