// src/app/cards/page.tsx
import Link from 'next/link'
import CardFilters from '@/components/CardFilters'
import { getCardsPaginated, CardFilterOptions } from '@/lib/get-cards'

type SearchParams = {
  page?: string
  search?: string
  cardType?: string
  attribute?: string
  subcategory?: string
  monsterCardTypes?: string
  type?: string
  minLevel?: string
  maxLevel?: string
  minAtk?: string
  maxAtk?: string
  name_en?: string
}

export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const currentPage = parseInt(sp.page || '1', 10)

  // Build filter object for getCardsPaginated
  const filters: CardFilterOptions = {
    search:           sp.search           || undefined,
    cardType:         sp.cardType         || undefined,
    attribute:        sp.attribute        || undefined,
    subcategory:      sp.subcategory      || undefined,
    monsterCardTypes: sp.monsterCardTypes || undefined,
    type:             sp.type             || undefined,
    minLevel:         sp.minLevel  ? parseInt(sp.minLevel, 10) : undefined,
    maxLevel:         sp.maxLevel  ? parseInt(sp.maxLevel, 10) : undefined,
    minAtk:           sp.minAtk    ? parseInt(sp.minAtk, 10)     : undefined,
    maxAtk:           sp.maxAtk    ? parseInt(sp.maxAtk, 10)     : undefined,
    name_en:          sp.name_en               || undefined,
  }

  const { data: cards, count } = await getCardsPaginated(currentPage, filters)
  const totalPages = Math.ceil((count || 0) / 20)

  // Preserve all active filters in pagination links
  const baseParams = new URLSearchParams()
  Object.entries(filters).forEach(([key, val]) => {
    if (val != null && val !== '') {
      baseParams.set(key, String(val))
    }
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Cards</h1>

      {/* Filters (Client Component) */}
      <CardFilters />

      {/* Card grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {cards?.map((card) => (
    <div key={card.id} className="border p-3 rounded shadow bg-white">
      <img
        src={card.card_image_url}
        alt={card.card_name}
        className="w-full h-48 object-contain mb-2"
      />
      <Link
        href={`/cards/${card.id}`}
        className="text-blue-600 underline block"
      >
        {card.card_name} ({card.rarity?.toUpperCase()})
      </Link>
      <p className="text-sm text-gray-600">
        {card.name_en} &middot; {card.code} &middot; {card.edition}
      </p>
    </div>
  ))}
</div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => {
          const num = i + 1
          const params = new URLSearchParams(baseParams)
          params.set('page', String(num))
          return (
            <Link
              key={num}
              href={`/full_card_versions?${params.toString()}`}
              className={`px-3 py-1 rounded ${
                num === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {num}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
