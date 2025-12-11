'use client';

import { getSupabaseClient } from '../client';
import type { Theater as SupabaseTheater, City as SupabaseCity, Screen } from '../database.types';

// Transform to app format
export interface TransformedTheater {
  id: string;
  name: string;
  location: string;
  city: string;
  address: string;
  amenities: string[];
  distance?: number;
}

export interface TransformedCity {
  id: string;
  name: string;
  state: string;
}

interface TheaterWithRelations extends SupabaseTheater {
  cities?: SupabaseCity;
  screens?: Screen[];
}

function transformTheater(theater: TheaterWithRelations): TransformedTheater {
  return {
    id: theater.id,
    name: theater.name,
    location: theater.location,
    city: theater.cities?.name || '',
    address: theater.address,
    amenities: theater.amenities,
    distance: undefined, // Would calculate based on user location
  };
}

function transformCity(city: SupabaseCity): TransformedCity {
  return {
    id: city.id,
    name: city.name,
    state: city.state,
  };
}

// Fetch all cities
export async function fetchCities(): Promise<TransformedCity[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  return data.map(transformCity);
}

// Fetch theaters by city
export async function fetchTheatersByCity(cityId: string): Promise<TransformedTheater[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('theaters')
    .select(`
      *,
      cities (*),
      screens (*)
    `)
    .eq('city_id', cityId)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching theaters:', error);
    return [];
  }

  return (data as TheaterWithRelations[]).map(transformTheater);
}

// Fetch all theaters
export async function fetchAllTheaters(): Promise<TransformedTheater[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('theaters')
    .select(`
      *,
      cities (*),
      screens (*)
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching theaters:', error);
    return [];
  }

  return (data as TheaterWithRelations[]).map(transformTheater);
}

// Fetch theater by ID
export async function fetchTheaterById(id: string): Promise<TransformedTheater | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('theaters')
    .select(`
      *,
      cities (*),
      screens (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching theater:', error);
    return null;
  }

  return transformTheater(data as TheaterWithRelations);
}
