import { Exercise, SetBlock } from '../../types/workout.types';

function fmt(val: number | null): string {
  return val === null ? '—' : String(val);
}

function SetBlockTable({ blocks }: { blocks: SetBlock[] }) {
  return (
    <table className="mt-1.5 w-full text-xs border-collapse">
      <thead>
        <tr className="text-gray-400 border-b border-gray-100">
          <th className="text-left font-medium pb-1 pr-3">Sets</th>
          <th className="text-left font-medium pb-1 pr-3">Reps</th>
          <th className="text-left font-medium pb-1 pr-3">RPE</th>
          <th className="text-left font-medium pb-1">Load</th>
        </tr>
      </thead>
      <tbody>
        {blocks.map((b, i) => (
          <tr key={i} className="border-b border-gray-50 last:border-0">
            <td className="py-0.5 pr-3 text-gray-700">{b.sets}</td>
            <td className="py-0.5 pr-3 text-gray-700">{fmt(b.reps)}</td>
            <td className="py-0.5 pr-3 text-gray-500">{fmt(b.rpe)}</td>
            <td className="py-0.5 text-gray-500">{fmt(b.load)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const title = exercise.label ? `${exercise.label}. ${exercise.name}` : exercise.name;

  return (
    <div className="py-2.5 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-gray-800">{title}</span>
            {/* Simple format pill */}
            {!exercise.setBlocks && exercise.sets !== undefined && exercise.reps !== undefined && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {exercise.sets} × {exercise.reps}
              </span>
            )}
          </div>
          {exercise.notes && <p className="text-xs text-gray-400 mt-0.5">{exercise.notes}</p>}
          {/* Detailed format table */}
          {exercise.setBlocks && <SetBlockTable blocks={exercise.setBlocks} />}
        </div>

        <a
          href={exercise.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition-colors mt-0.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          Watch
        </a>
      </div>
    </div>
  );
}
