// src/lib/get-sets.ts
import supabase from './supabase';

export type SetFilterOptions = {
  search?: string;
  code?: string;
};

export async function getSetsPaginated(page: number, filters: SetFilterOptions, limit = 1000) {
  const from = (page - 1) * limit;
  const to = from + limit;

 const { data, count, error } = await supabase
  .from('unique_sets')
  .select('*', { count: 'exact' })
  .ilike('name_en', `%${filters.search ?? ''}%`)
  .order('name_en', { ascending: true })
  .range(from, to);
  
  if (error || !data) return { data: [], count: 0, error };

  const unique = Array.from(
    new Map(
      data
        .sort((a, b) => a.name_en.localeCompare(b.name_en))
        .map(set => [set.set_id, set])
    ).values()
  );

  const slice = unique.slice(from, from + limit);

  return { data: slice, count: unique.length, error: null };
}
