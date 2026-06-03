import { Exercise } from '../../types/workout.types';

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-gray-800">{exercise.name}</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {exercise.sets} × {exercise.reps}
          </span>
        </div>
        {exercise.notes && <p className="text-xs text-gray-400 mt-0.5">{exercise.notes}</p>}
      </div>
      <a
        href={exercise.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        Watch
      </a>
    </div>
  );
}
