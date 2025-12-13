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
    poster: 'https://picsum.photos/seed/pushpa2/400/600',
    backdrop: 'https://picsum.photos/seed/pushpa2bg/1920/1080',
    trailerUrl: 'https://www.youtube.com/embed/Q1NKMPhP8PY',
    synopsis: 'Pushpa Raj returns with even more power and intensity as he continues his rise in the world of red sandalwood smuggling. Facing new enemies and bigger challenges, Pushpa must prove that he truly rules.',
    duration: 180,
    releaseDate: '2024-12-05',
    rating: 8.5,
    userRating: 4.3,
    totalRatings: 125000,
    language: 'Telugu',
    genres: ['Action', 'Drama', 'Thriller'],
    format: ['2D', '3D', 'IMAX'],
    certification: 'UA',
    status: 'now_showing',
    cast: [
      { id: '1', name: 'Allu Arjun', role: 'Pushpa Raj', image: 'https://picsum.photos/seed/allu/200/200' },
      { id: '2', name: 'Rashmika Mandanna', role: 'Srivalli', image: 'https://picsum.photos/seed/rashmika/200/200' },
      { id: '3', name: 'Fahadh Faasil', role: 'Bhanwar Singh Shekhawat', image: 'https://picsum.photos/seed/fahadh/200/200' },
    ],
    crew: [
      { id: '1', name: 'Sukumar', role: 'Director', image: 'https://picsum.photos/seed/sukumar/200/200' },
      { id: '2', name: 'Devi Sri Prasad', role: 'Music Director', image: 'https://picsum.photos/seed/dsp/200/200' },
    ],
  },
  {
    id: '2',
    title: 'Dune: Part Two',
    poster: 'https://picsum.photos/seed/dune2/400/600',
    backdrop: 'https://picsum.photos/seed/dune2bg/1920/1080',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe.',
    duration: 166,
    releaseDate: '2024-03-01',
    rating: 8.8,
    userRating: 4.5,
    totalRatings: 250000,
    language: 'English',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    format: ['2D', '3D', 'IMAX'],
    certification: 'UA',
    status: 'now_showing',
    cast: [
      { id: '4', name: 'Timothée Chalamet', role: 'Paul Atreides', image: 'https://picsum.photos/seed/timothee/200/200' },
      { id: '5', name: 'Zendaya', role: 'Chani', image: 'https://picsum.photos/seed/zendaya/200/200' },
      { id: '6', name: 'Rebecca Ferguson', role: 'Lady Jessica', image: 'https://picsum.photos/seed/rebecca/200/200' },
    ],
    crew: [
      { id: '3', name: 'Denis Villeneuve', role: 'Director', image: 'https://picsum.photos/seed/denis/200/200' },
      { id: '4', name: 'Hans Zimmer', role: 'Music Director', image: 'https://picsum.photos/seed/hans/200/200' },
    ],
  },
  {
    id: '3',
    title: 'Kalki 2898 AD',
    poster: 'https://picsum.photos/seed/kalki/400/600',
    backdrop: 'https://picsum.photos/seed/kalkibg/1920/1080',
    trailerUrl: 'https://www.youtube.com/embed/pmddGTuVwLI',
    synopsis: 'Set in a dystopian future in the year 2898 AD, the epic mythological sci-fi film follows the story of a mysterious warrior who embarks on a journey to save the world.',
    duration: 181,
    releaseDate: '2024-06-27',
    rating: 8.2,
    userRating: 4.1,
    totalRatings: 180000,
    language: 'Telugu',
    genres: ['Sci-Fi', 'Action', 'Fantasy'],
    format: ['2D', '3D', 'IMAX'],
    certification: 'UA',
    status: 'now_showing',
    cast: [
      { id: '7', name: 'Prabhas', role: 'Bhairava', image: 'https://picsum.photos/seed/prabhas/200/200' },
      { id: '8', name: 'Deepika Padukone', role: 'SUM-80', image: 'https://picsum.photos/seed/deepika/200/200' },
      { id: '9', name: 'Amitabh Bachchan', role: 'Ashwatthama', image: 'https://picsum.photos/seed/amitabh/200/200' },
    ],
    crew: [
      { id: '5', name: 'Nag Ashwin', role: 'Director', image: 'https://picsum.photos/seed/nagashwin/200/200' },
      { id: '6', name: 'Santhosh Narayanan', role: 'Music Director', image: 'https://picsum.photos/seed/santhosh/200/200' },
    ],
  },
  {
    id: '4',
    title: 'Deadpool & Wolverine',
    poster: 'https://picsum.photos/seed/deadpool/400/600',
    backdrop: 'https://picsum.photos/seed/deadpoolbg/1920/1080',
    trailerUrl: 'https://www.youtube.com/embed/73_1biulkYk',
    synopsis: 'Deadpool is offered a place in the Marvel Cinematic Universe by the TVA. But instead, he recruits a variant of Wolverine to save his universe from extinction.',
    duration: 127,
    releaseDate: '2024-07-26',
    rating: 8.0,
    userRating: 4.2,
    totalRatings: 320000,
    language: 'English',
    genres: ['Action', 'Comedy', 'Superhero'],
    format: ['2D', '3D', 'IMAX'],
    certification: 'A',
    status: 'now_showing',
    cast: [
      { id: '10', name: 'Ryan Reynolds', role: 'Deadpool', image: 'https://picsum.photos/seed/ryan/200/200' },
      { id: '11', name: 'Hugh Jackman', role: 'Wolverine', image: 'https://picsum.photos/seed/hugh/200/200' },
    ],
    crew: [
      { id: '7', name: 'Shawn Levy', role: 'Director', image: 'https://picsum.photos/seed/shawn/200/200' },
    ],
  },
  {
    id: '5',
    title: 'Stree 2',
    poster: 'https://picsum.photos/seed/stree2/400/600',
    backdrop: 'https://picsum.photos/seed/stree2bg/1920/1080',
    trailerUrl: 'https://www.youtube.com/embed/KxB25_1O7Hs',
    synopsis: 'The residents of Chanderi face a new threat when a headless entity called Sarkata begins terrorizing the town. Vicky and his friends must once again seek Stree\'s help.',
    duration: 150,
    releaseDate: '2024-08-15',
    rating: 7.8,
    userRating: 4.0,
    totalRatings: 95000,
    language: 'Hindi',
    genres: ['Horror', 'Comedy'],
    format: ['2D'],
    certification: 'UA',
    status: 'now_showing',
    cast: [
      { id: '12', name: 'Rajkummar Rao', role: 'Vicky', image: 'https://picsum.photos/seed/rajkummar/200/200' },
      { id: '13', name: 'Shraddha Kapoor', role: 'Stree', image: 'https://picsum.photos/seed/shraddha/200/200' },
    ],
    crew: [
      { id: '8', name: 'Amar Kaushik', role: 'Director', image: 'https://picsum.photos/seed/amar/200/200' },
    ],
  },
  {
    id: '6',
    title: 'Singham Again',
    poster: 'https://picsum.photos/seed/singham/400/600',
    backdrop: 'https://picsum.photos/seed/singhambg/1920/1080',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    synopsis: 'Bajirao Singham returns for another action-packed adventure. When his wife is kidnapped, Singham must face his biggest challenge yet in a battle against an international crime syndicate.',
    duration: 165,
    releaseDate: '2024-11-01',
    rating: 7.5,
    userRating: 3.9,
    totalRatings: 75000,
    language: 'Hindi',
    genres: ['Action', 'Drama'],
    format: ['2D', 'IMAX'],
    certification: 'UA',
    status: 'now_showing',
    cast: [
      { id: '14', name: 'Ajay Devgn', role: 'Bajirao Singham', image: 'https://picsum.photos/seed/ajay/200/200' },
      { id: '15', name: 'Kareena Kapoor Khan', role: 'Avni Singham', image: 'https://picsum.photos/seed/kareena/200/200' },
    ],
    crew: [
      { id: '9', name: 'Rohit Shetty', role: 'Director', image: 'https://picsum.photos/seed/rohit/200/200' },
    ],
  },
  {
    id: '7',
    title: 'Avatar 3',
    poster: 'https://picsum.photos/seed/avatar3/400/600',
    backdrop: 'https://picsum.photos/seed/avatar3bg/1920/1080',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    synopsis: 'Jake Sully and Neytiri return in the next chapter of the Avatar saga. The Sully family faces new challenges as they explore uncharted territories of Pandora.',
    duration: 190,
    releaseDate: '2025-12-19',
    rating: 0,
    userRating: 0,
    totalRatings: 0,
    language: 'English',
    genres: ['Sci-Fi', 'Adventure', 'Fantasy'],
    format: ['3D', 'IMAX'],
    certification: 'UA',
    status: 'coming_soon',
    cast: [
      { id: '16', name: 'Sam Worthington', role: 'Jake Sully', image: 'https://picsum.photos/seed/sam/200/200' },
      { id: '17', name: 'Zoe Saldana', role: 'Neytiri', image: 'https://picsum.photos/seed/zoe/200/200' },
    ],
    crew: [
      { id: '10', name: 'James Cameron', role: 'Director', image: 'https://picsum.photos/seed/james/200/200' },
    ],
  },
  {
    id: '8',
    title: 'The Batman 2',
    poster: 'https://picsum.photos/seed/batman2/400/600',
    backdrop: 'https://picsum.photos/seed/batman2bg/1920/1080',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    synopsis: 'The Dark Knight returns to face new threats in Gotham City. As new villains emerge, Batman must confront his past while protecting the city he loves.',
    duration: 175,
    releaseDate: '2025-10-03',
    rating: 0,
    userRating: 0,
    totalRatings: 0,
    language: 'English',
    genres: ['Action', 'Crime', 'Drama'],
    format: ['2D', 'IMAX'],
    certification: 'UA',
    status: 'coming_soon',
    cast: [
      { id: '18', name: 'Robert Pattinson', role: 'Bruce Wayne / Batman', image: 'https://picsum.photos/seed/robert/200/200' },
    ],
    crew: [
      { id: '11', name: 'Matt Reeves', role: 'Director', image: 'https://picsum.photos/seed/matt/200/200' },
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

export const generateShowtimes = (movieId: string, date: string): Showtime[] => {
  const times = ['09:30', '12:45', '16:00', '19:15', '22:30'];
  const formats: ('2D' | '3D' | 'IMAX')[] = ['2D', '3D', 'IMAX'];
  const showtimes: Showtime[] = [];

  theaters.forEach((theater) => {
    times.forEach((time, index) => {
      const format = formats[index % formats.length];
      showtimes.push({
        id: `${movieId}-${theater.id}-${date}-${time}`,
        movieId,
        theaterId: theater.id,
        time,
        date,
        format,
        language: 'Hindi',
        price: {
          standard: format === 'IMAX' ? 450 : format === '3D' ? 350 : 250,
          premium: format === 'IMAX' ? 550 : format === '3D' ? 450 : 350,
          recliner: format === 'IMAX' ? 750 : format === '3D' ? 650 : 550,
          vip: format === 'IMAX' ? 1200 : format === '3D' ? 1000 : 850,
        },
        availableSeats: Math.floor(Math.random() * 100) + 50,
        totalSeats: 200,
      });
    });
  });

  return showtimes;
};

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
    comment: 'Denis Villeneuve has created a masterpiece. The visuals in IMAX are breathtaking!',
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
    if (format && !movie.format.includes(format as '2D' | '3D' | 'IMAX')) return false;
    return true;
  });
};
