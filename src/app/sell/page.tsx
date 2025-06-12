// src/app/sell/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'

type CardOption = { id: string; name: string }

export default function SellPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [cards, setCards] = useState<CardOption[]>([])
  const [cardId, setCardId] = useState('')
  const [edition, setEdition] = useState('')
  const [condition, setCondition] = useState<'Mint'|'Near Mint'|'Played'|'Poor'>('Mint')
  const [language, setLanguage] = useState('en')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [error, setError] = useState<string|null>(null)

  // 1️⃣ Vérifier la session et rediriger si pas connecté
  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login')
      } else {
        setSession(data.session)
      }
    })
  }, [router])

  // 2️⃣ Charger la liste des cartes **une fois** que la session est OK
  useEffect(() => {
    if (!session) return
    supabaseBrowser
      .from('cards')
      .select('id,name')
      .order('name')
      .then(({ data, error }) => {
        if (error) {
          console.error('Erreur fetch cards', error)
        } else if (data) {
          setCards(data)
        }
      })
  }, [session])

  // 3️⃣ Tant que la session n’est pas validée, on n’affiche rien
  if (!session) return null

  // 4️⃣ Soumettre le formulaire
  const handleSubmit = async () => {
    setError(null)
    if (!cardId) {
      return setError('Please select a card')
    }
    const { error: insertError } = await supabaseBrowser
      .from('listings')
      .insert({
        seller_id: session.user.id,
        card_id: cardId,
        edition,
        condition,
        language,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
      })
    if (insertError) {
      setError(insertError.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold">Sell a Card</h1>
      {error && <p className="text-red-600">{error}</p>}

      <label className="block font-medium">Card</label>
      <select
        value={cardId}
        onChange={e => setCardId(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select a card</option>
        {cards.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <label className="block font-medium">Edition (Set Code)</label>
      <input
        type="text"
        value={edition}
        onChange={e => setEdition(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        placeholder="e.g. LDK2"
      />

      <label className="block font-medium">Condition</label>
      <select
        value={condition}
        onChange={e => setCondition(e.target.value as any)}
        className="w-full border px-3 py-2 rounded"
      >
        {['Mint', 'Near Mint', 'Played', 'Poor'].map(cn => (
          <option key={cn} value={cn}>
            {cn}
          </option>
        ))}
      </select>

      <label className="block font-medium">Language</label>
      <input
        type="text"
        value={language}
        onChange={e => setLanguage(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        placeholder="e.g. en, fr, jp"
      />

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
  )
}
