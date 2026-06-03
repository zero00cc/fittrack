import { useCalorieStore } from '../hooks/useCalorieStore';
import { TargetSlider } from '../components/calorie/TargetSlider';
import { MealEntry } from '../components/calorie/MealEntry';
import { DailyLog } from '../components/calorie/DailyLog';
import { CalorieBarChart } from '../components/calorie/CalorieBarChart';
import { CalorieCalendar } from '../components/calorie/CalorieCalendar';
import { CalorieTrendChart } from '../components/calorie/CalorieTrendChart';

export function CalorieTrackerPage() {
  const { history, settings, todayLog, addEntry, removeEntry, setDailyTarget, getLast90DaysData } = useCalorieStore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-gray-800">Calorie Tracker</h1>

      <TargetSlider value={settings.dailyTarget} onChange={setDailyTarget} />

      <MealEntry onAdd={addEntry} />

      <DailyLog
        log={todayLog}
        target={settings.dailyTarget}
        onRemove={(id) => removeEntry(todayLog.date, id)}
      />

      <CalorieBarChart history={history} target={settings.dailyTarget} />

      <CalorieCalendar history={history} target={settings.dailyTarget} />

      <CalorieTrendChart data={getLast90DaysData()} target={settings.dailyTarget} />
    </div>
  );
}
