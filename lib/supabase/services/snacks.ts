'use client';

import { getSupabaseClient } from '../client';
import type { Snack as SupabaseSnack, SnackVariant, SnackAddon } from '../database.types';

// App format types
export interface TransformedSnack {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'popcorn' | 'drinks' | 'combos' | 'nachos' | 'hot_food' | 'merchandise';
  variants: {
    id: string;
    size: 'small' | 'medium' | 'large' | 'regular';
    price: number;
  }[];
  addons: {
    id: string;
    name: string;
    price: number;
  }[];
  isVeg: boolean;
  isPopular: boolean;
}

interface SnackWithRelations extends SupabaseSnack {
  snack_variants?: SnackVariant[];
  snack_addons?: SnackAddon[];
}

function transformSnack(snack: SnackWithRelations): TransformedSnack {
  return {
    id: snack.id,
    name: snack.name,
    description: snack.description,
    image: snack.image,
    category: snack.category,
    variants: (snack.snack_variants || []).map(v => ({
      id: v.id,
      size: v.size,
      price: v.price,
    })),
    addons: (snack.snack_addons || []).map(a => ({
      id: a.id,
      name: a.name,
      price: a.price,
    })),
    isVeg: snack.is_veg,
    isPopular: snack.is_popular,
  };
}

// Fetch all snacks
export async function fetchSnacks(filters?: {
  category?: string;
  popularOnly?: boolean;
}): Promise<TransformedSnack[]> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('snacks')
    .select(`
      *,
      snack_variants (*),
      snack_addons (*)
    `)
    .eq('is_available', true)
    .order('is_popular', { ascending: false })
    .order('name', { ascending: true });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.popularOnly) {
    query = query.eq('is_popular', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching snacks:', error);
    return [];
  }

  return (data as SnackWithRelations[]).map(transformSnack);
}

// Fetch snacks by category
export async function fetchSnacksByCategory(
  category: string
): Promise<TransformedSnack[]> {
  return fetchSnacks({ category });
}

// Fetch popular snacks
export async function fetchPopularSnacks(): Promise<TransformedSnack[]> {
  return fetchSnacks({ popularOnly: true });
}

// Fetch single snack by ID
export async function fetchSnackById(id: string): Promise<TransformedSnack | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('snacks')
    .select(`
      *,
      snack_variants (*),
      snack_addons (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching snack:', error);
    return null;
  }

  return transformSnack(data as SnackWithRelations);
}
