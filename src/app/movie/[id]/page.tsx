import Image from 'next/image';
import Link from 'next/link';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

interface Genre {
  id: number;
  name: string;
}

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: Genre[];
  tagline: string;
}

// Ֆունկցիա՝ ըստ ID-ի ֆիլմի տվյալները ստանալու համար
async function getMovieDetails(id: string): Promise<MovieDetails> {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error('TMDB_API_KEY-ը գտնված չէ .env.local ֆայլում');
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch movie details');
  }

  return res.json();
}

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const movie = await getMovieDetails(resolvedParams.id);

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-12">
      {/* 1. Background Backdrop Image */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        {movie.backdrop_path ? (
          <Image
            src={`${BACKDROP_BASE_URL}${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover opacity-30"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
      </div>

      {/* 2. Movie Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-48 relative z-10 flex flex-col md:flex-row gap-8">
        {/* Poster Image */}
        <div className="w-64 md:w-80 flex-shrink-0 mx-auto md:mx-0 shadow-2xl rounded-xl overflow-hidden border border-gray-800">
          {movie.poster_path ? (
            <Image
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
              className="w-full h-auto object-cover"
            />
          ) : (
            <div className="h-[400px] bg-gray-800 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="flex-1 flex flex-col justify-end">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-blue-400 hover:underline mb-4"
          >
            ← Back to Movies
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-2">{movie.title}</h1>

          {movie.tagline && (
            <p className="text-gray-400 italic text-lg mb-4">"{movie.tagline}"</p>
          )}

          {/* Genres Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs px-3 py-1 rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Key Stats: Rating, Release Date, Runtime */}
          <div className="flex items-center gap-6 text-sm md:text-base text-gray-300 mb-6 bg-gray-900/80 p-4 rounded-xl border border-gray-800 w-fit">
            <div>
              <span className="text-gray-500 block text-xs">RATING</span>
              <span className="text-yellow-400 font-bold">
                ⭐ {movie.vote_average.toFixed(1)} / 10
              </span>
            </div>
            <div className="h-8 w-px bg-gray-800" />
            <div>
              <span className="text-gray-500 block text-xs">RELEASE DATE</span>
              <span className="font-semibold">{movie.release_date}</span>
            </div>
            <div className="h-8 w-px bg-gray-800" />
            <div>
              <span className="text-gray-500 block text-xs">RUNTIME</span>
              <span className="font-semibold">{movie.runtime} min</span>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-300 leading-relaxed text-base">
              {movie.overview || 'No overview available for this movie.'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}