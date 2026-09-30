import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 text-gray-400 mt-16">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* 1. Լոգո և Նկարագրություն */}
          <div className="space-y-3">
            <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
              🎬 <span className="text-blue-500">Movie</span>App
            </Link>
            <p className="text-sm text-gray-400">
              Discover the latest upcoming movies, top-rated cinema classics, and popular releases instantly.
            </p>
          </div>

          {/* 2. Արագ Նավիգացիա */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/?category=popular" className="hover:text-blue-400 transition">
                  Popular Movies
                </Link>
              </li>
              <li>
                <Link href="/?category=top_rated" className="hover:text-blue-400 transition">
                  Top Rated Movies
                </Link>
              </li>
              <li>
                <Link href="/?category=now_playing" className="hover:text-blue-400 transition">
                  Now Playing
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Popular Genres (Արդեն ճշգրիտ URL-ներով) */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Popular Genres
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/?genre=28" className="hover:text-blue-400 transition">
                  Action
                </Link>
              </li>
              <li>
                <Link href="/?genre=35" className="hover:text-blue-400 transition">
                  Comedy
                </Link>
              </li>
              <li>
                <Link href="/?genre=18" className="hover:text-blue-400 transition">
                  Drama
                </Link>
              </li>
              <li>
                <Link href="/?genre=878" className="hover:text-blue-400 transition">
                  Sci-Fi
                </Link>
              </li>
              <li>
                <Link href="/?genre=27" className="hover:text-blue-400 transition">
                  Horror
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. TMDB Attribution */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Data Source
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs text-blue-400 hover:underline font-medium"
            >
              Visit TMDB →
            </a>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} MovieApp. Built with Next.js & Tailwind CSS.</p>
          
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}