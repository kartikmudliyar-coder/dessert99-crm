// src/app/customers/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Customer } from '@/types/supabase'
import AuthGuard from '@/components/AuthGuard'
import Navbar from '@/components/Navbar'

export default function CustomersPage() {
  const supabase = createClient()
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from<'customers', Customer>('customers').select('*').order('created_at', { ascending: false })
      setCustomers(data ?? [])
    }
    load()
  }, [supabase])

  return (
    <AuthGuard>
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Customers</h2>
          <a href="/customers/new" className="px-3 py-1 bg-indigo-600 text-white rounded">+ New Customer</a>
          <ul className="mt-4 space-y-2">
            {customers.map(c => <li key={c.id} className="border p-3 rounded">{c.name} — {c.phone}</li>)}
          </ul>
        </div>
      </div>
    </AuthGuard>
  )
}
