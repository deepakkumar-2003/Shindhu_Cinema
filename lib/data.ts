import { Movie, Theater, Showtime, Snack, City, SeatLayout, Review } from './types';

// Sai Sindhu Cinemas - Available locations
export const cities: City[] = [
  { id: '1', name: 'Anthiyur', state: 'Tamil Nadu' },
  { id: '2', name: 'Komarapalayam', state: 'Tamil Nadu' },
];

export const movies: Movie[] = [
  {
    id: '1',
    title: 'Pushpa 2: The Rule',
    poster: '/images/movies/pushpa-2-ps.jpg',
    backdrop: '/images/movies/pushpa-2-bg.jpg',
    trailerUrl: 'https://www.youtube.com/embed/Q1NKMPhP8PY',
    synopsis: 'Pushpa Raj returns with even more power and intensity as he continues his rise in the world of red sandalwood smuggling. Facing new enemies and bigger challenges, Pushpa must prove that he truly rules.',
    duration: 180,
    releaseDate: '2024-12-05',
    rating: 8.5,
    userRating: 4.3,
    totalRatings: 125000,
    language: 'Tamil',
    genres: ['Action', 'Drama', 'Thriller'],
    format: ['2D', '3D', 'Dolby Atmos'],
    certification: 'UA',
    status: 'now_showing',
    cast: [
      { id: '1', name: 'Allu Arjun', role: 'Pushpa Raj', image: 'https://image.tmdb.org/t/p/w185/jKzq4l8T7iJgLFCCnbKFoZOuBWC.jpg' },
      { id: '2', name: 'Rashmika Mandanna', role: 'Srivalli', image: 'https://image.tmdb.org/t/p/w185/6kqoXAMCSXhWB8CYN3nfzBYqxX8.jpg' },
      { id: '3', name: 'Fahadh Faasil', role: 'Bhanwar Singh Shekhawat', image: 'https://image.tmdb.org/t/p/w185/gz4kQKZJ9YTBYaSWqGThwpBe7xk.jpg' },
    ],
    crew: [
      { id: '1', name: 'Sukumar', role: 'Director', image: 'https://image.tmdb.org/t/p/w185/m6UWTIM4FsGZCdYVE1WZYF9u0iD.jpg' },
      { id: '2', name: 'Devi Sri Prasad', role: 'Music Director', image: 'https://image.tmdb.org/t/p/w185/4mIfLHdEUuwdBv5pRLXlMBcLLr0.jpg' },
    ],
  },
  {
    id: '2',
    title: 'Dune: Part Two',
    poster: '/images/movies/dune-ps.webp',
    backdrop: '/images/movies/dune-bg.webp',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe.',
    duration: 166,
    releaseDate: '2024-03-01',
    rating: 8.8,
    userRating: 4.5,
    totalRatings: 250000,
    language: 'English',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    format: ['2D', '3D', 'Dolby Atmos'],
    certification: 'UA',
    status: 'now_showing',
    cast: [
      { id: '4', name: 'Timothée Chalamet', role: 'Paul Atreides', image: 'https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upDVXeK.jpg' },
      { id: '5', name: 'Zendaya', role: 'Chani', image: 'https://image.tmdb.org/t/p/w185/sNFbrfUb4ITzPCFPkHl1v5TnZC1.jpg' },
      { id: '6', name: 'Rebecca Ferguson', role: 'Lady Jessica', image: 'https://image.tmdb.org/t/p/w185/lJloTOheuQSirSLXNA3JHsrMNfH.jpg' },
    ],
    crew: [
      { id: '3', name: 'Denis Villeneuve', role: 'Director', image: 'https://image.tmdb.org/t/p/w185/zdDgVSRiYceNjBCTd9c7bEOAa7H.jpg' },
      { id: '4', name: 'Hans Zimmer', role: 'Music Director', image: 'https://image.tmdb.org/t/p/w185/7KlJN1VTSjgiDDlAnm9e6KVOAsq.jpg' },
    ],
  },
  {
    id: '3',
    title: 'Kalki 2898 AD',
    poster: '/images/movies/kalki-2898-ps.jpg',
    backdrop: '/images/movies/kalki-2898-bg.jpg',
    trailerUrl: 'https://www.youtube.com/embed/pmddGTuVwLI',
    synopsis: 'Set in a dystopian future in the year 2898 AD, the epic mythological sci-fi film follows the story of a mysterious warrior who embarks on a journey to save the world.',
    duration: 181,
    releaseDate: '2024-06-27',
    rating: 8.2,
    userRating: 4.1,
    totalRatings: 180000,
    language: 'Tamil',
    genres: ['Sci-Fi', 'Action', 'Fantasy'],
    format: ['2D', '3D', 'Dolby Atmos'],
    certification: 'UA',
    status: 'now_showing',
    cast: [
      { id: '7', name: 'Prabhas', role: 'Bhairava', image: 'https://image.tmdb.org/t/p/w185/wZRvUKy1VygM8WxM1r4vVJxILrd.jpg' },
      { id: '8', name: 'Deepika Padukone', role: 'SUM-80', image: 'https://image.tmdb.org/t/p/w185/vxqsic7LoGHNztIbLVBBaNaSeDa.jpg' },
      { id: '9', name: 'Amitabh Bachchan', role: 'Ashwatthama', image: 'https://image.tmdb.org/t/p/w185/gJhRIGOthNqaRSsekIJZz4VyQCr.jpg' },
    ],
    crew: [
      { id: '5', name: 'Nag Ashwin', role: 'Director', image: 'https://image.tmdb.org/t/p/w185/iyqXyaIOuzI9NhojqLp8LNQnkQ7.jpg' },
      { id: '6', name: 'Santhosh Narayanan', role: 'Music Director', image: 'https://image.tmdb.org/t/p/w185/9qnG5bwO6vTD1qe0uTJyG9L8bpV.jpg' },
    ],
  },
  {
    id: '4',
    title: 'Deadpool & Wolverine',
    poster: '/images/movies/deadpool-ps.webp',
    backdrop: '/images/movies/deadpool-bg.webp',
    trailerUrl: 'https://www.youtube.com/embed/73_1biulkYk',
    synopsis: 'Deadpool is offered a place in the Marvel Cinematic Universe by the TVA. But instead, he recruits a variant of Wolverine to save his universe from extinction.',
    duration: 127,
    releaseDate: '2024-07-26',
    rating: 8.0,
    userRating: 4.2,
    totalRatings: 320000,
    language: 'English',
    genres: ['Action', 'Comedy', 'Superhero'],
    format: ['2D', '3D', 'Dolby Atmos'],
    certification: 'A',
    status: 'now_showing',
    cast: [
      { id: '10', name: 'Ryan Reynolds', role: 'Deadpool', image: 'https://image.tmdb.org/t/p/w185/2Orm6l3z3zukF1q0AgIOUqvwLeB.jpg' },
      { id: '11', name: 'Hugh Jackman', role: 'Wolverine', image: 'https://image.tmdb.org/t/p/w185/oX6CpXmnXCHLyqsa4NEed1DZAKx.jpg' },
    ],
    crew: [
      { id: '7', name: 'Shawn Levy', role: 'Director', image: 'https://image.tmdb.org/t/p/w185/j1CXZgmfvFeD7S3PYtsEk8H3ebB.jpg' },
    ],
  },
  {
    id: '5',
    title: 'Leo',
    poster: '/images/movies/leo-ps.jpg',
    backdrop: '/images/movies/leo-bg.jpg',
    trailerUrl: 'https://www.youtube.com/embed/KxB25_1O7Hs',
    synopsis: 'The residents of Chanderi face a new threat when a headless entity called Sarkata begins terrorizing the town. Vicky and his friends must once again seek Stree\'s help.',
    duration: 150,
    releaseDate: '2024-08-15',
    rating: 7.8,
    userRating: 4.0,
    totalRatings: 95000,
    language: 'Tamil',
    genres: ['Horror', 'Comedy'],
    format: ['2D'],
    certification: 'UA',
    status: 'now_showing',
    cast: [
      { id: '12', name: 'Rajkummar Rao', role: 'Vicky', image: 'https://image.tmdb.org/t/p/w185/7P5F0dS3eHb2ZWvFO8bWkUALiNp.jpg' },
      { id: '13', name: 'Shraddha Kapoor', role: 'Stree', image: 'https://image.tmdb.org/t/p/w185/kXztdxNIiAWbLvLCnPr6TvUWd0z.jpg' },
    ],
    crew: [
      { id: '8', name: 'Amar Kaushik', role: 'Director', image: 'https://image.tmdb.org/t/p/w185/8W1dchZhQz1BrSaRj4bNMXMgBOy.jpg' },
    ],
  },
  {
    id: '6',
    title: 'Good Bad Ugly',
    poster: '/images/movies/gbu-ps.jpg',
    backdrop: '/images/movies/gbu-bg.jpg',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    synopsis: 'Bajirao Singham returns for another action-packed adventure. When his wife is kidnapped, Singham must face his biggest challenge yet in a battle against an international crime syndicate.',
    duration: 165,
    releaseDate: '2024-11-01',
    rating: 7.5,
    userRating: 3.9,
    totalRatings: 75000,
    language: 'Tamil',
    genres: ['Action', 'Drama'],
    format: ['2D', 'Dolby Atmos'],
    certification: 'UA',
    status: 'now_showing',
    cast: [
      { id: '14', name: 'Ajay Devgn', role: 'Bajirao Singham', image: 'https://image.tmdb.org/t/p/w185/3oRRShMSAWPMUt2VkZVrfJwKi11.jpg' },
      { id: '15', name: 'Kareena Kapoor Khan', role: 'Avni Singham', image: 'https://image.tmdb.org/t/p/w185/mZWAPAIp4UdJXqgLgqwH6qC6Rp.jpg' },
    ],
    crew: [
      { id: '9', name: 'Rohit Shetty', role: 'Director', image: 'https://image.tmdb.org/t/p/w185/ziV2BdXWAFo3TcKUcG4ZN0HaG7r.jpg' },
    ],
  },
  {
    id: '7',
    title: 'Avatar 3',
    poster: '/images/movies/avatar-ps.jpg',
    backdrop: '/images/movies/avatar-bg.jpg',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    synopsis: 'Jake Sully and Neytiri return in the next chapter of the Avatar saga. The Sully family faces new challenges as they explore uncharted territories of Pandora.',
    duration: 190,
    releaseDate: '2025-12-19',
    rating: 0,
    userRating: 0,
    totalRatings: 0,
    language: 'English',
    genres: ['Sci-Fi', 'Adventure', 'Fantasy'],
    format: ['3D', 'Dolby Atmos'],
    certification: 'UA',
    status: 'coming_soon',
    cast: [
      { id: '16', name: 'Sam Worthington', role: 'Jake Sully', image: 'https://image.tmdb.org/t/p/w185/wksBSO8Y0rT7sEhVb31e1uL4wMU.jpg' },
      { id: '17', name: 'Zoe Saldana', role: 'Neytiri', image: 'https://image.tmdb.org/t/p/w185/ofNrWiA2KDdqiNxFTLp51HcXUlp.jpg' },
    ],
    crew: [
      { id: '10', name: 'James Cameron', role: 'Director', image: 'https://image.tmdb.org/t/p/w185/5tXGxsQyp05biKpq99NKyGRuFHX.jpg' },
    ],
  },
  {
    id: '8',
    title: 'The Batman 2',
    poster: '/images/movies/batman-2-ps.jpg',
    backdrop: '/images/movies/batman-2-bg.jpg',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    synopsis: 'The Dark Knight returns to face new threats in Gotham City. As new villains emerge, Batman must confront his past while protecting the city he loves.',
    duration: 175,
    releaseDate: '2025-10-03',
    rating: 0,
    userRating: 0,
    totalRatings: 0,
    language: 'English',
    genres: ['Action', 'Crime', 'Drama'],
    format: ['2D', 'Dolby Atmos'],
    certification: 'UA',
    status: 'coming_soon',
    cast: [
      { id: '18', name: 'Robert Pattinson', role: 'Bruce Wayne / Batman', image: 'https://image.tmdb.org/t/p/w185/fufFbqLN1xHZYAKPGpvJgTQlwfQ.jpg' },
    ],
    crew: [
      { id: '11', name: 'Matt Reeves', role: 'Director', image: 'https://image.tmdb.org/t/p/w185/fMStHc0flL5uSNM9kezY0K18fts.jpg' },
    ],
  },
  {
    id: '9',
    title: 'Dasara',
    poster: '/images/movies/dasara-ps.avif',
    backdrop: '/images/movies/dasara-bg.avif',
    trailerUrl: 'https://www.youtube.com/embed/your-trailer-id',
    synopsis: 'A powerful story set in a village near Singareni coal mines.',
    duration: 165,
    releaseDate: '2024-03-30',
    rating: 7.8,
    userRating: 4.0,
    totalRatings: 85000,
    language: 'Tamil',
    genres: ['Action', 'Drama'],
    format: ['2D', 'Dolby Atmos'],
    certification: 'UA',
    status: 'now_showing',
    cast: [
      { id: '20', name: 'Nani', role: 'Dharani', image: 'https://image.tmdb.org/t/p/w185/cHSK8n3HqxeUVOhidoH3WNuKfkL.jpg' },
    ],
    crew: [
      { id: '12', name: 'Srikanth Odela', role: 'Director', image: 'https://image.tmdb.org/t/p/w185/6WtMNdB8ViXa74Zt0OWD5pnZqJz.jpg' },
    ],
  },
];

