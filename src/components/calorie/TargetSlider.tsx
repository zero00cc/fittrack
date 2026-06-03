interface Props {
  value: number;
  onChange: (v: number) => void;
}

export function TargetSlider({ value, onChange }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Daily Calorie Target</span>
        <span className="text-lg font-bold text-emerald-600">{value.toLocaleString()} kcal</span>
      </div>
      <input
        type="range"
        min={500}
        max={5000}
        step={50}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full accent-emerald-500 cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>500</span>
        <span>2,000</span>
        <span>5,000</span>
      </div>
    </div>
  );
}
