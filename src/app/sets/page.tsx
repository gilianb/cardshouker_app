// src/app/sets/page.tsx
import Link from 'next/link'
import { getSetsPaginated, SetFilterOptions } from '@/lib/get-sets'

export type SearchParams = {
  page?: string
  search?: string
}

export default async function SetsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const currentPage = parseInt(sp.page || '1', 10)

  const filters: SetFilterOptions = {
    search: sp.search || undefined,
  }

  const { data: sets, count } = await getSetsPaginated(currentPage, filters)
  const totalPages = Math.ceil(count / 20)

  const baseParams = new URLSearchParams()
  if (filters.search) baseParams.set('search', filters.search)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Sets</h1>

      {/* Search bar */}
      <form method="get" className="mb-4">
        <input
          type="text"
          name="search"
          defaultValue={sp.search || ''}
          placeholder="Search sets..."
          className="w-full max-w-sm border rounded px-3 py-2"
        />
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sets.map((set) => (
          <div key={set.set_id} className="border p-3 rounded shadow bg-white">
            {set.image_url && (
              <img
                src={set.image_url}
                alt={set.name_en}
                className="w-full h-48 object-contain mb-2"
              />
            )}
            <Link
              href={`/sets/${set.set_id}`}
              className="text-blue-600 underline block"
            >
              {set.name_en}
            </Link>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => {
          const num = i + 1
          const params = new URLSearchParams(baseParams)
          params.set('page', String(num))
          return (
            <Link
              key={num}
              href={`/sets?${params.toString()}`}
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
