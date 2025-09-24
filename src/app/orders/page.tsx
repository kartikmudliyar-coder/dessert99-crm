import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';
import type { Order } from '@/types/supabase';

export default async function OrdersPage() {
  const supabase = createSupabaseServerClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  const { data: orders } = await supabase.from('orders').select('*');

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 p-4">
        <h1 className="text-3xl font-bold mb-4">Orders</h1>
        <ul>
          {orders?.map((o: Order) => (
            <li key={o.id}>
              Order #{o.id} - {o.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
