import { useRef, useState } from 'react';
import { useGalleryStore } from '../hooks/useGalleryStore';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { GalleryCategory, GalleryItem } from '../types/gallery.types';
import { generateId } from '../utils/calorieUtils';
import { todayYMD } from '../utils/dateUtils';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export function GalleryPage() {
  const { items, loading, addItem, deleteItem } = useGalleryStore();
  const [tab, setTab] = useState<GalleryCategory>('meal');
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((i) => i.category === tab);

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Only image files are supported (JPEG, PNG, WebP, GIF).');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setErrorMsg('File is too large. Please use an image under 10 MB.');
      return;
    }
    setErrorMsg('');
    setUploading(true);
    const item: GalleryItem = {
      id: generateId(),
      name: file.name,
      date: todayYMD(),
      category: tab,
      mimeType: file.type,
      blob: file,
    };
    await addItem(item);
    setUploading(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const tabs: { key: GalleryCategory; label: string; icon: string }[] = [
    { key: 'meal', label: 'Meals', icon: '🍽️' },
    { key: 'workout', label: 'Workouts', icon: '💪' },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">
            Save photos of your meals and workouts.
          </p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : '+ Upload Photo'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Drop zone (shown when tab is active and empty) */}
      {!loading && filtered.length === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-14 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-emerald-400 bg-emerald-50'
              : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
          }`}
        >
          <div className="text-4xl mb-3">{tab === 'meal' ? '🍽️' : '💪'}</div>
          <p className="text-sm font-medium text-gray-600">
            Drop a photo here or click to browse
          </p>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, GIF · max 10 MB</p>
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <>
          {/* Drop zone above grid when there are already items */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-3 text-center text-xs text-gray-400 cursor-pointer transition-colors ${
              isDragging
                ? 'border-emerald-400 bg-emerald-50 text-emerald-600'
                : 'border-gray-100 hover:border-emerald-200'
            }`}
            onClick={() => inputRef.current?.click()}
          >
            Drop another photo here or click to browse
          </div>
          <GalleryGrid items={filtered} onDelete={deleteItem} />
        </>
      )}

      {loading && <p className="text-sm text-gray-400 py-4">Loading…</p>}
    </main>
  );
}
