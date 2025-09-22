"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientBrowser } from "@/utils/supabase/client";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClientBrowser();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? null);
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <span>Dessert99 CRM</span>
      {userEmail && (
        <div>
          <span className="mr-4">{userEmail}</span>
          <button onClick={handleLogout} className="bg-red-500 px-2 py-1 rounded">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
