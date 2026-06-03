import { useState } from 'react';
import { WorkoutPlan } from '../../types/workout.types';
import clsx from 'clsx';

interface Props {
  plan: WorkoutPlan;
  onConfirm: (weeklySchedule: number[]) => void;
  onBack: () => void;
}

// Display order: Mon … Sun.  value = JS Date.getDay()
const DAYS = [
  { label: 'Mon', dow: 1 },
  { label: 'Tue', dow: 2 },
  { label: 'Wed', dow: 3 },
  { label: 'Thu', dow: 4 },
  { label: 'Fri', dow: 5 },
  { label: 'Sat', dow: 6 },
  { label: 'Sun', dow: 0 },
];

export function SchedulePicker({ plan, onConfirm, onBack }: Props) {
  const [selected, setSelected] = useState<Set<number>>(
    new Set(plan.defaultWeeklySchedule),
  );

  const recommended = plan.defaultWeeklySchedule.length;
  const count = selected.size;
  const canStart = count >= 1;

  function toggle(dow: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(dow) ? next.delete(dow) : next.add(dow);
      return next;
    });
  }

  function handleConfirm() {
    const sorted = [...selected].sort((a, b) => {
      // Sort Mon-first: treat Sun(0) as 7
      const na = a === 0 ? 7 : a;
      const nb = b === 0 ? 7 : b;
      return na - nb;
    });
    onConfirm(sorted);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-emerald-600 hover:underline">← Back</button>
        <h2 className="text-xl font-bold text-gray-800">Set Training Days</h2>
      </div>

      <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-4">
        <div>
          <p className="text-sm text-gray-700 font-medium">{plan.name}</p>
          <p className="text-sm text-gray-500 mt-0.5">
            Recommended: <span className="font-semibold text-gray-700">{recommended} days / week</span>.
            Select the days that work for your schedule — you can change this by resetting the plan.
          </p>
        </div>

        {/* Day toggles */}
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map(({ label, dow }) => {
            const active = selected.has(dow);
            return (
              <button
                key={dow}
                onClick={() => toggle(dow)}
                className={clsx(
                  'flex flex-col items-center py-3 rounded-xl border-2 text-xs font-semibold transition-all select-none',
                  active
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-300',
                )}
              >
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Count indicator */}
        <div className="flex items-center gap-2 text-sm">
          <span
            className={clsx(
              'font-semibold',
              count === recommended ? 'text-emerald-600' : 'text-amber-600',
            )}
          >
            {count} day{count !== 1 ? 's' : ''} selected
          </span>
          <span className="text-gray-400">
            {count === recommended
              ? '— matches the recommended schedule'
              : `— recommended is ${recommended} days/week`}
          </span>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!canStart}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm transition-colors"
        >
          Confirm & Start Plan
        </button>
      </div>
    </div>
  );
}
