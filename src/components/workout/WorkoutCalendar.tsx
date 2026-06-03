import { useState } from 'react';
import { WorkoutPlan, PlanProgress, DayStatus, WorkoutDay } from '../../types/workout.types';
import { addDays, toYMD } from '../../utils/dateUtils';
import { DayDetail } from './DayDetail';
import clsx from 'clsx';

interface Props {
  plan: WorkoutPlan;
  progress: PlanProgress;
  onUpdateStatus: (dayNumber: number, status: DayStatus) => void;
}

function cellBg(day: WorkoutDay, status: DayStatus, isToday: boolean, isFuture: boolean): string {
  if (day.isRestDay) return 'bg-white border-gray-100 text-gray-300';
  if (isFuture) return 'bg-gray-50 border-gray-100 text-gray-400';
  switch (status) {
    case 'finished': return 'bg-green-100 border-green-300 text-green-800';
    case 'skipped': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    default: return isToday
      ? 'bg-emerald-50 border-emerald-400 text-gray-700 font-semibold'
      : 'bg-gray-100 border-gray-200 text-gray-600';
  }
}

export function WorkoutCalendar({ plan, progress, onUpdateStatus }: Props) {
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const today = toYMD(new Date());

  const weeks: WorkoutDay[][] = [];
  for (let w = 0; w < plan.durationWeeks; w++) {
    weeks.push(plan.days.slice(w * 7, w * 7 + 7));
  }

  function getAbsoluteDate(dayNumber: number): string {
    return addDays(progress.startDate, dayNumber - 1);
  }

  const selectedStatus: DayStatus = selectedDay
    ? (progress.dayStatus[selectedDay.dayNumber] ?? 'unfinished')
    : 'unfinished';

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-700">Training Calendar</h3>

      <div className="flex flex-col gap-2">
        {weeks.map((week, wi) => (
          <div key={wi}>
            <div className="text-xs text-gray-400 mb-1">Week {wi + 1}</div>
            <div className="grid grid-cols-7 gap-1">
              {week.map((day) => {
                const absDate = getAbsoluteDate(day.dayNumber);
                const isFuture = absDate > today;
                const isToday = absDate === today;
                const status: DayStatus = progress.dayStatus[day.dayNumber] ?? 'unfinished';

                return (
                  <button
                    key={day.dayNumber}
                    onClick={() => !day.isRestDay && setSelectedDay(day)}
                    disabled={day.isRestDay}
                    title={day.isRestDay ? 'Rest' : day.label}
                    className={clsx(
                      'rounded-lg border text-xs py-2 px-1 text-center transition-all',
                      cellBg(day, status, isToday, isFuture),
                      !day.isRestDay && 'cursor-pointer hover:opacity-80 active:scale-95',
                      day.isRestDay && 'cursor-default',
                      isToday && !day.isRestDay && 'ring-2 ring-emerald-400',
                    )}
                  >
                    <div className="text-[10px] leading-tight">
                      {day.isRestDay ? 'Rest' : `D${day.dayNumber}`}
                    </div>
                    {!day.isRestDay && (
                      <div className="mt-0.5">
                        {status === 'finished' && '✓'}
                        {status === 'skipped' && '–'}
                        {status === 'unfinished' && (isFuture ? '·' : '○')}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedDay && (
        <DayDetail
          day={selectedDay}
          status={selectedStatus}
          onUpdateStatus={(s) => onUpdateStatus(selectedDay.dayNumber, s)}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}
