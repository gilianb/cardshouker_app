'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import type { Session } from '@supabase/supabase-js'

export default function Navbar() {
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    // 1️⃣ Récupère la session actuelle
    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // 2️⃣ Abonnement aux changements de session (login/logout)
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
      }
    )

    // 3️⃣ Nettoyage à la destruction du composant
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-white shadow px-6 py-3 mb-6 flex items-center">
      <Link href="/" className="mr-6 font-bold text-lg">CardShouker</Link>
      <Link href="/cards" className="mr-4 text-gray-800 hover:text-blue-600">Cards</Link>
      <Link href="/sell" className="mr-auto text-gray-800 hover:text-blue-600">Sell</Link>

      {session ? (
        <>
          <span className="mr-4 text-sm text-gray-600">
            Hi, {session.user.email}
          </span>
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
    </nav>
  )
}