// Sai Sindhu Cinemas - Multiplex theaters with 4 screens each at two locations
export const theaters: Theater[] = [
  // Anthiyur Location - 4 Screens
  {
    id: 'anthiyur-screen-1',
    name: 'Screen 1',
    location: 'Anthiyur',
    city: 'Anthiyur',
    address: 'Sai Sindhu Cinemas, Main Road, Anthiyur, Tamil Nadu',
    amenities: ['Dolby Atmos', '4K Projection', 'Recliner Seats', 'AC'],
    distance: 0,
    screen: 1,
  },
  {
    id: 'anthiyur-screen-2',
    name: 'Screen 2',
    location: 'Anthiyur',
    city: 'Anthiyur',
    address: 'Sai Sindhu Cinemas, Main Road, Anthiyur, Tamil Nadu',
    amenities: ['Dolby Digital', '4K Projection', 'Premium Seats', 'AC'],
    distance: 0,
    screen: 2,
  },
  {
    id: 'anthiyur-screen-3',
    name: 'Screen 3',
    location: 'Anthiyur',
    city: 'Anthiyur',
    address: 'Sai Sindhu Cinemas, Main Road, Anthiyur, Tamil Nadu',
    amenities: ['Dolby Digital', 'HD Projection', 'Standard Seats', 'AC'],
    distance: 0,
    screen: 3,
  },
  {
    id: 'anthiyur-screen-4',
    name: 'Screen 4',
    location: 'Anthiyur',
    city: 'Anthiyur',
    address: 'Sai Sindhu Cinemas, Main Road, Anthiyur, Tamil Nadu',
    amenities: ['Stereo Sound', 'HD Projection', 'Standard Seats', 'AC'],
    distance: 0,
    screen: 4,
  },
  // Komarapalayam Location - 4 Screens
  {
    id: 'komarapalayam-screen-1',
    name: 'Screen 1',
    location: 'Komarapalayam',
    city: 'Komarapalayam',
    address: 'Sai Sindhu Cinemas, Bus Stand Road, Komarapalayam, Tamil Nadu',
    amenities: ['Dolby Atmos', '4K Projection', 'Recliner Seats', 'AC'],
    distance: 0,
    screen: 1,
  },
  {
    id: 'komarapalayam-screen-2',
    name: 'Screen 2',
    location: 'Komarapalayam',
    city: 'Komarapalayam',
    address: 'Sai Sindhu Cinemas, Bus Stand Road, Komarapalayam, Tamil Nadu',
    amenities: ['Dolby Digital', '4K Projection', 'Premium Seats', 'AC'],
    distance: 0,
    screen: 2,
  },
  {
    id: 'komarapalayam-screen-3',
    name: 'Screen 3',
    location: 'Komarapalayam',
    city: 'Komarapalayam',
    address: 'Sai Sindhu Cinemas, Bus Stand Road, Komarapalayam, Tamil Nadu',
    amenities: ['Dolby Digital', 'HD Projection', 'Standard Seats', 'AC'],
    distance: 0,
    screen: 3,
  },
  {
    id: 'komarapalayam-screen-4',
    name: 'Screen 4',
    location: 'Komarapalayam',
    city: 'Komarapalayam',
    address: 'Sai Sindhu Cinemas, Bus Stand Road, Komarapalayam, Tamil Nadu',
    amenities: ['Stereo Sound', 'HD Projection', 'Standard Seats', 'AC'],
    distance: 0,
    screen: 4,
  },
];

