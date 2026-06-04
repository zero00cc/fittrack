import { WorkoutDay, DayStatus, Exercise } from '../../types/workout.types';
import { ExerciseCard } from './ExerciseCard';
import { Badge } from '../common/Badge';

interface Props {
  day: WorkoutDay;
  status: DayStatus;
  daySetProgress: { [key: string]: number }; // key = `${exerciseId}-${blockIndex}`
  onUpdateStatus: (status: DayStatus) => void;
  onUpdateSetProgress: (key: string, completedSets: number) => void;
  onClose: () => void;
}

function blockKey(exerciseId: string, blockIndex: number): string {
  return `${exerciseId}-${blockIndex}`;
}

function isExerciseDone(ex: Exercise, progress: { [key: string]: number }): boolean {
  if (ex.setBlocks) {
    return ex.setBlocks.every((block, i) => (progress[blockKey(ex.id, i)] ?? 0) >= block.sets);
  }
  return (progress[blockKey(ex.id, 0)] ?? 0) >= (ex.sets ?? 1);
}

export function DayDetail({ day, status, daySetProgress, onUpdateStatus, onUpdateSetProgress, onClose }: Props) {
  function handleBlockUpdate(exerciseId: string, blockIndex: number, newCount: number) {
    const key = blockKey(exerciseId, blockIndex);
    onUpdateSetProgress(key, newCount);

    if (day.exercises.length === 0) return;

    const updated = { ...daySetProgress, [key]: newCount };
    const allDone = day.exercises.every((ex) => isExerciseDone(ex, updated));

    if (allDone) {
      onUpdateStatus('finished');
    } else if (status === 'finished') {
      onUpdateStatus('unfinished');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-gray-800">{day.label}</span>
            <Badge status={status} />
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3">
          {day.exercises.length === 0 ? (
            <p className="text-sm text-gray-400 italic py-4">Rest day — no exercises scheduled.</p>
          ) : (
            <div className="flex flex-col">
              {day.exercises.map((ex) => {
                const blockProgress = ex.setBlocks
                  ? ex.setBlocks.map((_, i) => daySetProgress[blockKey(ex.id, i)] ?? 0)
                  : [daySetProgress[blockKey(ex.id, 0)] ?? 0];
                return (
                  <ExerciseCard
                    key={ex.id}
                    exercise={ex}
                    blockProgress={blockProgress}
                    onUpdateBlock={(blockIndex, n) => handleBlockUpdate(ex.id, blockIndex, n)}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-gray-100">
          <button
            onClick={() => { onUpdateStatus('skipped'); onClose(); }}
            className="flex-1 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-semibold transition-colors"
          >
            Skip
          </button>
          <button
            onClick={() => { onUpdateStatus('unfinished'); onClose(); }}
            className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
