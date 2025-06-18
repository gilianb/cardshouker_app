// src/lib/get-random-cards.ts
import supabase from './supabase'

export async function getRandomCards(limit = 10) {
  const { data, error } = await supabase
    .from('full_card_versions')
    .select('id, card_name, card_image_url, edition, rarity')
    .limit(1000)

  if (error || !data || data.length === 0) {
    console.error('❌ Supabase error or empty data', error)
    return { data: [], error }
  }

  // Sélectionne aléatoirement `limit` versions
  const shuffled = data
    .sort(() => 0.5 - Math.random())
    .slice(0, limit)
    .map(card => ({
      id: card.id,
      name: card.card_name,
      image_url: card.card_image_url,
      edition: card.edition,
      rarity: card.rarity,
    }))

  return { data: shuffled, error: null }
}