// Show timings data - defines which movies run on which screens with specific times
// Using movie titles as keys for consistency between local and Supabase data
export interface ShowTimingData {
  movieTitle: string;
  shows: {
    screenId: number;
    times: string[];
    price: { standard: number; premium: number };
  }[];
}

export const showTimingsData: ShowTimingData[] = [
  {
    movieTitle: 'Dasara',
    shows: [
      { screenId: 2, times: ['09:00 AM', '01:00 PM', '05:00 PM', '09:00 PM'], price: { standard: 190, premium: 190 } },
      { screenId: 3, times: ['10:30 AM', '02:30 PM', '06:30 PM', '10:30 PM'], price: { standard: 190, premium: 190 } },
      { screenId: 4, times: ['12:00 PM', '04:00 PM', '08:00 PM'], price: { standard: 190, premium: 190 } },
    ],
  },
  {
    movieTitle: 'Pushpa 2: The Rule',
    shows: [
      { screenId: 1, times: ['09:00 AM', '01:00 PM', '05:00 PM', '09:00 PM'], price: { standard: 190, premium: 190 } },
      { screenId: 3, times: ['10:30 AM', '02:30 PM', '06:30 PM', '10:30 PM'], price: { standard: 190, premium: 190 } },
      { screenId: 4, times: ['12:00 PM', '04:00 PM', '08:00 PM'], price: { standard: 190, premium: 190 } },
    ],
  },
  {
    movieTitle: 'Dune: Part Two',
    shows: [
      { screenId: 1, times: ['10:00 AM', '02:00 PM', '06:00 PM', '10:00 PM'], price: { standard: 190, premium: 190 } },
      { screenId: 2, times: ['11:30 AM', '03:30 PM', '07:30 PM'], price: { standard: 190, premium: 190 } },
    ],
  },
  {
    movieTitle: 'Kalki 2898 AD',
    shows: [
      { screenId: 2, times: ['10:00 AM', '02:00 PM', '06:00 PM', '10:00 PM'], price: { standard: 190, premium: 190 } },
      { screenId: 3, times: ['09:00 AM', '01:00 PM', '05:00 PM', '09:00 PM'], price: { standard: 190, premium: 190 } },
    ],
  },
  {
    movieTitle: 'Deadpool & Wolverine',
    shows: [
      { screenId: 3, times: ['11:00 AM', '03:00 PM', '07:00 PM', '11:00 PM'], price: { standard: 190, premium: 190 } },
      { screenId: 4, times: ['09:30 AM', '01:30 PM', '05:30 PM', '09:30 PM'], price: { standard: 190, premium: 190 } },
    ],
  },
  {
    movieTitle: 'Stree 2',
    shows: [
      { screenId: 2, times: ['09:00 AM', '01:00 PM', '05:00 PM', '09:00 PM'], price: { standard: 190, premium: 190 } },
      { screenId: 4, times: ['10:00 AM', '02:00 PM', '06:00 PM', '10:00 PM'], price: { standard: 190, premium: 190 } },
    ],
  },
  {
    movieTitle: 'Singham Again',
    shows: [
      { screenId: 4, times: ['11:30 AM', '03:30 PM', '07:30 PM'], price: { standard: 190, premium: 190 } },
    ],
  },
];

