import { useState, useEffect } from 'react';
import { GalleryItem } from '../../types/gallery.types';

interface GridProps {
  items: GalleryItem[];
  onDelete: (id: string) => void;
}

export function GalleryGrid({ items, onDelete }: GridProps) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  if (items.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {items.map((item) => (
          <GalleryTile key={item.id} item={item} onDelete={onDelete} onOpen={setLightboxUrl} />
        ))}
      </div>

      {lightboxUrl && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <img
            src={lightboxUrl}
            alt="Full size preview"
            className="max-h-[90vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 text-white text-2xl leading-none hover:text-gray-300 bg-black/40 rounded-full w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}

function GalleryTile({
  item,
  onDelete,
  onOpen,
}: {
  item: GalleryItem;
  onDelete: (id: string) => void;
  onOpen: (url: string) => void;
}) {
  const [url, setUrl] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(item.blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [item.blob]);

  if (!url) return null;

  return (
    <div className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square">
      <img
        src={url}
        alt={item.name}
        className="w-full h-full object-cover cursor-pointer"
        onClick={() => onOpen(url)}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors pointer-events-none" />

      {/* Controls */}
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {confirmDelete ? (
          <div className="flex gap-1">
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs bg-gray-700/90 text-white px-2 py-0.5 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="text-xs bg-red-500 text-white px-2 py-0.5 rounded"
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-xs bg-black/50 text-white px-2 py-0.5 rounded hover:bg-red-500 transition-colors"
          >
            Delete
          </button>
        )}
      </div>

      {/* Date label */}
      <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-xs text-white truncate">{item.date}</p>
      </div>
    </div>
  );
}
