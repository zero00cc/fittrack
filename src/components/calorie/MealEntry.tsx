import { useState } from 'react';
import { FoodItem } from '../../types/calorie.types';
import { FoodSelector } from './FoodSelector';
import { calcEntryCalories, buildMealEntry } from '../../utils/calorieUtils';

interface Props {
  onAdd: (entry: ReturnType<typeof buildMealEntry>) => void;
}

export function MealEntry({ onAdd }: Props) {
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [grams, setGrams] = useState<number>(100);

  const preview = selectedFood ? calcEntryCalories(selectedFood, grams) : 0;

  function handleAdd() {
    if (!selectedFood || grams <= 0) return;
    onAdd(buildMealEntry(selectedFood, grams));
    setGrams(100);
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-700">Add Food Entry</h3>
      <FoodSelector selected={selectedFood} onSelect={setSelectedFood} />
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600 whitespace-nowrap">Weight (g)</label>
        <input
          type="number"
          min={1}
          max={5000}
          value={grams}
          onChange={(e) => setGrams(Math.max(1, Number(e.target.value)))}
          className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {selectedFood && (
          <span className="text-sm text-emerald-700 font-medium">= {preview} kcal</span>
        )}
        <button
          onClick={handleAdd}
          disabled={!selectedFood || grams <= 0}
          className="ml-auto px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
