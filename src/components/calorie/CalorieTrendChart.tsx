import {
  ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { formatShortDate } from '../../utils/dateUtils';

interface DataPoint {
  date: string;
  totalCalories: number | null;
}

interface Props {
  data: DataPoint[];
  target: number;
}

export function CalorieTrendChart({ data, target }: Props) {
  const chartData = data.map((d) => ({
    label: formatShortDate(d.date),
    calories: d.totalCalories,
  }));

  const hasData = chartData.some((d) => d.calories !== null && d.calories > 0);

  if (!hasData) {
    return (
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">90-Day Trend</h3>
        <p className="text-sm text-gray-400 italic text-center py-8">No trend data yet. Log meals over multiple days to see your trend.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">90-Day Trend</h3>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={9} tickLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip formatter={(value: unknown) => [value != null ? `${value} kcal` : 'No data', 'Calories']} />
          <ReferenceLine y={target} stroke="#6b7280" strokeDasharray="4 2" label={{ value: 'Target', fontSize: 10, fill: '#6b7280' }} />
          <Line
            type="monotone"
            dataKey="calories"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
          <Scatter dataKey="calories" fill="#10b981" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
