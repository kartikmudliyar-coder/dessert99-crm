// src/app/orders/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Order } from '@/types/supabase'
import AuthGuard from '@/components/AuthGuard'
import Navbar from '@/components/Navbar'

export default function OrdersPage() {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from<'orders', Order>('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        console.error(error)
      } else {
        setOrders(data ?? [])
      }
      setLoading(false)
    }
    load()

    // realtime subscription (optional, step 10)
    const channel = supabase.channel('public:orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        setOrders(prev => [payload.new as Order, ...prev])
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  return (
    <AuthGuard>
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Orders</h2>
            <a href="/orders/new" className="px-3 py-1 bg-indigo-600 text-white rounded">+ New Order</a>
          </div>

          {loading ? <p>Loading...</p> : (
            <table className="min-w-full bg-white">
              <thead><tr>
                <th>Customer</th><th>Item</th><th>Qty</th><th>Price</th><th>Status</th><th>Time</th>
              </tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-t">
                    <td>{o.customer_name}</td>
                    <td>{o.item}</td>
                    <td>{o.qty}</td>
                    <td>₹{Number(o.price).toFixed(2)}</td>
                    <td>{o.status}</td>
                    <td>{new Date(o.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
