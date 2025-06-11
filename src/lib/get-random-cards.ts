import supabase from './supabase'

export async function getRandomCards(limit = 10) {
  const { data, error } = await supabase
    .from('cards')
    .select('id, name, image_url')
    .order('id', { ascending: false }) // fallback si .order('random()') échoue
    .limit(1000) // on récupère un sous-ensemble aléatoire côté client

  if (error || !data) return { data: [], error }

  // Sélectionne aléatoirement 10 cartes parmi les 1000
  const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, limit)

  return { data: shuffled, error: null }
}
