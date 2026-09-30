import Image from 'next/image';
import Link from 'next/link';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
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
  genres: { id: number; name: string }[];
  videos?: {
    results: Video[];
  };
  credits?: {
    cast: Cast[];
  };
}

async function getMovieDetails(id: string): Promise<MovieDetails | null> {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error('TMDB_API_KEY-ը գտնված չէ .env.local ֆայլում');
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US&append_to_response=videos,credits`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  if (!movie) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
        <Link href="/" className="px-4 py-2 bg-blue-600 rounded text-sm hover:bg-blue-500">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const trailer = movie.videos?.results.find(
    (vid) => vid.site === 'YouTube' && vid.type === 'Trailer'
  ) || movie.videos?.results[0];

  const topCast = movie.credits?.cast.slice(0, 10) || [];

  return (
    <main className="min-h-screen text-white p-6 max-w-300 mx-auto space-y-10">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
        >
          ← Back to Movies
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-80 shrink-0 relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 shadow-xl">
        {movie.poster_path ? (
         <Image
           src={`${IMAGE_BASE_URL}${movie.poster_path}`}
           alt={movie.title}
           width={500}
           height={750}
           priority // 👈 Ավելացրու սա (սա ավտոմատ ավելացնում է loading="eager")
           className="w-full h-auto object-cover"
           />
         ) : (
         <div className="h-96 flex items-center justify-center text-gray-500">
             No Image
          </div>
      )}
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold">{movie.title}</h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2.5 py-1 rounded-md font-semibold">
              ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </span>
            <span>🗓️ {movie.release_date}</span>
            <span>⏱️ {movie.runtime} min</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {movie.genres.map((genre) => (
              <Link
                key={genre.id}
                href={`/?genre=${genre.id}`}
                className="bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white text-xs px-3 py-1 rounded-full border border-gray-700 transition"
              >
                {genre.name}
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <h2 className="text-lg font-semibold text-gray-200 mb-2">Overview</h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              {movie.overview || 'No overview available for this movie.'}
            </p>
          </div>
        </div>
      </div>

      {trailer ? (
        <section className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
            <span>🎬 Official Trailer</span>
          </h2>
          <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-800">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </section>
      ) : (
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 text-center text-gray-400 text-sm">
          No official trailer available.
        </div>
      )}

      {/* CAST WITH SIZES */}
      {topCast.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎭 Top Cast</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {topCast.map((person) => (
              <div
                key={person.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-3 flex flex-col items-center text-center group hover:border-gray-700 transition"
              >
                <div className="w-20 h-20 relative rounded-full overflow-hidden bg-gray-800 mb-3 border border-gray-700">
                  {person.profile_path ? (
                    <Image
                      src={`${IMAGE_BASE_URL}${person.profile_path}`}
                      alt={person.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                      No Pic
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-white group-hover:text-blue-400 transition line-clamp-1">
                  {person.name}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                  {person.character}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}