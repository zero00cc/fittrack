import { exercises } from '../data/exercises';
import { ExerciseCard } from '../components/exercise/ExerciseCard';

export function ExercisesPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Exercise Library</h1>
        <p className="text-sm text-gray-500 mt-1">
          Step-by-step guidance and video demonstrations for each exercise.
        </p>
      </div>

      {exercises.map((ex) => (
        <ExerciseCard key={ex.id} exercise={ex} />
      ))}
    </main>
  );
}
