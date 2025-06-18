// filepath: src/components/Sidebar.tsx
'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'

export default function Sidebar({ open, setOpen }: { open: boolean, setOpen: (o: boolean) => void }) {
  const [showSets, setShowSets] = useState(false)
  const [sets, setSets] = useState<{ set_id: string, name_en: string }[]>([])

useEffect(() => {
  if (showSets) {
    supabaseBrowser
      .from('sets')
      .select('set_id, name_en', { count: 'exact', head: false })
      .neq('name_en', null)
      .order('name_en', { ascending: true })
      .limit(1000)
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching sets:', error)
        } else if (data) {
          const uniqueSetsMap = new Map<string, { set_id: string, name_en: string }>()
          data.forEach(set => uniqueSetsMap.set(set.set_id, set))
          setSets(Array.from(uniqueSetsMap.values()))
        }
      })
  }
}, [showSets])




  return (
    <div className={`fixed left-0 top-0 z-40 flex flex-col transition-all duration-300
      ${open ? 'w-56' : 'w-14'}
      h-screen bg-transparent pt-[4rem]`}>
      <button
        className="p-3 focus:outline-none"
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
      >
        <div className="space-y-1">
          <span className="block w-6 h-0.5 bg-gray-800"></span>
          <span className="block w-6 h-0.5 bg-gray-800"></span>
          <span className="block w-6 h-0.5 bg-gray-800"></span>
        </div>
      </button>
      {open && (
        <nav className="flex-1 flex flex-col gap-2 mt-4 pl-2">
          <Link href="/" className="py-2 px-2 rounded hover:bg-blue-50 text-gray-800">Home</Link>
          <Link href="/cards" className="py-2 px-2 rounded hover:bg-blue-50 text-gray-800">Cards</Link>
          <Link href="/sell" className="py-2 px-2 rounded hover:bg-blue-50 text-gray-800">Sell</Link>
          <Link href="/dashboard" className="py-2 px-2 rounded hover:bg-blue-50 text-gray-800">Dashboard</Link>
          <button
            className="py-2 px-2 rounded hover:bg-blue-50 text-gray-800 text-left w-full"
            onClick={() => setShowSets(s => !s)}
          >
            Set {showSets ? '▲' : '▼'}
          </button>
          {showSets && (
  <div className="ml-2 overflow-y-auto max-h-[70vh] pr-1">
    <Link
      href="/sets"
      className="block py-1 px-2 rounded hover:bg-blue-200 text-blue-800 font-semibold text-sm"
    >
      All Sets
    </Link>
    {sets.map(set => (
      <Link
        key={set.set_id}
        href={`/sets/${set.set_id}`}
        className="block py-1 px-2 rounded hover:bg-blue-100 text-gray-700 text-sm whitespace-nowrap"
      >
        {set.name_en}
      </Link>
    ))}
  </div>
)}
        </nav>
      )}
    </div>
  )
}