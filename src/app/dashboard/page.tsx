"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientBrowser } from "@/utils/supabase/client";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClientBrowser();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/login");
      } else {
        setUserEmail(user.email ?? "Unknown User");
      }
    };

    checkUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <AuthGuard>
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          {userEmail && <p className="mb-4">Welcome, {userEmail} 🎉</p>}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
