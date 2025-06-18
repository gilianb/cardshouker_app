import supabase from '@/lib/supabase'

export default async function SetDetailPage({ params }: { params: { set_id: string } }) {
  // Récupère le set
  const { data: set } = await supabase
    .from('sets')
    .select('name_en')
    .eq('set_id', params.set_id)
    .single()

  // Récupère toutes les cartes de ce set
  const { data: cards } = await supabase
    .from('full_card_versions')
    .select('id, card_name, card_image_url, code, rarity, edition')
    .eq('set_id', params.set_id)
    .order('card_name')

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{set?.name_en || 'Set'}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards?.map(card => (
          <div key={card.id} className="border p-3 rounded shadow bg-white">
            <img
              src={card.card_image_url}
              alt={card.card_name}
              className="w-full h-32 object-contain mb-2"
            />
            <div className="font-semibold">{card.card_name}</div>
            <div className="text-xs text-gray-600">{card.code} {card.rarity && `(${card.rarity})`}</div>
          </div>
        ))}
      </div>
    </div>
  )
}