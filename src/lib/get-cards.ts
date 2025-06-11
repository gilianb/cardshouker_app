// src/lib/get-cards.ts
import supabase from './supabase'

export async function getCardsPaginated(page: number, limit: number = 20) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('cards')
    .select('*', { count: 'exact' })
    .order('name', { ascending: true })
    .range(from, to)

  return { data, error, count }
}
