import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CalorieHistory } from '../../types/calorie.types';
import { toYMD } from '../../utils/dateUtils';
import { getCalorieStatus, statusColor } from '../../utils/calorieUtils';

interface Props {
  history: CalorieHistory;
  target: number;
}

export function CalorieCalendar({ history, target }: Props) {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Calorie Calendar (Last 3 Months)</h3>
      <div className="flex gap-4 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>Normal</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>Above</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>Below</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-gray-200"></span>No data</span>
      </div>
      <div className="calorie-calendar">
        <Calendar
          minDate={threeMonthsAgo}
          maxDate={new Date()}
          tileContent={({ date, view }) => {
            if (view !== 'month') return null;
            const dateStr = toYMD(date);
            const log = history[dateStr];
            if (!log || log.totalCalories === 0) {
              return <span className="block w-1.5 h-1.5 rounded-full bg-gray-200 mx-auto mt-0.5" />;
            }
            const status = getCalorieStatus(log.totalCalories, target);
            return (
              <span
                className="block w-1.5 h-1.5 rounded-full mx-auto mt-0.5"
                style={{ backgroundColor: statusColor(status) }}
                title={`${log.totalCalories} kcal`}
              />
            );
          }}
          className="border-none w-full"
        />
      </div>
    </div>
  );
}
