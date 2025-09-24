// src/app/purchase-orders/page.tsx
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';
import NewPurchaseOrderForm from './NewPurchaseOrderForm';
import StatusActions from './StatusActions';
import NewReceiptUpload from './NewReceiptUpload';

export default async function PurchaseOrdersPage() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, franchise_id')
    .eq('id', session.user.id)
    .single();

  const role = profile?.role ?? 'staff';
  const franchiseId = profile?.franchise_id ?? null;

  const base = supabase
    .from('purchase_orders')
    .select('id, status, total_amount, expected_delivery_date, created_at, franchise_id')
    .order('created_at', { ascending: false });

  const { data: pos, error } =
    role === 'owner' || role === 'order_team'
      ? await base
      : await base.eq('franchise_id', franchiseId as string);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-semibold mb-4">Purchase Orders</h1>
        <p className="text-sm text-gray-600 mb-6">Role: {profile?.role ?? 'unknown'}</p>
        {(role === 'owner' || role === 'franchise_owner' || role === 'shop_user') && (
          <div className="mb-6">
            <NewPurchaseOrderForm />
          </div>
        )}
        <div className="rounded border p-4 bg-white">
          {error ? (
            <div className="text-red-600">Failed to load purchase orders.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-600">
                  <th className="py-2">PO ID</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Expected</th>
                  <th className="py-2">Franchise</th>
                  <th className="py-2">Actions</th>
                  <th className="py-2">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {pos?.map((po) => (
                  <tr key={po.id} className="border-t">
                    <td className="py-2">{po.id}</td>
                    <td className="py-2 capitalize">{po.status}</td>
                    <td className="py-2">{po.total_amount ?? 0}</td>
                    <td className="py-2 text-sm text-gray-600">{po.expected_delivery_date ?? '—'}</td>
                    <td className="py-2 text-sm text-gray-600">{po.franchise_id ?? '—'}</td>
                    <td className="py-2">
                      <StatusActions id={po.id} current={po.status} role={role} />
                    </td>
                    <td className="py-2">
                      {(role === 'owner' || role === 'order_team') ? <NewReceiptUpload poId={po.id} /> : null}
                    </td>
                  </tr>
                ))}
                {pos?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-3 text-gray-500">No purchase orders yet.</td>
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


