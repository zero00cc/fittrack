import { Exercise } from '../../types/workout.types';

interface Props {
  exercise: Exercise;
  blockProgress: number[]; // completedSets per block index (or single value for simple format)
  onUpdateBlock: (blockIndex: number, newCount: number) => void;
}

function fmt(val: number | null): string {
  return val === null ? '—' : String(val);
}

export function ExerciseCard({ exercise, blockProgress, onUpdateBlock }: Props) {
  const title = exercise.label ? `${exercise.label}. ${exercise.name}` : exercise.name;

  const isAllDone = exercise.setBlocks
    ? exercise.setBlocks.every((block, i) => (blockProgress[i] ?? 0) >= block.sets)
    : (blockProgress[0] ?? 0) >= (exercise.sets ?? 1);

  return (
    <div className={`py-2.5 border-b border-gray-100 last:border-0 transition-opacity ${isAllDone ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {isAllDone && <span className="text-emerald-500 text-sm leading-none">✓</span>}
            <span className={`font-medium text-sm ${isAllDone ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {title}
            </span>
          </div>
          {exercise.notes && <p className="text-xs text-gray-400 mt-0.5">{exercise.notes}</p>}

          {/* SetBlocks table with per-row controls */}
          {exercise.setBlocks && (
            <table className="mt-2 w-full text-xs border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="text-left font-medium pb-1 pr-2 w-8">Sets</th>
                  <th className="text-left font-medium pb-1 pr-2 w-8">Reps</th>
                  <th className="text-left font-medium pb-1 pr-2 w-8">RPE</th>
                  <th className="text-left font-medium pb-1 pr-2 w-8">Load</th>
                  <th className="pb-1"></th>
                </tr>
              </thead>
              <tbody>
                {exercise.setBlocks.map((block, i) => {
                  const completed = blockProgress[i] ?? 0;
                  const done = completed >= block.sets;
                  return (
                    <tr key={i} className={`border-b border-gray-50 last:border-0 ${done ? 'opacity-40' : ''}`}>
                      <td className="py-1 pr-2 text-gray-700">{block.sets}</td>
                      <td className="py-1 pr-2 text-gray-700">{fmt(block.reps)}</td>
                      <td className="py-1 pr-2 text-gray-500">{fmt(block.rpe)}</td>
                      <td className="py-1 pr-2 text-gray-500">{fmt(block.load)}</td>
                      <td className="py-1">
                        {block.sets === 1 ? (
                          <button
                            onClick={() => onUpdateBlock(i, done ? 0 : 1)}
                            title={done ? 'Mark undone' : 'Mark done'}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                              done
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-gray-300 text-gray-300 hover:border-emerald-400 hover:text-emerald-400'
                            }`}
                          >
                            ✓
                          </button>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onUpdateBlock(i, Math.max(0, completed - 1))}
                              disabled={completed === 0}
                              className="w-5 h-5 rounded-full border border-gray-300 text-gray-500 font-bold flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              −
                            </button>
                            <span className={`w-9 text-center font-semibold ${done ? 'text-emerald-600' : 'text-gray-600'}`}>
                              {completed}/{block.sets}
                            </span>
                            <button
                              onClick={() => onUpdateBlock(i, Math.min(block.sets, completed + 1))}
                              disabled={done}
                              className="w-5 h-5 rounded-full border border-gray-300 text-gray-500 font-bold flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Simple format fallback (no setBlocks) */}
          {!exercise.setBlocks && exercise.sets !== undefined && (
            <div className="flex items-center gap-2 mt-2">
              {(exercise.sets ?? 1) === 1 ? (
                <button
                  onClick={() => onUpdateBlock(0, isAllDone ? 0 : 1)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                    isAllDone
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-gray-300 text-gray-300 hover:border-emerald-400 hover:text-emerald-400'
                  }`}
                >
                  ✓
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onUpdateBlock(0, Math.max(0, (blockProgress[0] ?? 0) - 1))}
                    disabled={(blockProgress[0] ?? 0) === 0}
                    className="w-6 h-6 rounded-full border border-gray-300 text-gray-500 text-sm font-bold flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className={`text-xs font-semibold w-12 text-center ${isAllDone ? 'text-emerald-600' : 'text-gray-600'}`}>
                    {blockProgress[0] ?? 0} / {exercise.sets} sets
                  </span>
                  <button
                    onClick={() => onUpdateBlock(0, Math.min(exercise.sets ?? 1, (blockProgress[0] ?? 0) + 1))}
                    disabled={isAllDone}
                    className="w-6 h-6 rounded-full border border-gray-300 text-gray-500 text-sm font-bold flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </>
              )}
            </div>
          )}
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
