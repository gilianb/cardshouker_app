'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import Link from 'next/link'

type Listing = {
  id: string
  price: number
  quantity: number
  condition: string
  language: string
  card_name: string
  card_image_url: string
  code: string
  rarity: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [summary, setSummary] = useState({ total: 0, stock: 0, revenue: 0 })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setSession(session)
        fetchListings(session.user.id)
      }
    })
  }, [router])

  const fetchListings = async (userId: string) => {
    const { data, error } = await supabaseBrowser
      .from('listings')
      .select('id, price, quantity, condition, language, full_card_versions(card_name, card_image_url, code, rarity)')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      const mapped = (data as any[]).map(l => ({
        id: l.id,
        price: l.price,
        quantity: l.quantity,
        condition: l.condition,
        language: l.language,
        card_name: l.full_card_versions?.card_name,
        card_image_url: l.full_card_versions?.card_image_url,
        code: l.full_card_versions?.code,
        rarity: l.full_card_versions?.rarity,
      }))
      setListings(mapped)

      // Résumé
      const total = mapped.length
      const stock = mapped.reduce((sum, l) => sum + l.quantity, 0)
      const revenue = mapped.reduce((sum, l) => sum + l.quantity * l.price, 0)
      setSummary({ total, stock, revenue })
    }
  }

  const handleDelete = async (listingId: string) => {
    const { error } = await supabaseBrowser.from('listings').delete().eq('id', listingId)
    if (!error) {
      setListings(prev => prev.filter(l => l.id !== listingId))
    }
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <Link
          href="/sell"
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          add an item to sell
        </Link>
      </div>

      {/* Résumé */}
      <div className="bg-white p-4 rounded shadow flex justify-between text-sm md:text-base">
        <div><strong>Total Listings:</strong> {summary.total}</div>
        <div><strong>Total Cards in Stock:</strong> {summary.stock}</div>
        <div><strong>Potential Revenue:</strong> {summary.revenue.toFixed(2)} €</div>
      </div>

      {/* Listings */}
      {listings.length === 0 ? (
        <p>You have no active listings.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((l) => (
            <div key={l.id} className="border p-4 rounded bg-white shadow relative">
              <img
                src={l.card_image_url}
                alt={l.card_name}
                className="w-full h-40 object-contain rounded mb-2"
              />
              <h2 className="font-semibold">{l.card_name}</h2>
              <p className="text-sm text-gray-600">{l.code} &middot; {l.rarity}</p>
              <p>Price: {l.price.toFixed(2)} €</p>
              <p>Quantity: {l.quantity}</p>
              <p>Condition: {l.condition}</p>
              <p>Language: {l.language}</p>
              <button
                onClick={() => handleDelete(l.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
