import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, Cell, ResponsiveContainer,
} from 'recharts';
import { CalorieHistory } from '../../types/calorie.types';
import { getLast30Days, formatShortDate } from '../../utils/dateUtils';
import { getCalorieStatus, statusColor } from '../../utils/calorieUtils';

interface Props {
  history: CalorieHistory;
  target: number;
}

export function CalorieBarChart({ history, target }: Props) {
  const data = getLast30Days().map((date) => ({
    date,
    label: formatShortDate(date),
    calories: history[date]?.totalCalories ?? 0,
  }));

  const hasData = data.some((d) => d.calories > 0);

  if (!hasData) {
    return (
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Last 30 Days</h3>
        <p className="text-sm text-gray-400 italic text-center py-8">No data yet. Start logging meals to see your chart.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Last 30 Days</h3>
      <div className="flex gap-4 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>Normal</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>Above target</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>Below target</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10 }}
            interval={4}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(value: number) => [`${value} kcal`, 'Calories']}
            labelFormatter={(label) => label}
          />
          <ReferenceLine y={target} stroke="#6b7280" strokeDasharray="4 2" label={{ value: 'Target', fontSize: 10, fill: '#6b7280' }} />
          <Bar dataKey="calories" radius={[3, 3, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.date}
                fill={entry.calories === 0 ? '#e5e7eb' : statusColor(getCalorieStatus(entry.calories, target))}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
