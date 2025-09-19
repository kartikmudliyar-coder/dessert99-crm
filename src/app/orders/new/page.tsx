// src/app/orders/new/page.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function NewOrderPage() {
  const supabase = createClient()
  const router = useRouter()
  const [customerName, setCustomerName] = useState('')
  const [item, setItem] = useState('')
  const [qty, setQty] = useState(1)
  const [price, setPrice] = useState(0)
  const [loading, setLoading] = useState(false)

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const user = await supabase.auth.getUser()
    const created_by = user?.data?.user?.id ?? null
    const franchise_id = user?.data?.user ? (await supabase.from('profiles').select('franchise_id').eq('id', created_by).single()).data?.franchise_id : null

    const { error } = await supabase.from('orders').insert([{
      franchise_id,
      customer_name: customerName,
      item,
      qty,
      price,
      created_by
    }])
    setLoading(false)
    if (error) return alert(error.message)
    router.push('/orders')
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">New Order</h2>
      <form onSubmit={create} className="space-y-3 max-w-md">
        <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer name" className="w-full p-2 border rounded" />
        <input value={item} onChange={e => setItem(e.target.value)} placeholder="Item" className="w-full p-2 border rounded" />
        <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} className="w-full p-2 border rounded" />
        <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full p-2 border rounded" />
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">{loading ? 'Creating...' : 'Create Order'}</button>
      </form>
    </div>
  )
}
