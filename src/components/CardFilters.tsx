// src/components/CardFilters.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const ATTRIBUTES = ['dark','light','earth','water','fire','wind','divine']
const SUBCATEGORIES = ['normal','continuous','quick-play','field','equip','ritual','counter']
const MONSTER_TYPES = ['fusion','synchro','xyz','link','ritual','pendulum']
const RACES = [
  'warrior','dragon','spellcaster','beast','machine','fairy',
  'zombie','psycho','rock','aqua','pyro','winged-beast','insect',
  'thunder','beast-warrior','plant','sea-serpent','reptile','cyberse'
]

export default function CardFilters() {
  const router = useRouter()
  const params = useSearchParams()

  const [search, setSearch] = useState(params.get('search') || '')
  const [cardType, setCardType] = useState(params.get('cardType') || '')
  const [attribute, setAttribute] = useState(params.get('attribute') || '')
  const [subcategory, setSubcategory] = useState(params.get('subcategory') || '')
  const [monType, setMonType] = useState(params.get('monsterCardTypes') || '')
  const [race, setRace] = useState(params.get('type') || '')
  const [minLevel, setMinLevel] = useState(params.get('minLevel') || '')
  const [maxLevel, setMaxLevel] = useState(params.get('maxLevel') || '')
  const [minAtk, setMinAtk] = useState(params.get('minAtk') || '')
  const [maxAtk, setMaxAtk] = useState(params.get('maxAtk') || '')
  const [setId, setSetId] = useState(params.get('set') || '')

  useEffect(() => {
    setSearch(params.get('search') || '')
    setCardType(params.get('cardType') || '')
    setAttribute(params.get('attribute') || '')
    setSubcategory(params.get('subcategory') || '')
    setMonType(params.get('monsterCardTypes') || '')
    setRace(params.get('type') || '')
    setMinLevel(params.get('minLevel') || '')
    setMaxLevel(params.get('maxLevel') || '')
    setMinAtk(params.get('minAtk') || '')
    setMaxAtk(params.get('maxAtk') || '')
    setSetId(params.get('set') || '')
  }, [params])

  const apply = () => {
    const q = new URLSearchParams()
    if (search)       q.set('search', search.trim())
    if (cardType)     q.set('cardType', cardType.toLowerCase())
    if (attribute)    q.set('attribute', attribute.toLowerCase())
    if (subcategory)  q.set('subcategory', subcategory.toLowerCase())
    if (monType)      q.set('monsterCardTypes', monType.toLowerCase())
    if (race)         q.set('type', race.toLowerCase())
    if (minLevel)     q.set('minLevel', String(parseInt(minLevel, 10)))
    if (maxLevel)     q.set('maxLevel', String(parseInt(maxLevel, 10)))
    if (minAtk)       q.set('minAtk', String(parseInt(minAtk, 10)))
    if (maxAtk)       q.set('maxAtk', String(parseInt(maxAtk, 10)))
    if (setId)        q.set('set', setId.trim())
    q.set('page', '1')
    router.push(`/cards?${q.toString()}`)
  }

  const reset = () => {
    router.push('/cards?page=1')
  }

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        type="text"
        placeholder="Search…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border px-2 py-1 rounded flex-1 min-w-[150px]"
      />

      <select
        value={cardType}
        onChange={e => setCardType(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        <option value="">All Types</option>
        <option value="monster">Monster</option>
        <option value="spell">Spell</option>
        <option value="trap">Trap</option>
      </select>

      <select
        value={attribute}
        onChange={e => setAttribute(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        <option value="">All Attributes</option>
        {ATTRIBUTES.map(a => (
          <option key={a} value={a}>
            {a.charAt(0).toUpperCase() + a.slice(1)}
          </option>
        ))}
      </select>

      <select
        value={subcategory}
        onChange={e => setSubcategory(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        <option value="">All Subcategories</option>
        {SUBCATEGORIES.map(s => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>

      <select
        value={monType}
        onChange={e => setMonType(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        <option value="">All Monster Types</option>
        {MONSTER_TYPES.map(m => (
          <option key={m} value={m}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </option>
        ))}
      </select>

      <select
        value={race}
        onChange={e => setRace(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        <option value="">All Races</option>
        {RACES.map(r => (
          <option key={r} value={r}>
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </option>
        ))}
      </select>

      <input
        type="number"
        min="0"
        placeholder="Min Level"
        value={minLevel}
        onChange={e => setMinLevel(e.target.value)}
        className="border px-2 py-1 rounded w-20"
      />
      <input
        type="number"
        min="0"
        placeholder="Max Level"
        value={maxLevel}
        onChange={e => setMaxLevel(e.target.value)}
        className="border px-2 py-1 rounded w-20"
      />

      <input
        type="number"
        min="0"
        placeholder="Min ATK"
        value={minAtk}
        onChange={e => setMinAtk(e.target.value)}
        className="border px-2 py-1 rounded w-24"
      />
      <input
        type="number"
        min="0"
        placeholder="Max ATK"
        value={maxAtk}
        onChange={e => setMaxAtk(e.target.value)}
        className="border px-2 py-1 rounded w-24"
      />

      <input
        type="text"
        placeholder="Set ID…"
        value={setId}
        onChange={e => setSetId(e.target.value)}
        className="border px-2 py-1 rounded w-28"
      />

      <button
        onClick={apply}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
      >
        Apply Filters
      </button>
      <button
        onClick={reset}
        className="ml-2 border border-gray-400 text-gray-700 px-3 py-1 rounded hover:bg-gray-100 transition"
      >
        Clear All
      </button>
    </div>
)}
