import { useState } from 'react';
import { FoodItem } from '../../types/calorie.types';
import { foods, foodCategories } from '../../data/foods';

interface Props {
  selected: FoodItem | null;
  onSelect: (food: FoodItem) => void;
}

const categoryLabel: Record<string, string> = {
  protein: 'Protein',
  dairy: 'Dairy',
  carb: 'Carbs',
  fruit: 'Fruit',
  fat: 'Fats & Oils',
  vegetable: 'Vegetables',
  other: 'Other',
};

export function FoodSelector({ selected, onSelect }: Props) {
  const [search, setSearch] = useState('');

  const filtered = search
    ? foods.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : foods;

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Search food..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      <select
        size={6}
        className="w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        value={selected?.id ?? ''}
        onChange={(e) => {
          const food = foods.find((f) => f.id === e.target.value);
          if (food) onSelect(food);
        }}
      >
        {search
          ? filtered.map((f) => (
              <option key={f.id} value={f.id} className="px-2 py-1">
                {f.name} — {f.caloriesPer100g} kcal/100g
              </option>
            ))
          : foodCategories.map((cat) => {
              const group = foods.filter((f) => f.category === cat);
              return (
                <optgroup key={cat} label={categoryLabel[cat]}>
                  {group.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} — {f.caloriesPer100g} kcal/100g
                    </option>
                  ))}
                </optgroup>
              );
            })}
      </select>
    </div>
  );
}
