// src/app/sales/page.tsx
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';
import NoAccess from '@/components/NoAccess';
import SalesEntry from './SalesEntry';

export default async function SalesPage() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  const isOwner = profile?.role === 'owner';

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-semibold mb-4">Sales</h1>
        {isOwner ? <div className="mb-6"><SalesEntry /></div> : <NoAccess message="Only owners can access Sales." />}
        <div className="rounded border p-4 bg-white">
          Coming soon: sales dashboard and reports.
        </div>
      </div>
    </div>
  );
}


