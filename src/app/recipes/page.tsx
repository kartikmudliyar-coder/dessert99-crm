// src/app/recipes/page.tsx
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';

export default async function RecipesPage() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', session.user.id)
    .single();

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-semibold mb-4">Recipes</h1>
        <p className="text-sm text-gray-600 mb-6">Role: {profile?.role ?? 'unknown'}</p>
        <div className="rounded border p-4 bg-white">Coming soon: recipe list and details.</div>
      </div>
    </div>
  );
}


