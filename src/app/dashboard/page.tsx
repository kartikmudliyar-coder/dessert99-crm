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

  // Metrics: sales total (today), POs by status, tasks done today
  const today = new Date().toISOString().slice(0, 10);
  const salesBase = supabase
    .from('sales')
    .select('total_amount')
    .gte('created_at', `${today}T00:00:00.000Z`)
    .lte('created_at', `${today}T23:59:59.999Z`);
  const salesRowsPromise = isOwner ? salesBase : salesBase.eq('franchise_id', franchiseId as string);

  const poStatusBase = supabase
    .from('purchase_orders')
    .select('status')
    .gte('created_at', `${today}T00:00:00.000Z`)
    .lte('created_at', `${today}T23:59:59.999Z`);
  const poStatusRowsPromise = isOwner ? poStatusBase : poStatusBase.eq('franchise_id', franchiseId as string);

  const tasksDoneBase = supabase
    .from('task_instances')
    .select('id')
    .eq('status', 'done')
    .gte('completed_at', `${today}T00:00:00.000Z`)
    .lte('completed_at', `${today}T23:59:59.999Z`);
  const tasksDoneRowsPromise = isOwner ? tasksDoneBase : tasksDoneBase.eq('franchise_id', franchiseId as string);

  const [recipesCountRes, poCountRes, tasksPendingRes, notesUnreadRes, salesRowsRes, poStatusRowsRes, tasksDoneRowsRes] = await Promise.all([
    recipesCountPromise,
    poCountPromise,
    tasksPendingCountPromise,
    notesUnreadCountPromise,
    salesRowsPromise,
    poStatusRowsPromise,
    tasksDoneRowsPromise,
  ]);

  const recipesCount = recipesCountRes.count ?? 0;
  const poCount = poCountRes.count ?? 0;
  const tasksPending = tasksPendingRes.count ?? 0;
  const notesUnread = notesUnreadRes.count ?? 0;
  type SalesRow = { total_amount: number | string | null };
  type PoRow = { status: string };
  type TaskRow = { id: string };

  const salesToday = (salesRowsRes.data as SalesRow[] | null)?.reduce((sum, r) => sum + Number(r.total_amount ?? 0), 0) ?? 0;
  const poByStatus = (poStatusRowsRes.data as PoRow[] | null)?.reduce((acc: Record<string, number>, r: PoRow) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>) ?? {};
  const tasksDoneToday = (tasksDoneRowsRes.data as TaskRow[] | null)?.length ?? 0;

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="mb-6 text-gray-700">Welcome, {session.user.email} {isOwner ? '(owner)' : ''}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/recipes" className="block card hover:bg-gray-50">
            <div className="text-sm text-gray-600">Recipes</div>
            <div className="text-2xl font-semibold">{recipesCount}</div>
          </Link>
          <Link href="/purchase-orders" className="block card hover:bg-gray-50">
            <div className="text-sm text-gray-600">Purchase Orders</div>
            <div className="text-2xl font-semibold">{poCount}</div>
          </Link>
          <Link href="/tasks" className="block card hover:bg-gray-50">
            <div className="text-sm text-gray-600">Pending Tasks</div>
            <div className="text-2xl font-semibold">{tasksPending}</div>
          </Link>
          <Link href="/notifications" className="block card hover:bg-gray-50">
            <div className="text-sm text-gray-600">Unread Notifications</div>
            <div className="text-2xl font-semibold">{notesUnread}</div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <div className="text-sm text-gray-600 mb-1">Sales Today</div>
            <div className="text-2xl font-semibold">₹{salesToday.toLocaleString()}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600 mb-2">POs by Status (Today)</div>
            <div className="flex flex-wrap gap-2 text-sm">
              {Object.keys(poByStatus).length === 0 ? <span className="text-gray-500">No POs</span> :
                Object.entries(poByStatus).map(([k, v]) => (
                  <span key={k} className="px-2 py-1 rounded border capitalize">{k}: {v as number}</span>
                ))}
            </div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600 mb-1">Tasks Done Today</div>
            <div className="text-2xl font-semibold">{tasksDoneToday}</div>
          </div>
        </div>

        <div className="card">
          <div className="mb-3 font-semibold">Quick links</div>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/recipes" className="btn btn-secondary">Go to Recipes</Link>
            <Link href="/inventory" className="btn btn-secondary">Go to Inventory</Link>
            <Link href="/purchase-orders" className="btn btn-secondary">Go to Purchase Orders</Link>
            <Link href="/tasks" className="btn btn-secondary">Go to Tasks</Link>
            <Link href="/notifications" className="btn btn-secondary">Go to Notifications</Link>
            {isOwner ? <Link href="/sales" className="btn btn-secondary">Go to Sales</Link> : null}
            {isOwner ? <Link href="/onboarding" className="btn btn-secondary">Owner Onboarding</Link> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
