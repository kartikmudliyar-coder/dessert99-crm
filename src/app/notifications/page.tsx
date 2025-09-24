// src/app/notifications/page.tsx
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';

export default async function NotificationsPage() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, franchise_id')
    .eq('id', session.user.id)
    .single();

  // role and franchiseId reserved for future targeting UI

  // Read inbox: targeted by role/user/franchise (RLS handles filtering)
  const { data: notes, error } = await supabase
    .from('notifications')
    .select('id, title, body, created_at, read')
    .order('created_at', { ascending: false });

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
        <p className="text-sm text-gray-600 mb-6">Role: {profile?.role ?? 'unknown'}</p>
        <div className="rounded border p-4 bg-white">
          {error ? (
            <div className="text-red-600">Failed to load notifications.</div>
          ) : (
            <ul className="divide-y">
              {notes?.map((n) => (
                <li key={n.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{n.title}</div>
                    {!n.read ? <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">new</span> : null}
                  </div>
                  <div className="text-sm text-gray-600">{n.body}</div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(n.created_at).toLocaleString()}</div>
                </li>
              ))}
              {notes?.length === 0 ? (
                <li className="py-3 text-gray-500">No notifications.</li>
              ) : null}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}


