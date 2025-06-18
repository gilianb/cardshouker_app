'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import type { Session } from '@supabase/supabase-js'

export default function Navbar({ sidebarWidth }: { sidebarWidth: string }) {
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut()
    router.push('/login')
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-30 px-6 py-3 flex items-center justify-between
        bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 shadow"
      style={{
        height: '4rem',
        minHeight: '4rem',
      }}
    >
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg">CardShouker</Link>
        <Link href="/cards" className="text-gray-800 hover:text-blue-600">Cards</Link>
        <Link href="/sell" className="text-gray-800 hover:text-blue-600">Sell</Link>
        {session && (
          <Link href="/dashboard" className="text-gray-800 hover:text-blue-600">Dashboard</Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-sm text-gray-600">Hi, {session.user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
