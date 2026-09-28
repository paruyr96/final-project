import Image from 'next/image';
import Link from 'next/link';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

// Ֆունկցիան ստուգում է՝ եթե query (որոնման տեքստ) կա, կանչում է search endpoint-ը, հակառակ դեպքում՝ category-ն
async function getMovies(category = 'upcoming', page = 1, query = '') {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error('TMDB_API_KEY-ը գտնված չէ .env.local ֆայլում');
  }

  // Եթե օգտատերը որոնում է կատարել, օգտագործում ենք search endpoint-ը
  const url = query.trim()
    ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`
    : `https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}&language=en-US&page=${page}`;

  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.search || '';
  const currentCategory = resolvedParams.category || 'upcoming';
  const currentPage = Number(resolvedParams.page) || 1;

  const data = await getMovies(currentCategory, currentPage, searchQuery);

  return (
    <main className="p-8">
      {/* Վերնագիրը փոխվում է՝ ըստ որոնման կամ կատեգորիայի */}
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {searchQuery ? `Search Results for: "${searchQuery}"` : `${currentCategory.replace('_', ' ')} Movies`}
      </h1>

      {/* Ֆիլտրերի կոճակներ (ցուցադրվում են միայն երբ որոնում չկա) */}
      {!searchQuery && (
        <div className="flex gap-4 mb-6">
          <Link
            href="/?category=popular"
            className={`px-4 py-2 rounded text-white ${
              currentCategory === 'popular' ? 'bg-blue-600 font-bold' : 'bg-gray-700'
            }`}
          >
            Popular
          </Link>
          <Link
            href="/?category=top_rated"
            className={`px-4 py-2 rounded text-white ${
              currentCategory === 'top_rated' ? 'bg-blue-600 font-bold' : 'bg-gray-700'
            }`}
          >
            Top Rated
          </Link>
          <Link
            href="/?category=now_playing"
            className={`px-4 py-2 rounded text-white ${
              currentCategory === 'now_playing' ? 'bg-blue-600 font-bold' : 'bg-gray-700'
            }`}
          >
            Now Playing
          </Link>
          <Link
            href="/?category=upcoming"
            className={`px-4 py-2 rounded text-white ${
              currentCategory === 'upcoming' ? 'bg-blue-600 font-bold' : 'bg-gray-700'
            }`}
          >
            Upcoming
          </Link>
        </div>
      )}

      {/* Եթե որոնման արդյունք չկա */}
      {data.results.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-xl">
          No movies found.
        </div>
      ) : (
        /* Ֆիլմերի ցանցը */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {data.results.map((movie: Movie) => (
            <div key={movie.id} className="border rounded-lg overflow-hidden shadow">
              {movie.poster_path ? (
                <Image
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="h-[375px] bg-gray-800 text-gray-400 flex items-center justify-center">
                  No Image
                </div>
              )}
              <div className="p-4">
                <h2 className="font-semibold text-lg">{movie.title}</h2>
                <p className="text-sm text-gray-500">{movie.release_date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination (Էջադրում) */}
      {data.total_pages > 1 && (
        <div className="flex justify-between items-center mt-8">
          {currentPage > 1 ? (
            <Link
              href={
                searchQuery
                  ? `/?search=${encodeURIComponent(searchQuery)}&page=${currentPage - 1}`
                  : `/?category=${currentCategory}&page=${currentPage - 1}`
              }
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              ← Previous Page
            </Link>
          ) : (
            <div />
          )}

          <span className="font-semibold">
            Page {currentPage} of {data.total_pages}
          </span>

          {currentPage < data.total_pages && (
            <Link
              href={
                searchQuery
                  ? `/?search=${encodeURIComponent(searchQuery)}&page=${currentPage + 1}`
                  : `/?category=${currentCategory}&page=${currentPage + 1}`
              }
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Next Page →
            </Link>
          )}
        </div>
      )}
    </main>
  );
}