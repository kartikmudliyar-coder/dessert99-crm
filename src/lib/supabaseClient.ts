// src/app/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    // if user already logged in, go to dashboard
    let mounted = true
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (mounted && user) router.push('/dashboard')
    })()
    return () => { mounted = false }
  }, [router])

  const handleLogin = async () => {
    setLoading(true); setMessage(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setMessage(error.message)
    router.push('/dashboard')
  }

  const handleSignup = async () => {
    setLoading(true); setMessage(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } } // trigger or profile creation will use this
    })
    setLoading(false)
    if (error) return setMessage(error.message)
    setMessage('Signup success — check your email if a verification/magic link is required. Redirecting...')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Dessert99 — {mode === 'login' ? 'Login' : 'Sign up'}</h2>

        {message && <p className="mb-3 text-sm text-red-600">{message}</p>}

        <div className="space-y-3">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
          {mode === 'signup' && (
            <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full name" className="w-full p-2 border rounded" />
          )}
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded" />
          <button onClick={mode === 'login' ? handleLogin : handleSignup}
            className="w-full py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>

          <div className="text-center mt-2">
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-sm text-indigo-600 underline">
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}