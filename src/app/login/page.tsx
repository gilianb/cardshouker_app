// src/app/login/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'

export default function LoginPage() {
  const [mode, setMode]       = useState<'signin'|'signup'>('signin')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState<string|null>(null)
  const router = useRouter()

  const handle = async () => {
    setError(null)
    if (mode === 'signin') {
      const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password })
      if (error) return setError(error.message)
    } else {
      const { error } = await supabaseBrowser.auth.signUp({ email, password })
      if (error) return setError(error.message)
    }
    // Après succès, on redirige vers /sell
    router.push('/sell')
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h1>
      {error && <p className="text-red-600">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <button
        onClick={handle}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </button>
      <p className="text-sm">
        {mode === 'signin' ? (
          <>No account? <button onClick={() => setMode('signup')} className="text-blue-600">Sign Up</button></>
        ) : (
          <>Have one? <button onClick={() => setMode('signin')} className="text-blue-600">Sign In</button></>
        )}
      </p>
    </div>
  )
}
