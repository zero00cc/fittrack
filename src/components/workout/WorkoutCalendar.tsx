import { useState } from 'react';
import { WorkoutPlan, PlanProgress, DayStatus, WorkoutDay } from '../../types/workout.types';
import { addDays, toYMD, getWeekMonday, getTrainingDates } from '../../utils/dateUtils';
import { DayDetail } from './DayDetail';
import clsx from 'clsx';

interface Props {
  plan: WorkoutPlan;
  progress: PlanProgress;
  onUpdateStatus: (dayNumber: number, status: DayStatus) => void;
}

// Display order Mon…Sun → JS dow values
const DOW_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function WorkoutCalendar({ plan, progress, onUpdateStatus }: Props) {
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const today = toYMD(new Date());

  // Fallback for any progress saved before the weeklySchedule field existed
  const schedule = progress.weeklySchedule ?? plan.defaultWeeklySchedule;
  const scheduleSet = new Set(schedule);

  // Map every training WorkoutDay (in order) to a real calendar date
  const trainingDays = plan.days.filter((d) => !d.isRestDay);
  const trainingDates = getTrainingDates(progress.startDate, schedule, trainingDays.length);
  // date string → WorkoutDay
  const dateToDay = new Map<string, WorkoutDay>(
    trainingDays.map((d, i) => [trainingDates[i], d]),
  );

  // Calendar range: from Monday of the first training week
  // through Sunday of the last training week
  const firstDate = trainingDates[0] ?? progress.startDate;
  const lastDate = trainingDates[trainingDates.length - 1] ?? progress.startDate;
  const calendarStart = getWeekMonday(firstDate);

  // Build week rows (one per plan week)
  const totalWeeks = Math.ceil(
    (new Date(lastDate + 'T00:00:00').getTime() -
      new Date(calendarStart + 'T00:00:00').getTime()) /
      (7 * 24 * 60 * 60 * 1000) + 1,
  );
  const numWeeks = Math.max(totalWeeks, plan.durationWeeks);

  const selectedStatus: DayStatus =
    selectedDay ? (progress.dayStatus[selectedDay.dayNumber] ?? 'unfinished') : 'unfinished';

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-700">Training Calendar</h3>

      {/* Day-of-week column headers */}
      <div className="grid grid-cols-7 gap-1">
        {DOW_LABELS.map((lbl, i) => (
          <div
            key={lbl}
            className={clsx(
              'text-center text-[10px] font-semibold pb-0.5',
              scheduleSet.has(DOW_ORDER[i]) ? 'text-emerald-600' : 'text-gray-300',
            )}
          >
            {lbl}
          </div>
        ))}
      </div>

      {/* Week rows */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: numWeeks }, (_, wi) => {
          const weekMonday = addDays(calendarStart, wi * 7);
          return (
            <div key={wi}>
              <div className="text-[10px] text-gray-400 mb-1">Week {wi + 1}</div>
              <div className="grid grid-cols-7 gap-1">
                {DOW_ORDER.map((dow, di) => {
                  const absDate = addDays(weekMonday, di);
                  const workoutDay = dateToDay.get(absDate);
                  const isTraining = workoutDay !== undefined;
                  const isScheduledDay = scheduleSet.has(dow);
                  const isFuture = absDate > today;
                  const isToday = absDate === today;
                  const status: DayStatus = workoutDay
                    ? (progress.dayStatus[workoutDay.dayNumber] ?? 'unfinished')
                    : 'unfinished';

                  // Date label (day-of-month)
                  const dayOfMonth = parseInt(absDate.slice(8), 10);

                  let cellStyle = '';
                  if (!isScheduledDay) {
                    cellStyle = 'bg-white border-gray-100 text-gray-300 cursor-default';
                  } else if (isTraining) {
                    if (status === 'finished') cellStyle = 'bg-green-100 border-green-300 text-green-800 cursor-pointer hover:opacity-80';
                    else if (status === 'skipped') cellStyle = 'bg-yellow-100 border-yellow-300 text-yellow-800 cursor-pointer hover:opacity-80';
                    else if (isFuture) cellStyle = 'bg-gray-50 border-gray-200 text-gray-400 cursor-pointer hover:opacity-80';
                    else cellStyle = 'bg-gray-100 border-gray-200 text-gray-700 cursor-pointer hover:opacity-80';
                  } else {
                    // Scheduled day but no training content (e.g. beyond plan end)
                    cellStyle = 'bg-gray-50 border-dashed border-gray-200 text-gray-300 cursor-default';
                  }

                  return (
                    <button
                      key={dow}
                      onClick={() => isTraining && !workoutDay.isRestDay && setSelectedDay(workoutDay)}
                      disabled={!isTraining}
                      title={workoutDay ? workoutDay.label : isScheduledDay ? 'Training day (no content)' : 'Rest'}
                      className={clsx(
                        'rounded-lg border text-xs py-1.5 px-1 text-center transition-all',
                        cellStyle,
                        isToday && isTraining && 'ring-2 ring-emerald-400',
                      )}
                    >
                      <div className="text-[10px] leading-tight font-medium">{dayOfMonth}</div>
                      {isTraining && (
                        <div className="mt-0.5 text-[9px]">
                          {status === 'finished' ? '✓' : status === 'skipped' ? '–' : isFuture ? '·' : '○'}
                        </div>
                      )}
                      {!isTraining && isScheduledDay && <div className="mt-0.5 text-[9px]">·</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-[10px] text-gray-400 pt-1 border-t border-gray-50">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-green-200 inline-block"></span>Finished</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-yellow-200 inline-block"></span>Skipped</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gray-100 border border-gray-200 inline-block"></span>Unfinished</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-white border border-gray-100 inline-block"></span>Rest</span>
        <span className="ml-auto text-emerald-600 font-medium">Highlighted column headers = your training days</span>
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