// Generate showtimes - accepts movieId, date, and optionally movie title and language
export const generateShowtimes = (movieId: string, date: string, movieTitle?: string, movieLanguage?: string): Showtime[] => {
  const showtimes: Showtime[] = [];

  // Try to find show timing data by movie title first (works for Supabase UUIDs)
  // Fall back to finding by local movie ID
  let movieShowData: ShowTimingData | undefined;
  let language = movieLanguage || 'Tamil';

  if (movieTitle) {
    // Match by title (case-insensitive for flexibility)
    movieShowData = showTimingsData.find(s =>
      s.movieTitle.toLowerCase() === movieTitle.toLowerCase()
    );
  }

  if (!movieShowData) {
    // Fallback: try to find local movie by ID and then match by title
    const localMovie = movies.find(m => m.id === movieId);
    if (localMovie) {
      movieShowData = showTimingsData.find(s =>
        s.movieTitle.toLowerCase() === localMovie.title.toLowerCase()
      );
      language = localMovie.language;
    }
  }

  if (!movieShowData) {
    // No show timing data found for this movie
    return showtimes;
  }

  // Generate showtimes for each location (Anthiyur and Komarapalayam)
  const locations = ['anthiyur', 'komarapalayam'];

  locations.forEach(location => {
    movieShowData!.shows.forEach(show => {
      const theaterId = `${location}-screen-${show.screenId}`;
      const theater = theaters.find(t => t.id === theaterId);

      if (theater) {
        show.times.forEach(time => {
          // Convert 12-hour format to 24-hour for sorting
          const time24 = convertTo24Hour(time);

          showtimes.push({
            id: `${movieId}-${theaterId}-${date}-${time24}`,
            movieId,
            theaterId,
            time: time,
            date,
            format: 'Dolby Atmos',
            language,
            price: {
              standard: show.price.standard,
              premium: show.price.premium,
              recliner: Math.round(show.price.premium * 1.3),
              vip: Math.round(show.price.premium * 1.8),
            },
            availableSeats: Math.floor(Math.random() * 100) + 50,
            totalSeats: 200,
          });
        });
      }
    });
  });

  return showtimes;
};

