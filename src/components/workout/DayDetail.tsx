import { WorkoutDay, DayStatus } from '../../types/workout.types';
import { ExerciseCard } from './ExerciseCard';
import { Badge } from '../common/Badge';

interface Props {
  day: WorkoutDay;
  status: DayStatus;
  onUpdateStatus: (status: DayStatus) => void;
  onClose: () => void;
}

export function DayDetail({ day, status, onUpdateStatus, onClose }: Props) {
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
              {day.exercises.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-gray-100">
          <button
            onClick={() => { onUpdateStatus('finished'); onClose(); }}
            className="flex-1 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors"
          >
            Mark Finished
          </button>
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
