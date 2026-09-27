// app/page.tsx
import Image from 'next/image';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

// Ֆունկցիան ստանում է page պարամետրը
async function getMovies(category = 'popular', page = 1) {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error('TMDB_API_KEY-ը գտնված չէ .env.local ֆայլում');
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}&language=en-US&page=${page}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;
  const currentCategory = resolvedParams.category || 'popular';

  const data = await getMovies(currentCategory, currentPage);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">{currentCategory.replace('_', ' ')} Movies</h1>

      {/* Ֆիլտրերի կոճակներ */}
      <div className="flex gap-4 mb-6">
        <a href="?category=popular" className="px-4 py-2 bg-blue-600 text-white rounded">Popular</a>
        <a href="?category=top_rated" className="px-4 py-2 bg-gray-700 text-white rounded">Top Rated</a>
        <a href="?category=now_playing" className="px-4 py-2 bg-gray-700 text-white rounded">Now Playing</a>
        <a href="?category=upcoming" className="px-4 py-2 bg-gray-700 text-white rounded">Upcoming</a>
      </div>

      {/* Ֆիլմերի ցանցը */}
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
              <div className="h-[375px] bg-gray-200 flex items-center justify-center">
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

      {/* Pagination (Էջադրում) */}
      <div className="flex justify-between items-center mt-8">
        {currentPage > 1 ? (
          <a
            href={`?category=${currentCategory}&page=${currentPage - 1}`}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            ← Previous Page
          </a>
        ) : <div />}
        
        <span className="font-semibold">Page {currentPage} of {data.total_pages}</span>

        {currentPage < data.total_pages && (
          <a
            href={`?category=${currentCategory}&page=${currentPage + 1}`}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Next Page →
          </a>
        )}
      </div>
    </main>
  );
}