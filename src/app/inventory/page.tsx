// src/app/inventory/page.tsx
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';

export default async function InventoryPage() {
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
  type InventoryItem = { name: string | null; sku: string | null; unit: string | null };
  type InventoryRow = {
    qty: number;
    last_updated: string;
    // Some Supabase versions may return related rows as an array; support both
    inventory_items: InventoryItem | InventoryItem[] | null;
  };
  const baseQuery = supabase
    .from('inventory_levels')
    .select('qty, last_updated, inventory_items(name, sku, unit)')
    .order('last_updated', { ascending: false });

  const { data: rows, error } = isOwner
    ? await baseQuery
    : await baseQuery.eq('franchise_id', franchiseId as string);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-semibold mb-4">Inventory</h1>
        <p className="text-sm text-gray-600 mb-6">Franchise: {isOwner ? 'all' : (profile?.franchise_id ?? 'n/a')}</p>
        <div className="rounded border p-4 bg-white">
          {error ? (
            <div className="text-red-600">Failed to load inventory.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-600">
                  <th className="py-2">Item</th>
                  <th className="py-2">SKU</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Unit</th>
                  <th className="py-2">Updated</th>
                </tr>
              </thead>
              <tbody>
                {rows?.map((r: InventoryRow, idx: number) => {
                  const item = Array.isArray(r.inventory_items)
                    ? (r.inventory_items[0] ?? null)
                    : r.inventory_items;
                  return (
                  <tr key={idx} className="border-t">
                    <td className="py-2">{item?.name}</td>
                    <td className="py-2">{item?.sku ?? '—'}</td>
                    <td className="py-2">{r.qty}</td>
                    <td className="py-2">{item?.unit ?? '—'}</td>
                    <td className="py-2 text-sm text-gray-600">{new Date(r.last_updated).toLocaleString()}</td>
                  </tr>
                  );
                })}
                {rows?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-3 text-gray-500">No inventory yet.</td>
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