// Helper function to convert 12-hour time to 24-hour format
function convertTo24Hour(time12: string): string {
  const [time, modifier] = time12.split(' ');
  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = modifier === 'AM' ? '00' : '12';
  } else if (modifier === 'PM') {
    hours = String(parseInt(hours, 10) + 12);
  }

  return `${hours.padStart(2, '0')}:${minutes}`;
}

export const generateSeatLayout = (showtimeId: string, prices: { standard: number; premium: number; recliner: number; vip: number }): SeatLayout => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M'];
  const seatsPerRow = 16;

  const bookedSeats = new Set<string>();
  const numBooked = Math.floor(Math.random() * 50) + 20;
  for (let i = 0; i < numBooked; i++) {
    const row = rows[Math.floor(Math.random() * rows.length)];
    const num = Math.floor(Math.random() * seatsPerRow) + 1;
    bookedSeats.add(`${row}${num}`);
  }

  return {
    showtimeId,
    screen: 'Screen 1',
    rows: rows.map((label, rowIndex) => {
      let type: 'standard' | 'premium' | 'recliner' | 'vip';
      if (rowIndex < 3) type = 'standard';
      else if (rowIndex < 7) type = 'premium';
      else if (rowIndex < 10) type = 'recliner';
      else type = 'vip';

      return {
        label,
        type,
        seats: Array.from({ length: seatsPerRow }, (_, i) => ({
          id: `${label}${i + 1}`,
          row: label,
          number: i + 1,
          type,
          status: bookedSeats.has(`${label}${i + 1}`) ? 'booked' as const : 'available' as const,
          price: prices[type],
        })),
      };
    }),
  };
};

