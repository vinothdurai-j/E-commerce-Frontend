import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "shiloh:wishlist";
const listeners = new Set();

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

// One shared array, so every component using the hook stays in sync.
let ids = read();

function write(next) {
  ids = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked: keep in-memory state */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);

  // keep other browser tabs in sync
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY) {
      ids = read();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => ids;

export function useWishlist() {
  const current = useSyncExternalStore(subscribe, getSnapshot, () => []);

  const toggle = useCallback((productId) => {
    const id = String(productId);
    write(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  }, []);

  const has = useCallback((productId) => ids.includes(String(productId)), []);

  return { ids: current, count: current.length, toggle, has };
}

export default useWishlist;