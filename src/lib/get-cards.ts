// src/lib/get-cards.ts
import supabase from './supabase';

export type CardFilterOptions = {
  search?: string;
  cardType?: string;
  attribute?: string;
  subcategory?: string;
  monsterCardTypes?: string;
  type?: string;
  minLevel?: number;
  maxLevel?: number;
  minAtk?: number;
  maxAtk?: number;
  name_en?: string;
};

export async function getCardsPaginated(
  page: number,
  filters: CardFilterOptions,
  limit = 20
) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('full_card_versions')
    .select('*', { count: 'exact' });

  // Requête de base (texte)
  if (filters.search) {
    query = query.ilike('card_name', `%${filters.search}%`);
  }
  if (filters.cardType) {
    query = query.eq('cardType', filters.cardType);
  }

  // Pour TOUS les filtres textuels : on exclut d'abord le NULL, puis on ilike
  if (filters.attribute) {
    query = query
      .neq('attribute', null)
      .ilike('attribute', `%${filters.attribute}%`);
  }
  if (filters.subcategory) {
    query = query
      .neq('subcategory', null)
      .ilike('subcategory', `%${filters.subcategory}%`);
  }
  if (filters.monsterCardTypes) {
    query = query
      .neq('monsterCardTypes', null)
      .ilike('monsterCardTypes', `%${filters.monsterCardTypes}%`);
  }
  if (filters.type) {
    query = query
      .neq('type', null)
      .ilike('type', `%${filters.type}%`);
  }
  if (filters.name_en) {
    query = query
      .neq('name_en', null)
      .ilike('name_en', `%${filters.name_en}%`);
  }

  // Pour les champs numériques : exclusion de NULL puis gte/lte
  if (filters.minLevel != null || filters.maxLevel != null) {
    query = query.neq('level', null);
    if (filters.minLevel != null) query = query.gte('level', filters.minLevel);
    if (filters.maxLevel != null) query = query.lte('level', filters.maxLevel);
  }

  if (filters.minAtk != null || filters.maxAtk != null) {
    query = query.neq('atk', null);
    if (filters.minAtk != null) query = query.gte('atk', filters.minAtk);
    if (filters.maxAtk != null) query = query.lte('atk', filters.maxAtk);
  }

  // Tri + pagination
  const { data, error, count } = await query
    .order('card_name', { ascending: true })
    .range(from, to);

  return { data, error, count };
}
