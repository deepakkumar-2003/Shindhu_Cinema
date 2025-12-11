'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Movie } from '@/lib/types';
import type { Tables } from '@/lib/supabase/database.types';

// Database row types
type MovieRow = Tables<'movies'>;
type CastMemberRow = Tables<'cast_members'>;
type CrewMemberRow = Tables<'crew_members'>;

interface MovieFilters {
  status?: 'now_showing' | 'coming_soon';
  language?: string;
  genre?: string;
  format?: string;
}

export function useMovies(filters?: MovieFilters) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      setIsLoading(true);
      setError(null);

      try {
        const supabase = getSupabaseClient();

        // First, fetch movies
        let query = supabase
          .from('movies')
          .select('*')
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

        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error('Supabase error:', fetchError.message, fetchError.code, fetchError.details);
          throw new Error(fetchError.message || 'Failed to fetch movies');
        }

        if (!data) {
          setMovies([]);
          return;
        }

        // Type assertion for movies data
        const moviesData = data as MovieRow[];

        // Fetch cast and crew for each movie
        const movieIds = moviesData.map(m => m.id);

        const [castResult, crewResult] = await Promise.all([
          supabase.from('cast_members').select('*').in('movie_id', movieIds),
          supabase.from('crew_members').select('*').in('movie_id', movieIds)
        ]);

        const castData = (castResult.data || []) as CastMemberRow[];
        const crewData = (crewResult.data || []) as CrewMemberRow[];

        const castByMovie = new Map<string, CastMemberRow[]>();
        const crewByMovie = new Map<string, CrewMemberRow[]>();

        castData.forEach(c => {
          const existing = castByMovie.get(c.movie_id) || [];
          existing.push(c);
          castByMovie.set(c.movie_id, existing);
        });

        crewData.forEach(c => {
          const existing = crewByMovie.get(c.movie_id) || [];
          existing.push(c);
          crewByMovie.set(c.movie_id, existing);
        });

        // Transform Supabase data to match app's Movie type
        const transformedMovies: Movie[] = moviesData.map((movie) => ({
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
          format: movie.formats as ('2D' | '3D' | 'IMAX')[],
          certification: movie.certification,
          status: movie.status,
          cast: (castByMovie.get(movie.id) || []).map((c) => ({
            id: c.id,
            name: c.name,
            role: c.role,
            image: c.image || '',
          })),
          crew: (crewByMovie.get(movie.id) || []).map((c) => ({
            id: c.id,
            name: c.name,
            role: c.role,
            image: c.image || '',
          })),
        }));

        setMovies(transformedMovies);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load movies';
        console.error('Error fetching movies:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, [filters?.status, filters?.language, filters?.genre, filters?.format]);

  return { movies, isLoading, error };
}

export function useMoviesByStatus(status: 'now_showing' | 'coming_soon') {
  return useMovies({ status });
}

export function useMovie(id: string) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovie() {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const supabase = getSupabaseClient();

        // Fetch the movie
        const { data: movieData, error: movieError } = await supabase
          .from('movies')
          .select('*')
          .eq('id', id)
          .single();

        if (movieError) {
          console.error('Supabase error:', movieError.message);
          throw new Error(movieError.message || 'Failed to fetch movie');
        }

        if (!movieData) {
          setMovie(null);
          return;
        }

        // Type assertion for movie data
        const movie = movieData as MovieRow;

        // Fetch cast and crew
        const [castResult, crewResult] = await Promise.all([
          supabase.from('cast_members').select('*').eq('movie_id', id),
          supabase.from('crew_members').select('*').eq('movie_id', id)
        ]);

        const castData = (castResult.data || []) as CastMemberRow[];
        const crewData = (crewResult.data || []) as CrewMemberRow[];

        // Transform to Movie type
        const transformedMovie: Movie = {
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
          format: movie.formats as ('2D' | '3D' | 'IMAX')[],
          certification: movie.certification,
          status: movie.status,
          cast: castData.map((c) => ({
            id: c.id,
            name: c.name,
            role: c.role,
            image: c.image || '',
          })),
          crew: crewData.map((c) => ({
            id: c.id,
            name: c.name,
            role: c.role,
            image: c.image || '',
          })),
        };

        setMovie(transformedMovie);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load movie';
        console.error('Error fetching movie:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

  return { movie, isLoading, error };
}
