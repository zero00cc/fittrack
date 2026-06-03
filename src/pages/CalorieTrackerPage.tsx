import { useState } from 'react';
import { useCalorieStore } from '../hooks/useCalorieStore';
import { TargetSlider } from '../components/calorie/TargetSlider';
import { MealEntry } from '../components/calorie/MealEntry';
import { DailyLog } from '../components/calorie/DailyLog';
import { CalorieBarChart } from '../components/calorie/CalorieBarChart';
import { CalorieCalendar } from '../components/calorie/CalorieCalendar';
import { CalorieTrendChart } from '../components/calorie/CalorieTrendChart';
import { SnapTrack } from '../components/calorie/SnapTrack';
import { MealEntry as MealEntryType } from '../types/calorie.types';

type InputMode = 'manual' | 'photo';

export function CalorieTrackerPage() {
  const { history, settings, todayLog, addEntry, removeEntry, setDailyTarget, getLast90DaysData } = useCalorieStore();
  const [inputMode, setInputMode] = useState<InputMode>('manual');

  function handleAddEntries(entries: MealEntryType[]) {
    entries.forEach(addEntry);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-gray-800">Calorie Tracker</h1>

      <TargetSlider value={settings.dailyTarget} onChange={setDailyTarget} />

      {/* Input mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setInputMode('manual')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            inputMode === 'manual'
              ? 'bg-emerald-500 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
          }`}
        >
          ✏️ Manual Entry
        </button>
        <button
          onClick={() => setInputMode('photo')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            inputMode === 'photo'
              ? 'bg-emerald-500 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
          }`}
        >
          📷 Photo Analysis
        </button>
      </div>

      {inputMode === 'manual' ? (
        <MealEntry onAdd={addEntry} />
      ) : (
        <SnapTrack onAddEntries={handleAddEntries} />
      )}

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
