import { DailyLog as DailyLogType } from '../../types/calorie.types';
import { getCalorieStatus } from '../../utils/calorieUtils';
import clsx from 'clsx';

interface Props {
  log: DailyLogType;
  target: number;
  onRemove: (entryId: string) => void;
}

const statusStyle = {
  above: 'text-red-600 bg-red-50 border-red-200',
  normal: 'text-green-700 bg-green-50 border-green-200',
  below: 'text-blue-700 bg-blue-50 border-blue-200',
};

const statusLabel = {
  above: 'Above target',
  normal: 'On track',
  below: 'Below target',
};

export function DailyLog({ log, target, onRemove }: Props) {
  const status = getCalorieStatus(log.totalCalories, target);

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Today's Log</h3>
        <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full border', statusStyle[status])}>
          {log.totalCalories} / {target} kcal — {statusLabel[status]}
        </span>
      </div>

      {log.entries.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No meals logged yet. Add your first entry above.</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
              <th className="pb-1 font-medium">Food</th>
              <th className="pb-1 font-medium text-right">Weight</th>
              <th className="pb-1 font-medium text-right">Calories</th>
              <th className="pb-1"></th>
            </tr>
          </thead>
          <tbody>
            {log.entries.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-100 last:border-0">
                <td className="py-1.5 text-gray-800">{entry.foodName}</td>
                <td className="py-1.5 text-right text-gray-500">{entry.weightGrams}g</td>
                <td className="py-1.5 text-right font-medium text-gray-700">{entry.calories} kcal</td>
                <td className="py-1.5 text-right">
                  <button
                    onClick={() => onRemove(entry.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors ml-2"
                    title="Remove"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-200">
              <td colSpan={2} className="pt-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</td>
              <td className="pt-2 text-right font-bold text-gray-800">{log.totalCalories} kcal</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}
