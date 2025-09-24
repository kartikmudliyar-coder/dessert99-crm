// src/app/dashboard/page.tsx
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, franchise_id')
    .eq('id', session.user.id)
    .single();

  const isOwner = profile?.role === 'owner';
  const franchiseId = profile?.franchise_id ?? null;

  // Counts (role-aware)
  const recipesCountPromise = supabase
    .from('recipes')
    .select('*', { count: 'exact', head: true });

  const poBase = supabase
    .from('purchase_orders')
    .select('*', { count: 'exact', head: true });
  const poCountPromise = isOwner ? poBase : poBase.eq('franchise_id', franchiseId as string);

  const tasksBase = supabase
    .from('task_instances')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');
  const tasksPendingCountPromise = isOwner ? tasksBase : tasksBase.eq('franchise_id', franchiseId as string);

  const notesBase = supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('read', false);
  const notesUnreadCountPromise = notesBase; // RLS filters per role/user

  const [recipesCountRes, poCountRes, tasksPendingRes, notesUnreadRes] = await Promise.all([
    recipesCountPromise,
    poCountPromise,
    tasksPendingCountPromise,
    notesUnreadCountPromise,
  ]);

  const recipesCount = recipesCountRes.count ?? 0;
  const poCount = poCountRes.count ?? 0;
  const tasksPending = tasksPendingRes.count ?? 0;
  const notesUnread = notesUnreadRes.count ?? 0;

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="mb-6 text-gray-700">Welcome, {session.user.email} {isOwner ? '(owner)' : ''}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/recipes" className="block rounded border p-4 bg-white hover:bg-gray-50">
            <div className="text-sm text-gray-600">Recipes</div>
            <div className="text-2xl font-semibold">{recipesCount}</div>
          </Link>
          <Link href="/purchase-orders" className="block rounded border p-4 bg-white hover:bg-gray-50">
            <div className="text-sm text-gray-600">Purchase Orders</div>
            <div className="text-2xl font-semibold">{poCount}</div>
          </Link>
          <Link href="/tasks" className="block rounded border p-4 bg-white hover:bg-gray-50">
            <div className="text-sm text-gray-600">Pending Tasks</div>
            <div className="text-2xl font-semibold">{tasksPending}</div>
          </Link>
          <Link href="/notifications" className="block rounded border p-4 bg-white hover:bg-gray-50">
            <div className="text-sm text-gray-600">Unread Notifications</div>
            <div className="text-2xl font-semibold">{notesUnread}</div>
          </Link>
        </div>

        <div className="rounded border p-4 bg-white">
          <div className="mb-3 font-semibold">Quick links</div>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/recipes" className="px-3 py-1 rounded border">Go to Recipes</Link>
            <Link href="/inventory" className="px-3 py-1 rounded border">Go to Inventory</Link>
            <Link href="/purchase-orders" className="px-3 py-1 rounded border">Go to Purchase Orders</Link>
            <Link href="/tasks" className="px-3 py-1 rounded border">Go to Tasks</Link>
            <Link href="/notifications" className="px-3 py-1 rounded border">Go to Notifications</Link>
            {isOwner ? <Link href="/sales" className="px-3 py-1 rounded border">Go to Sales</Link> : null}
            {isOwner ? <Link href="/onboarding" className="px-3 py-1 rounded border">Owner Onboarding</Link> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
