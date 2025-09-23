// src/app/dashboard/page.tsx
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="mb-4">Welcome, {session.user.email} 🎉</p>
        <form action="/api/logout" method="POST">
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
