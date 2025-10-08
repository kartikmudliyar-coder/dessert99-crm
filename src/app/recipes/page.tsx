// src/app/recipes/page.tsx
import AddRecipeButton from '@/components/AddRecipeButton';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import RecipeImageActions from './RecipeImageActions';
import { redirect } from 'next/navigation';
import NewRecipeForm from './NewRecipeForm';

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
    .select('id, name, description, image_path, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-semibold mb-4">Recipes</h1>
        <p className="text-sm text-gray-600 mb-6">Role: {profile?.role ?? 'unknown'}</p>
{profile?.role === 'owner' && (
  <div className="mb-6">
            <NewRecipeForm />
          </div>
        )}
        <div className="card">
          {error ? (
            <div className="text-gray-500 text-sm mb-2">No recipes to show.</div>
          ) : null}
            <ul className="divide-y">
              {recipes?.map((r) => (
                <li key={r.id} className="py-3">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-sm text-gray-600">{r.description ?? '—'}</div>
                  {r.image_path ? (
                    <div className="mt-2 h-24 w-24 relative">
                      {/* Signed URL fetch is done client-side below for performance; fallback */}
                      <Image src={`/api/recipes/image?id=${r.id}`} alt={r.name} fill className="object-cover rounded" />
                      <div className="absolute -bottom-8 left-0">
                        {profile?.role === 'owner' ? <RecipeImageActions id={r.id} imagePath={r.image_path} /> : null}
                      </div>
                    </div>
                  ) : null}
                </li>
              ))}
              {recipes?.length === 0 ? (
                <li className="py-3 text-gray-500">No recipes yet.</li>
              ) : null}
            </ul>
        </div>
      </div>
    </div>
  );
}


