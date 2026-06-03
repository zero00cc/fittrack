import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">Welcome to FitTrack</h1>
        <p className="text-gray-500 mt-3 text-lg">Track your nutrition and train with purpose.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link
          to="/calories"
          className="flex flex-col items-start gap-3 rounded-2xl bg-white border-2 border-emerald-200 p-6 shadow hover:shadow-md hover:border-emerald-400 transition-all group"
        >
          <div className="text-4xl">🥗</div>
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
            Calorie Tracker
          </h2>
          <p className="text-sm text-gray-500">
            Log your meals, track daily intake, and visualize your nutrition over the last 3 months.
          </p>
          <span className="mt-auto text-sm font-semibold text-emerald-600">Open Tracker →</span>
        </Link>

        <Link
          to="/workouts"
          className="flex flex-col items-start gap-3 rounded-2xl bg-white border-2 border-blue-200 p-6 shadow hover:shadow-md hover:border-blue-400 transition-all group"
        >
          <div className="text-4xl">🏋️</div>
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            Workout Plans
          </h2>
          <p className="text-sm text-gray-500">
            Choose a structured training plan by level, follow daily workouts, and track your progress.
          </p>
          <span className="mt-auto text-sm font-semibold text-blue-600">Open Plans →</span>
        </Link>
      </div>
    </div>
  );
}
