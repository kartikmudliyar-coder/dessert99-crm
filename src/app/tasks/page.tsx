// src/app/tasks/page.tsx
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';
import MarkDoneButton from './MarkDoneButton';

export default async function TasksPage() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, franchise_id')
    .eq('id', session.user.id)
    .single();

  const franchiseId = profile?.franchise_id ?? null;
  const isOwner = profile?.role === 'owner';
  const baseQuery = supabase
    .from('task_instances')
    .select('id, status, scheduled_for, completed_at, notes, franchise_id')
    .order('scheduled_for', { ascending: false });
  const { data: tasks, error } = isOwner
    ? await baseQuery
    : await baseQuery.eq('franchise_id', franchiseId as string);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-semibold mb-4">Tasks</h1>
        <p className="text-sm text-gray-600 mb-6">Franchise: {isOwner ? 'all' : (profile?.franchise_id ?? 'n/a')}</p>
        <div className="rounded border p-4 bg-white">
          {error ? (
            <div className="text-red-600">Failed to load tasks.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-600">
                  <th className="py-2">Date</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Completed</th>
                  <th className="py-2">Notes</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks?.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="py-2">{t.scheduled_for ?? '—'}</td>
                    <td className="py-2 capitalize">{t.status}</td>
                    <td className="py-2 text-sm text-gray-600">{t.completed_at ? new Date(t.completed_at).toLocaleString() : '—'}</td>
                    <td className="py-2 text-sm text-gray-600">{t.notes ?? '—'}</td>
                    <td className="py-2">
                      {t.status !== 'done' ? <MarkDoneButton taskId={t.id} /> : null}
                    </td>
                  </tr>
                ))}
                {tasks?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-3 text-gray-500">No tasks yet.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}