export const snacks: Snack[] = [
  {
    id: '1',
    name: 'Classic Salted Popcorn',
    description: 'Freshly popped corn with perfect saltiness',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400',
    category: 'popcorn',
    variants: [
      { id: '1a', size: 'small', price: 150 },
      { id: '1b', size: 'medium', price: 220 },
      { id: '1c', size: 'large', price: 290 },
    ],
    addons: [
      { id: 'a1', name: 'Butter Topping', price: 30 },
      { id: 'a2', name: 'Cheese Topping', price: 40 },
    ],
    isVeg: true,
    isPopular: true,
  },
  {
    id: '2',
    name: 'Caramel Popcorn',
    description: 'Sweet caramelized popcorn for the sweet tooth',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400',
    category: 'popcorn',
    variants: [
      { id: '2a', size: 'small', price: 180 },
      { id: '2b', size: 'medium', price: 260 },
      { id: '2c', size: 'large', price: 340 },
    ],
    addons: [],
    isVeg: true,
    isPopular: true,
  },
  {
    id: '3',
    name: 'Pepsi',
    description: 'Ice-cold refreshing cola',
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400',
    category: 'drinks',
    variants: [
      { id: '3a', size: 'small', price: 100 },
      { id: '3b', size: 'medium', price: 150 },
      { id: '3c', size: 'large', price: 200 },
    ],
    addons: [],
    isVeg: true,
    isPopular: true,
  },
  {
    id: '4',
    name: 'Sprite',
    description: 'Crisp, refreshing lemon-lime soda',
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400',
    category: 'drinks',
    variants: [
      { id: '4a', size: 'small', price: 100 },
      { id: '4b', size: 'medium', price: 150 },
      { id: '4c', size: 'large', price: 200 },
    ],
    addons: [],
    isVeg: true,
    isPopular: false,
  },
  {
    id: '5',
    name: 'Popcorn + Pepsi Combo',
    description: 'Large popcorn with large Pepsi - best value!',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400',
    category: 'combos',
    variants: [
      { id: '5a', size: 'regular', price: 399 },
    ],
    addons: [
      { id: 'a1', name: 'Butter Topping', price: 30 },
      { id: 'a3', name: 'Extra Drink', price: 100 },
    ],
    isVeg: true,
    isPopular: true,
  },
  {
    id: '6',
    name: 'Family Combo',
    description: '2 Large popcorns + 4 Regular drinks',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400',
    category: 'combos',
    variants: [
      { id: '6a', size: 'regular', price: 799 },
    ],
    addons: [
      { id: 'a1', name: 'Butter Topping', price: 50 },
    ],
    isVeg: true,
    isPopular: true,
  },
  {
    id: '7',
    name: 'Nachos with Cheese',
    description: 'Crispy nachos with warm cheese dip',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400',
    category: 'nachos',
    variants: [
      { id: '7a', size: 'small', price: 180 },
      { id: '7b', size: 'large', price: 280 },
    ],
    addons: [
      { id: 'a4', name: 'Salsa Dip', price: 40 },
      { id: 'a5', name: 'Extra Cheese', price: 50 },
      { id: 'a6', name: 'Jalapenos', price: 30 },
    ],
    isVeg: true,
    isPopular: true,
  },
  {
    id: '8',
    name: 'Hot Dog',
    description: 'Classic hot dog with mustard and ketchup',
    image: 'https://images.unsplash.com/photo-1612392062631-94e1e1f51bc4?w=400',
    category: 'hot_food',
    variants: [
      { id: '8a', size: 'regular', price: 220 },
    ],
    addons: [
      { id: 'a7', name: 'Extra Sauce', price: 20 },
      { id: 'a8', name: 'Cheese Slice', price: 30 },
    ],
    isVeg: false,
    isPopular: false,
  },
  {
    id: '9',
    name: 'Veg Burger',
    description: 'Crispy veg patty burger with fresh veggies',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    category: 'hot_food',
    variants: [
      { id: '9a', size: 'regular', price: 250 },
    ],
    addons: [
      { id: 'a9', name: 'Extra Cheese', price: 40 },
      { id: 'a10', name: 'Fries', price: 80 },
    ],
    isVeg: true,
    isPopular: false,
  },
  {
    id: '10',
    name: 'Samosa (2 pcs)',
    description: 'Crispy samosas with mint chutney',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    category: 'hot_food',
    variants: [
      { id: '10a', size: 'regular', price: 120 },
    ],
    addons: [
      { id: 'a11', name: 'Extra Chutney', price: 20 },
    ],
    isVeg: true,
    isPopular: true,
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Rahul Sharma',
    movieId: '1',
    rating: 5,
    comment: 'Absolutely phenomenal! Allu Arjun delivers a performance of a lifetime. The action sequences are mind-blowing!',
    createdAt: '2024-12-06',
    likes: 1250,
  },
  {
    id: '2',
    userId: '2',
    userName: 'Priya Patel',
    movieId: '1',
    rating: 4,
    comment: 'Great movie with excellent cinematography. The interval block is absolutely stunning. A must-watch!',
    createdAt: '2024-12-05',
    likes: 890,
  },
  {
    id: '3',
    userId: '3',
    userName: 'Amit Kumar',
    movieId: '2',
    rating: 5,
    comment: 'Denis Villeneuve has created a masterpiece. The visuals in Dolby Atmos are breathtaking!',
    createdAt: '2024-03-05',
    likes: 2100,
  },
];

export const getMovieById = (id: string): Movie | undefined => {
  return movies.find(movie => movie.id === id);
};

export const getTheaterById = (id: string): Theater | undefined => {
  return theaters.find(theater => theater.id === id);
};

export const getMoviesByStatus = (status: 'now_showing' | 'coming_soon'): Movie[] => {
  return movies.filter(movie => movie.status === status);
};

export const filterMovies = (
  language?: string,
  genre?: string,
  format?: string
): Movie[] => {
  return movies.filter(movie => {
    if (language && movie.language !== language) return false;
    if (genre && !movie.genres.includes(genre)) return false;
    if (format && !movie.format.includes(format as '2D' | '3D' | 'Dolby Atmos')) return false;
    return true;
  });
};
