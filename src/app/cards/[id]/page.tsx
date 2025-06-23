// app/cards/[id]/page.tsx

import supabase from '@/lib/supabase'
import AddToCartButton from './AddToCartButton'

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Récupérer la version spécifique
  const { data: card, error: cardError } = await supabase
    .from('full_card_versions')
    .select('*')
    .eq('id', id)
    .single()

  if (cardError || !card) {
    return <div className="p-6 text-red-500">Card version not found.</div>
  }

  // Récupérer les listings pour cette version uniquement
  const { data: listings, error: listingsError } = await supabase
    .from('listings')
    .select(`
  id, price, quantity, condition, language, seller_id,
  full_card_versions:card_id (
    card_name, name_en, code, rarity, edition, card_image_url
  ),
  sellers(display_name, country)
`)

    .eq('card_id', id)
    .gt('quantity', 0)
    .order('price', { ascending: true })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        {card.card_image_url && (
          <a
            href={card.card_image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block max-w-xs mx-auto md:mx-0"
          >
            <img
              src={card.card_image_url}
              alt={card.card_name}
              className="rounded shadow object-contain w-full max-h-[320px]"
            />
            <span className="text-xs text-gray-500 block mt-1 text-center">
              Click to enlarge
            </span>
          </a>
        )}

        <div className="flex-1 space-y-2 text-sm text-gray-700">
          <h1 className="text-2xl font-bold text-gray-900">{card.card_name}</h1>
          <p><strong>Set:</strong> {card.name_en} ({card.code}, {card.rarity?.toUpperCase()})</p>
          <p><strong>Effect:</strong> {card.effect}</p>
          <p><strong>Type:</strong> {card.cardType}</p>
          <p><strong>Subcategory:</strong> {card.subcategory}</p>
          <p><strong>Attribute:</strong> {card.attribute}</p>
          <p><strong>Monster Type:</strong> {card.monsterCardTypes}</p>
          <p><strong>Race:</strong> {card.type}</p>
          <p><strong>Level:</strong> {card.level}</p>
          <p><strong>ATK / DEF:</strong> {card.atk} / {card.def}</p>
          <p><strong>Card Code:</strong> {card.password}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-2">Available Listings</h2>

      {listingsError && (
        <div className="text-red-500">Error loading listings: {listingsError.message}</div>
      )}

      {(!listings || listings.length === 0) && !listingsError && (
        <div className="text-gray-500">No listings for this version yet.</div>
      )}

      {listings && listings.length > 0 && (
        <table className="w-full mt-4 border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Card</th>
              <th className="p-2 text-left">Set</th>
              <th className="p-2 text-left">Code</th>
              <th className="p-2 text-left">Rarity</th>
              <th className="p-2 text-left">Edition</th>
              <th className="p-2 text-left">Seller</th>
              <th className="p-2 text-left">Country</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Qty</th>
              <th className="p-2 text-left">Condition</th>
              <th className="p-2 text-left">Language</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => {
              const fc = Array.isArray(listing.full_card_versions)
                ? listing.full_card_versions[0]
                : listing.full_card_versions

              return (
                <tr key={listing.id} className="border-t">
                  <td className="p-2 font-semibold">{fc?.card_name}</td>
                  <td className="p-2">{fc?.name_en}</td>
                  <td className="p-2">{fc?.code}</td>
                  <td className="p-2">{fc?.rarity}</td>
                  <td className="p-2">{fc?.edition}</td>
                  <td className="p-2">
                    {Array.isArray(listing.sellers) && listing.sellers.length > 0
                      ? listing.sellers[0].display_name
                      : 'Unknown'}
                  </td>
                  <td className="p-2">
                    {Array.isArray(listing.sellers) && listing.sellers.length > 0
                      ? listing.sellers[0].country
                      : '-'}
                  </td>
                  <td className="p-2 font-semibold">{listing.price} €</td>
                  <td className="p-2">{listing.quantity}</td>
                  <td className="p-2">{listing.condition}</td>
                  <td className="p-2">{listing.language}</td>
                  <td className="p-2">
                    <AddToCartButton listing={listing} fc={fc} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
// This code defines a Next.js page that displays detailed information about a specific card version
// and lists all active listings for that version. It uses Supabase to fetch the card details