// app/cards/[id]/page.tsx

import supabase from '@/lib/supabase'

type Props = {
  params: { id: string }
}

export default async function CardDetailPage({ params }: Props) {
  const { data: card, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !card) {
    return <div className="p-6 text-red-500">Card not found.</div>
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{card.name}</h1>
      {card.image_url && (
        <img src={card.image_url} alt={card.name} className="w-full h-auto mb-4 rounded shadow" />
      )}
      <div className="space-y-2 text-sm text-gray-700">
        <p><strong>Effect:</strong> {card.effect}</p>
        <p><strong>Type:</strong> {card.cardType}</p>
        <p><strong>Subcategory:</strong> {card.subcategory}</p>
        <p><strong>Attribute:</strong> {card.attribute}</p>
        <p><strong>Monster Type:</strong> {card.monsterCardTypes}</p>
        <p><strong>Race:</strong> {card.type}</p>
        <p><strong>Level:</strong> {card.level}</p>
        <p><strong>ATK / DEF:</strong> {card.atk} / {card.def}</p>
        <p><strong>Card Code:</strong> {card.password}</p>
        <p><strong>Sets:</strong> {card.sets}</p>
      </div>
    </div>
  )
}
