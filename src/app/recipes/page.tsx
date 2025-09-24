// src/app/recipes/page.tsx
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

const NewRecipeForm = dynamic(() => import('./NewRecipeForm'), { ssr: false });

export default async function RecipesPage() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', session.user.id)
    .single();

  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, name, description, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-semibold mb-4">Recipes</h1>
        <p className="text-sm text-gray-600 mb-6">Role: {profile?.role ?? 'unknown'}</p>
        {(profile?.role === 'owner' || profile?.role === 'franchise_owner') && (
          <div className="mb-6">
            <NewRecipeForm />
          </div>
        )}
        <div className="rounded border p-4 bg-white">
          {error ? (
            <div className="text-red-600">Failed to load recipes.</div>
          ) : (
            <ul className="divide-y">
              {recipes?.map((r) => (
                <li key={r.id} className="py-3">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-sm text-gray-600">{r.description ?? '—'}</div>
                </li>
              ))}
              {recipes?.length === 0 ? (
                <li className="py-3 text-gray-500">No recipes yet.</li>
              ) : null}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}


