import { useState, useEffect, useCallback } from 'react';
import { GalleryItem } from '../types/gallery.types';

const DB_NAME = 'fittrack_gallery';
const STORE = 'images';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('date', 'date', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function useGalleryStore() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const db = await openDB();
    const all = await new Promise<GalleryItem[]>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result as GalleryItem[]);
      req.onerror = () => reject(req.error);
    });
    setItems(all.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)));
    setLoading(false);
  }, []);

  useEffect(() => {
    reload().catch(() => setLoading(false));
  }, [reload]);

  const addItem = useCallback(async (item: GalleryItem) => {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).add(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    setItems((prev) => [item, ...prev]);
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return { items, loading, addItem, deleteItem };
}
