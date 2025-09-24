// src/app/attendance/page.tsx
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';
import CheckActions from './CheckActions';

export default async function AttendancePage() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, franchise_id')
    .eq('id', session.user.id)
    .single();

  const isOwner = profile?.role === 'owner';
  const today = new Date().toISOString().slice(0, 10);

  const base = supabase
    .from('attendance')
    .select('id, user_id, shop_id, check_in, check_out')
    .gte('check_in', `${today}T00:00:00.000Z`)
    .lte('check_in', `${today}T23:59:59.999Z`)
    .order('check_in', { ascending: false });

  const { data: rows } = isOwner ? await base : await base;

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-semibold mb-4">Attendance</h1>
        <div className="mb-4">
          <CheckActions />
        </div>
        <div className="rounded border p-4 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-gray-600">
                <th className="py-2">User</th>
                <th className="py-2">Check-in</th>
                <th className="py-2">Check-out</th>
              </tr>
            </thead>
            <tbody>
              {rows?.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-2">{r.user_id}</td>
                  <td className="py-2 text-sm text-gray-600">{new Date(r.check_in).toLocaleString()}</td>
                  <td className="py-2 text-sm text-gray-600">{r.check_out ? new Date(r.check_out).toLocaleString() : '—'}</td>
                </tr>
              ))}
              {rows?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-3 text-gray-500">No check-ins yet today.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


