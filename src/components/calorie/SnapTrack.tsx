import { useState, useRef, useCallback } from 'react';
import { FoodItem, MealEntry } from '../../types/calorie.types';
import { buildMealEntry, generateId } from '../../utils/calorieUtils';
import clsx from 'clsx';

interface AnalyzedItem {
  name: string;
  estimatedGrams: number;
  estimatedKcal: number;
}

interface EditableItem extends AnalyzedItem {
  uid: string;
  editedGrams: number;
  editedKcal: number;
}

interface Props {
  onAddEntries: (entries: MealEntry[]) => void;
}

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

function toSyntheticFood(item: AnalyzedItem): FoodItem {
  const caloriesPer100g = item.estimatedGrams > 0
    ? Math.round((item.estimatedKcal / item.estimatedGrams) * 100)
    : 100;
  return {
    id: `snap-${generateId()}`,
    name: item.name,
    caloriesPer100g,
    category: 'other',
  };
}

export function SnapTrack({ onAddEntries }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'results' | 'error'>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<EditableItem[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload an image file (JPEG, PNG, WebP, GIF).');
      setStatus('error');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setErrorMsg('Image is too large. Please use a file under 5 MB.');
      setStatus('error');
      return;
    }

    // Preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStatus('loading');
    setErrorMsg('');

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Strip data URL prefix to get raw base64
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType: file.type }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error ?? `Server error ${res.status}`);
      }

      const data = await res.json();
      const editableItems: EditableItem[] = (data.items as AnalyzedItem[]).map((item) => ({
        ...item,
        uid: generateId(),
        editedGrams: item.estimatedGrams,
        editedKcal: item.estimatedKcal,
      }));

      setItems(editableItems);
      setDescription(data.description ?? '');
      setStatus('results');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to analyze image.');
      setStatus('error');
    }
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  function updateGrams(uid: string, grams: number) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.uid !== uid) return item;
        const caloriesPer100g = item.estimatedGrams > 0
          ? item.estimatedKcal / item.estimatedGrams
          : 1;
        return { ...item, editedGrams: grams, editedKcal: Math.round(grams * caloriesPer100g) };
      }),
    );
  }

  function addItem(uid: string) {
    const item = items.find((i) => i.uid === uid);
    if (!item) return;
    const food = toSyntheticFood({ name: item.name, estimatedGrams: item.editedGrams, estimatedKcal: item.editedKcal });
    onAddEntries([buildMealEntry(food, item.editedGrams)]);
    setItems((prev) => prev.filter((i) => i.uid !== uid));
  }

  function addAll() {
    const entries = items.map((item) => {
      const food = toSyntheticFood({ name: item.name, estimatedGrams: item.editedGrams, estimatedKcal: item.editedKcal });
      return buildMealEntry(food, item.editedGrams);
    });
    onAddEntries(entries);
    reset();
  }

  function reset() {
    setStatus('idle');
    setPreviewUrl(null);
    setItems([]);
    setDescription('');
    setErrorMsg('');
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">📷 Analyze Food Photo</h3>
        {status !== 'idle' && (
          <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">
            Start over
          </button>
        )}
      </div>

      {/* Drop zone */}
      {status === 'idle' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={clsx(
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
            isDragging ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50',
          )}
        >
          <div className="text-3xl mb-2">🍽️</div>
          <p className="text-sm font-medium text-gray-700">Drop a food photo here</p>
          <p className="text-xs text-gray-400 mt-1">or click to browse · JPEG, PNG, WebP, GIF · max 5 MB</p>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
      )}

      {/* Loading */}
      {status === 'loading' && (
        <div className="flex flex-col items-center gap-4 py-6">
          {previewUrl && <img src={previewUrl} alt="Analyzing…" className="h-40 rounded-lg object-cover shadow" />}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="animate-spin w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Analyzing your food…
          </div>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-sm text-red-600 text-center">{errorMsg}</p>
          <button onClick={reset} className="text-sm text-emerald-600 hover:underline">Try again</button>
        </div>
      )}

      {/* Results */}
      {status === 'results' && (
        <div className="flex flex-col gap-3">
          {previewUrl && (
            <div className="flex gap-3 items-start">
              <img src={previewUrl} alt="Analyzed meal" className="h-24 w-24 rounded-lg object-cover shadow shrink-0" />
              <p className="text-sm text-gray-600 italic">{description}</p>
            </div>
          )}

          {items.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-2">All items added to log.</p>
          ) : (
            <>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100 text-left">
                    <th className="pb-1 font-medium">Food</th>
                    <th className="pb-1 font-medium text-right w-20">Grams</th>
                    <th className="pb-1 font-medium text-right w-16">kcal</th>
                    <th className="pb-1 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.uid} className="border-b border-gray-50 last:border-0">
                      <td className="py-1.5 text-gray-800 pr-2">{item.name}</td>
                      <td className="py-1.5 text-right">
                        <input
                          type="number"
                          min={1}
                          max={9999}
                          value={item.editedGrams}
                          onChange={(e) => updateGrams(item.uid, Math.max(1, Number(e.target.value)))}
                          className="w-16 text-right border border-gray-200 rounded px-1.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        />
                      </td>
                      <td className="py-1.5 text-right font-medium text-gray-700 pr-2">{item.editedKcal}</td>
                      <td className="py-1.5 text-right">
                        <button
                          onClick={() => addItem(item.uid)}
                          title="Add to log"
                          className="text-emerald-500 hover:text-emerald-700 text-lg leading-none"
                        >
                          +
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={addAll}
                className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
              >
                Add all to log ({items.reduce((s, i) => s + i.editedKcal, 0)} kcal)
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
