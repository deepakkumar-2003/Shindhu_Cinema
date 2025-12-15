'use client';

import { getSupabaseClient } from '../client';
import type { Movie as SupabaseMovie, CastMember, CrewMember } from '../database.types';

// Transform Supabase movie to app format
export interface TransformedMovie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  trailerUrl: string;
  synopsis: string;
  duration: number;
  releaseDate: string;
  rating: number;
  userRating: number;
  totalRatings: number;
  language: string;
  genres: string[];
  format: ('2D' | '3D' | 'Dolby Atmos')[];
  cast: {
    id: string;
    name: string;
    role: string;
    image: string;
  }[];
  crew: {
    id: string;
    name: string;
    role: string;
    image: string;
  }[];
  certification: string;
  status: 'now_showing' | 'coming_soon';
}

interface MovieWithRelations extends SupabaseMovie {
  cast_members?: CastMember[];
  crew_members?: CrewMember[];
}

function transformMovie(movie: MovieWithRelations): TransformedMovie {
  return {
    id: movie.id,
    title: movie.title,
    poster: movie.poster,
    backdrop: movie.backdrop,
    trailerUrl: movie.trailer_url || '',
    synopsis: movie.synopsis,
    duration: movie.duration,
    releaseDate: movie.release_date,
    rating: movie.rating,
    userRating: movie.user_rating,
    totalRatings: movie.total_ratings,
    language: movie.language,
    genres: movie.genres,
    format: movie.formats as ('2D' | '3D' | 'Dolby Atmos')[],
    cast: (movie.cast_members || []).map((c) => ({
      id: c.id,
      name: c.name,
      role: c.role,
      image: c.image || '',
    })),
    crew: (movie.crew_members || []).map((c) => ({
      id: c.id,
      name: c.name,
      role: c.role,
      image: c.image || '',
    })),
    certification: movie.certification,
    status: movie.status,
  };
}

// Fetch all movies
export async function fetchMovies(filters?: {
  status?: 'now_showing' | 'coming_soon';
  language?: string;
  genre?: string;
  format?: string;
}): Promise<TransformedMovie[]> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('movies')
    .select(`
      *,
      cast_members (*),
      crew_members (*)
    `)
    .order('release_date', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.language) {
    query = query.eq('language', filters.language);
  }

  if (filters?.genre) {
    query = query.contains('genres', [filters.genre]);
  }

  if (filters?.format) {
    query = query.contains('formats', [filters.format]);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching movies:', error);
    return [];
  }

  return (data as MovieWithRelations[]).map(transformMovie);
}

// Fetch single movie by ID
export async function fetchMovieById(id: string): Promise<TransformedMovie | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('movies')
    .select(`
      *,
      cast_members (*),
      crew_members (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching movie:', error);
    return null;
  }

  return transformMovie(data as MovieWithRelations);
}

// Fetch movies by status
export async function fetchMoviesByStatus(
  status: 'now_showing' | 'coming_soon'
): Promise<TransformedMovie[]> {
  return fetchMovies({ status });
}

// Search movies
export async function searchMovies(query: string): Promise<TransformedMovie[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('movies')
    .select(`
      *,
      cast_members (*),
      crew_members (*)
    `)
    .or(`title.ilike.%${query}%,synopsis.ilike.%${query}%`)
    .order('release_date', { ascending: false });

  if (error) {
    console.error('Error searching movies:', error);
    return [];
  }

  return (data as MovieWithRelations[]).map(transformMovie);
}
