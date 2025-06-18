// src/app/page.tsx
import Link from 'next/link'
import { getRandomCards } from '@/lib/get-random-cards'

export default async function Home() {
  const { data: cards } = await getRandomCards()

  return (
    <main className="flex flex-col items-center text-center px-4 pb-20">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-700 drop-shadow">
        Welcome to <span className="text-black">CardShouker</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-8">
        Buy, sell, and collect your favorite trading cards across the Middle East.
      </p>

      <div className="flex gap-4 mb-10">
        <Link
          href="/cards"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Browse Cards
        </Link>
        <Link
          href="/sell"
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
        >
          Sell a Card
        </Link>
      </div>

      <section className="w-full max-w-screen-xl mb-16">
        <h2 className="text-2xl font-bold mb-4 text-left">🔥 Popular Cards</h2>
        <div className="flex overflow-x-auto gap-4 pb-2">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={`/cards/${card.id}`}
              className="border p-3 rounded min-w-[180px] hover:shadow-lg transition block"
            >
              <img
                src={card.image_url}
                alt={card.name}
                className="w-full h-48 object-contain mb-2"
              />
              <span className="text-center block font-semibold">
                {card.name} {card.edition ? `(${card.edition}${card.rarity ? `, ${card.rarity.toUpperCase()}` : ''})` : ''}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Supported Games</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <img src="/logos/yugioh.png" alt="Yu-Gi-Oh!" className="h-16 object-contain" />
          <img src="/logos/mtg.png" alt="Magic: The Gathering" className="h-16 object-contain" />
          <img src="/logos/onepiece.png" alt="One Piece Card Game" className="h-16 object-contain" />
          <img src="/logos/pokemon.png" alt="Pokemon TCG" className="h-16 object-contain" />
        </div>
      </section>

      <section className="max-w-2xl text-center text-gray-700 px-6">
        <h2 className="text-2xl font-bold mb-2">What is CardShouker?</h2>
        <p>
          CardShouker is the premier online marketplace for trading cards in the Middle East.
          Whether you're a collector, a competitive duelist, or just starting out, our platform
          connects sellers and buyers across the region to discover and trade the most iconic
          cards from Yu-Gi-Oh!, Magic: The Gathering, Pokémon, One Piece, and beyond.
        </p>
      </section>
    </main>
  )
}
