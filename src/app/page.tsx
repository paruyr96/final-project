import Image from 'next/image';
import Link from 'next/link';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const GENRES = [
  { id: '28', name: 'Action' },
  { id: '12', name: 'Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' },
  { id: '10751', name: 'Family' },
  { id: '14', name: 'Fantasy' },
  { id: '36', name: 'History' },
  { id: '27', name: 'Horror' },
  { id: '10402', name: 'Music' },
  { id: '9648', name: 'Mystery' },
  { id: '10749', name: 'Romance' },
  { id: '878', name: 'Science Fiction' },
  { id: '10770', name: 'TV Movie' },
  { id: '53', name: 'Thriller' },
  { id: '10752', name: 'War' },
  { id: '37', name: 'Western' },
];

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average?: number;
}

async function getMovies(page = 1, query = '', genre = '') {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error('TMDB_API_KEY is not found');
  }

  let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`;

  if (query.trim()) {
    url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`;
  } else if (genre) {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&with_genres=${genre}&page=${page}`;
  }

  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

async function getTopRatedMovies(): Promise<Movie[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return [];

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`,
    { cache: 'no-store' }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

async function getUpcomingMovies(): Promise<Movie[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return [];

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`,
    { cache: 'no-store' }
  );

  if (!res.ok) return [];

  const data = await res.json();
  return (data.results || []).filter((movie: Movie) =>
    movie.release_date?.startsWith('2026')
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; genre?: string }>;
}) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.search || '';
  const currentGenre = resolvedParams.genre || '';
  const currentPage = Number(resolvedParams.page) || 1;

  const [data, topRatedMovies, upcoming2026] = await Promise.all([
    getMovies(currentPage, searchQuery, currentGenre),
    getTopRatedMovies(),
    getUpcomingMovies(),
  ]);

  const selectedGenreObj = GENRES.find((g) => g.id === currentGenre);
  let pageTitle = 'Popular Movies';
  if (searchQuery) {
    pageTitle = `Search Results for: "${searchQuery}"`;
  } else if (selectedGenreObj) {
    pageTitle = `${selectedGenreObj.name} Movies`;
  }

  return (
    <main className="p-6 max-w-375 mx-auto min-h-screen text-white space-y-8">
      
      {/*  TOP RATED SLIDER */}
      {!searchQuery && !currentGenre && (
        <section className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
              <span>⭐ Top Rated Movies</span>
            </h2>
            <span className="text-xs text-gray-400">Scroll to explore →</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700">
            {topRatedMovies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="w-36 shrink-0 bg-gray-950 border border-gray-800 rounded-xl overflow-hidden hover:scale-105 transition duration-200 group"
              >
                <div className="h-48 relative bg-gray-800">
                  {movie.poster_path ? (
                    <Image
                      src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                  {movie.vote_average && (
                    <span className="absolute top-2 right-2 bg-black/80 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                      ⭐ {movie.vote_average.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <h3 className="font-semibold text-xs text-white group-hover:text-yellow-400 transition line-clamp-1">
                    {movie.title}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1">{movie.release_date}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      
      <div className="flex flex-col lg:flex-row gap-8">
        
        
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sticky top-20">
            <h2 className="text-lg font-bold mb-4 text-gray-200 flex items-center justify-between">
              <span>🎭 Genres</span>
              {currentGenre && (
                <Link
                  href="/"
                  className="text-xs text-blue-400 hover:underline font-normal"
                >
                  Clear filter
                </Link>
              )}
            </h2>

            <div className="flex flex-wrap lg:flex-col gap-1.5 max-h-[60vh] lg:max-h-[calc(100vh-180px)] overflow-y-auto pr-1 text-sm scrollbar-thin">
              {GENRES.map((g) => {
                const isActive = currentGenre === g.id;
                return (
                  <Link
                    key={g.id}
                    href={`/?genre=${g.id}`}
                    className={`px-3 py-2 rounded-xl transition text-xs sm:text-sm font-medium flex items-center justify-between ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                        : 'bg-gray-950/60 lg:bg-transparent text-gray-400 hover:text-white hover:bg-gray-800/80 border border-gray-800 lg:border-none'
                    }`}
                  >
                    <span>{g.name}</span>
                    {isActive && <span className="text-xs">✓</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6 capitalize">
            {pageTitle}
          </h1>

          {data.results.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-lg">
              No movies found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {data.results.map((movie: Movie, index: number) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900 hover:scale-105 transition duration-200 group flex flex-col justify-between"
                >
                  {movie.poster_path ? (
                    <Image
                      src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                      alt={movie.title}
                      width={500}
                      height={750}
                      priority={index < 4}
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <div className="h-62.5 bg-gray-800 text-gray-400 flex items-center justify-center">
                      No Image
                    </div>
                  )}
                  <div className="p-3">
                    <h2 className="font-semibold text-sm text-white group-hover:text-blue-400 transition line-clamp-1">
                      {movie.title}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">{movie.release_date}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.total_pages > 1 && (
            <div className="flex justify-between items-center mt-8">
              {currentPage > 1 ? (
                <Link
                  href={
                    searchQuery
                      ? `/?search=${encodeURIComponent(searchQuery)}&page=${currentPage - 1}`
                      : currentGenre
                      ? `/?genre=${currentGenre}&page=${currentPage - 1}`
                      : `/?page=${currentPage - 1}`
                  }
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm"
                >
                  ← Previous Page
                </Link>
              ) : (
                <div />
              )}

              <span className="text-sm font-semibold text-gray-400">
                Page {currentPage} of {data.total_pages}
              </span>

              {currentPage < data.total_pages && (
                <Link
                  href={
                    searchQuery
                      ? `/?search=${encodeURIComponent(searchQuery)}&page=${currentPage + 1}`
                      : currentGenre
                      ? `/?genre=${currentGenre}&page=${currentPage + 1}`
                      : `/?page=${currentPage + 1}`
                  }
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm"
                >
                  Next Page →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* SIDEBAR: Upcoming 2026 */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sticky top-20">
            <h2 className="text-lg font-bold mb-4 text-blue-400 flex items-center justify-between">
              <span>📅 Upcoming (2026)</span>
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full border border-blue-500/30">
                {upcoming2026.length}
              </span>
            </h2>

            {upcoming2026.length === 0 ? (
              <p className="text-gray-400 text-sm">No upcoming movies found for 2026.</p>
            ) : (
              <div className="flex flex-col gap-3 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
                {upcoming2026.map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/movie/${movie.id}`}
                    className="flex gap-3 bg-gray-950 p-2 rounded-xl border border-gray-800 hover:border-blue-500/50 transition group"
                  >
                    <div className="w-14 h-18 relative shrink-0 rounded-lg overflow-hidden bg-gray-800">
                      {movie.poster_path ? (
                        <Image
                          src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                          alt={movie.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">
                          No Pic
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-semibold text-xs text-white group-hover:text-blue-400 transition line-clamp-2">
                        {movie.title}
                      </h3>
                      <span className="text-[11px] text-blue-400 font-medium mt-1">
                        🗓️ {movie.release_date}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>

      </div>
    </main>
  );
}