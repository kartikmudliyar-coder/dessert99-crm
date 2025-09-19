// src/app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // fetch the profiles row
      const { data: prof, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (error) {
        console.error('profiles fetch error', error)
      } else if (mounted) {
        setProfile(prof)
      }
      setLoading(false)
    })()

    // listen to sign-out events and redirect to login
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') router.push('/login')
    })

    return () => {
      mounted = false
      listener?.subscription.unsubscribe()
    }
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <button onClick={handleLogout} className="px-3 py-1 border rounded">Logout</button>
        </div>
      </div>

      {profile ? (
        <div>
          <p><strong>Name:</strong> {profile.full_name ?? '—'}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <p><strong>Franchise ID:</strong> {profile.franchise_id ?? '—'}</p>

          <div className="mt-6">
            {/* Show simple role-based hint */}
            {profile.role === 'owner' && <p>You are the Owner — owner views go here.</p>}
            {profile.role === 'franchise_owner' && <p>Franchise owner view — show stores and POs.</p>}
            {profile.role === 'staff' && <p>Store staff view — POS, inventory requests, tasks.</p>}
          </div>
        </div>
      ) : (
        <p>No profile found. Check your trigger or create a profiles row for this user.</p>
      )}
    </div>
  )
}