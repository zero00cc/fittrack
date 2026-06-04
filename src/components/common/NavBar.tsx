import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export function NavBar() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-6">
        <Link to="/" className="text-xl font-bold tracking-tight text-emerald-400 hover:text-emerald-300">
          FitTrack
        </Link>
        <Link
          to="/calories"
          className={clsx(
            'text-sm font-medium px-3 py-1.5 rounded-md transition-colors',
            pathname.startsWith('/calories')
              ? 'bg-emerald-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700',
          )}
        >
          Calorie Tracker
        </Link>
        <Link
          to="/workouts"
          className={clsx(
            'text-sm font-medium px-3 py-1.5 rounded-md transition-colors',
            pathname.startsWith('/workouts')
              ? 'bg-emerald-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700',
          )}
        >
          Workout Plans
        </Link>
        <Link
          to="/exercises"
          className={clsx(
            'text-sm font-medium px-3 py-1.5 rounded-md transition-colors',
            pathname.startsWith('/exercises')
              ? 'bg-emerald-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700',
          )}
        >
          Exercises
        </Link>
        <Link
          to="/gallery"
          className={clsx(
            'text-sm font-medium px-3 py-1.5 rounded-md transition-colors',
            pathname.startsWith('/gallery')
              ? 'bg-emerald-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700',
          )}
        >
          Gallery
        </Link>
      </div>
    </nav>
  );
}
