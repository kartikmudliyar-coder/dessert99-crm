"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-6 rounded-xl shadow-lg bg-white">
        <h1 className="text-2xl font-bold mb-4 text-center">Dessert99 CRM Login</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </div>
    </div>
  );
}
