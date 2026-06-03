import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { CalorieHistory, CalorieSettings, MealEntry } from '../types/calorie.types';
import { todayYMD, getLast90Days } from '../utils/dateUtils';

const HISTORY_KEY = 'fittrack_calorie_history';
const SETTINGS_KEY = 'fittrack_calorie_settings';

const defaultSettings: CalorieSettings = { dailyTarget: 2000 };
const defaultHistory: CalorieHistory = {};

export function useCalorieStore() {
  const [history, setHistory] = useLocalStorage<CalorieHistory>(HISTORY_KEY, defaultHistory);
  const [settings, setSettings] = useLocalStorage<CalorieSettings>(SETTINGS_KEY, defaultSettings);

  const today = todayYMD();
  const todayLog = history[today] ?? { date: today, entries: [], totalCalories: 0 };

  const addEntry = useCallback(
    (entry: MealEntry) => {
      const log = history[today] ?? { date: today, entries: [], totalCalories: 0 };
      const updatedEntries = [...log.entries, entry];
      const total = updatedEntries.reduce((s, e) => s + e.calories, 0);
      setHistory({
        ...history,
        [today]: { date: today, entries: updatedEntries, totalCalories: total },
      });
    },
    [history, setHistory, today],
  );

  const removeEntry = useCallback(
    (date: string, entryId: string) => {
      const log = history[date];
      if (!log) return;
      const updatedEntries = log.entries.filter((e) => e.id !== entryId);
      const total = updatedEntries.reduce((s, e) => s + e.calories, 0);
      setHistory({
        ...history,
        [date]: { date, entries: updatedEntries, totalCalories: total },
      });
    },
    [history, setHistory],
  );

  const setDailyTarget = useCallback(
    (kcal: number) => setSettings({ ...settings, dailyTarget: kcal }),
    [settings, setSettings],
  );

  const getLast90DaysData = useCallback(() => {
    return getLast90Days().map((date) => ({
      date,
      totalCalories: history[date]?.totalCalories ?? null,
    }));
  }, [history]);

  return { history, settings, todayLog, addEntry, removeEntry, setDailyTarget, getLast90DaysData };
}
