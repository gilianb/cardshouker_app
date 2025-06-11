import Link from 'next/link'
import { getCardsPaginated } from '@/lib/get-cards'

type Props = {
  searchParams: { page?: string }
}

export default async function CardsPage({ searchParams }: Props) {
  const currentPage = parseInt(searchParams.page || '1')
  const { data: cards, count } = await getCardsPaginated(currentPage)

  const totalPages = Math.ceil((count || 0) / 20)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Cards</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards?.map(card => (
          <div key={card.id} className="border p-3 rounded shadow bg-white">
            <img src={card.image_url} alt={card.name} className="w-full h-48 object-contain mb-2" />
            <Link href={`/cards/${card.id}`} className="text-blue-600 underline">
              {card.name}
            </Link>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <Link
            key={i}
            href={`/cards?page=${i + 1}`}
            className={`px-3 py-1 rounded ${i + 1 === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </Link>
        ))}
      </div>
    </div>
  )
}
