'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import Link from 'next/link'

type CardOption = { id: string; card_name: string; code: string; rarity: string }
type Listing = {
  id: string
  card_id: string
  price: number
  quantity: number
  condition: string
  language: string
  card_name: string
  code: string
  rarity: string
}

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
  { value: 'it', label: 'Italian' },
  { value: 'de', label: 'German' },
]

export default function SellPage() {
  const [session, setSession] = useState<any>(null)
  const [cards, setCards] = useState<CardOption[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [cardId, setCardId] = useState('')
  const [cardSearch, setCardSearch] = useState('')
  const [condition, setCondition] = useState<'Near Mint' | 'Excellent' | 'Good' | 'Played' | 'Poor'>('Near Mint')
  const [language, setLanguage] = useState('en')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Vérifie la session
  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!data.session) {
        window.location.href = '/login'
      } else {
        setSession(data.session)
      }
    })
  }, [])

  // Rechercher les cartes dynamiquement
  useEffect(() => {
    if (cardSearch.length < 2) return
    const timeout = setTimeout(() => {
      supabaseBrowser
        .from('full_card_versions')
        .select('id, card_name, code, rarity')
        .ilike('card_name', `%${cardSearch}%`)
        .order('card_name')
        .limit(50)
        .then(({ data, error }) => {
          if (!error && data) {
            setCards(data)
          }
        })
    }, 300)
    return () => clearTimeout(timeout)
  }, [cardSearch])

  // Charger les listings du vendeur
  useEffect(() => {
    if (!session) return
    supabaseBrowser
      .from('listings')
      .select('id, card_id, price, quantity, condition, language, full_card_versions!inner(card_name, code, rarity)')
      .eq('seller_id', session.user.id)
      .then(({ data, error }) => {
        if (!error && data) {
          setListings(data.map(l => {
            const fv = Array.isArray(l.full_card_versions)
              ? l.full_card_versions[0]
              : l.full_card_versions;
            return {
              ...l,
              card_name: fv?.card_name ?? 'Unknown',
              code: fv?.code ?? '',
              rarity: fv?.rarity ?? '',
            }
          }))
        }
      })
  }, [session, success])

  if (!session) return null

  const handleSubmit = async () => {
    setError(null)
    setSuccess(false)

    if (!cardId) return setError('Please select a card')

    const { error: insertError } = await supabaseBrowser
      .from('listings')
      .insert({
        seller_id: session.user.id,
        card_id: cardId,
        condition,
        language,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
      })

    if (insertError) {
      setError(insertError.message)
    } else {
      setSuccess(true)
      setCardId('')
      setCardSearch('')
      setPrice('')
      setQuantity('1')
    }
  }

  return (
    <div className="flex gap-6 p-6">
      {/* Formulaire */}
      <div className="max-w-md w-full space-y-4 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold">Sell a Card</h1>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">✅ Listing published successfully!</p>}

        <label className="block font-medium">Card</label>
        <input
          type="text"
          placeholder="Search a card..."
          className="w-full border px-3 py-2 rounded mb-2"
          value={cardSearch}
          onChange={e => setCardSearch(e.target.value)}
        />
        <select
          value={cardId}
          onChange={e => setCardId(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select a card</option>
          {cards.map(c => (
            <option key={c.id} value={c.id}>
              {c.card_name}
              {c.code ? ` (${c.code}` : ''}
              {c.rarity ? `, ${c.rarity}` : ''}
              {c.code || c.rarity ? ')' : ''}
            </option>
          ))}
        </select>

        <label className="block font-medium">Condition</label>
        <select
          value={condition}
          onChange={e => setCondition(e.target.value as any)}
          className="w-full border px-3 py-2 rounded"
        >
          {['Near Mint', 'Excellent', 'Good', 'Played', 'Poor'].map(cn => (
            <option key={cn} value={cn}>{cn}</option>
          ))}
        </select>

        <label className="block font-medium">Language</label>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.value} value={lang.value}>{lang.label}</option>
          ))}
        </select>

        <label className="block font-medium">Price</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="e.g. 3.50"
        />

        <label className="block font-medium">Quantity</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Publish Listing
        </button>
      </div>

      {/* Bandeau des cartes en vente */}
      <div className="flex-1 bg-gray-50 p-4 rounded shadow max-h-[600px] overflow-y-auto">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-bold">Your Listings</h2>
    <a
      href="/dashboard"
      className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-blue-700 transition"
    >
      Go to Dashboard
    </a>
  </div>
  {listings.length === 0 ? (
    <p className="text-gray-500">No listings yet.</p>
  ) : (
    <ul className="space-y-2">
      {listings.map(l => (
        <li key={l.id} className="border p-2 rounded bg-white text-sm">
          <div className="font-semibold">
            <Link
  href={`/cards/${l.card_id}`}
  className="font-semibold text-blue-700 hover:underline"
>
  {l.card_name}
</Link>
{l.code || l.rarity ? (
  <>
    {' '}
    <span className="text-gray-600 font-normal">
      {l.code ? `(${l.code}` : ''}
      {l.rarity ? `${l.code ? ', ' : '('}${l.rarity}` : ''}
      {(l.code || l.rarity) ? ')' : ''}
    </span>
  </>
) : null}
          </div>
          <div>
            <span className="text-gray-700">{l.quantity}x</span>
            {' '}@{' '}
            <span className="text-green-700 font-semibold">{l.price}€</span>
            {' '}(
            <span className="text-gray-500">{l.condition}</span>
            )
          </div>
        </li>
      ))}
    </ul>
  )}
</div>
    </div>
  )
}
