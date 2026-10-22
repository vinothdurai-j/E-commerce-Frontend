import { useState } from "react";

const KEY = "recentSearches";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

export default function useRecentSearches() {
  const [items, setItems] = useState(read);

  const persist = (next) => {
    setItems(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const add = (term) =>
    persist([term, ...items.filter((i) => i.toLowerCase() !== term.toLowerCase())].slice(0, 6));
  const remove = (term) => persist(items.filter((i) => i !== term));
  const clear = () => persist([]);

  return { items, add, remove, clear };
}