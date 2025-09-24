import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';
import type { Customer } from '@/types/supabase';

export default async function CustomersPage() {
  const supabase = createSupabaseServerClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  const { data: customers } = await supabase.from('customers').select('*');

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 p-4">
        <h1 className="text-3xl font-bold mb-4">Customers</h1>
        <ul>
          {customers?.map((c: Customer) => (
            <li key={c.id}>
              {c.name} ({c.email ?? 'No email'})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
