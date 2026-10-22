import {  useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, X, TrendingUp } from "lucide-react";
import { ROUTES } from "@/constants/routes";
// import { CATEGORIES } from "@/constants/navigation";
import useDebounce from "@/hooks/useDebounce";
import useClickOutside from "@/hooks/useClickOutside";
import useRecentSearches from "@/hooks/useRecentSearches";
import useSearchSuggestions from "@/hooks/useSearchSuggestions";



const POPULAR = ["Sneakers", "Smartwatches", "Kurtis", "Headphones", "Sarees"];

// TODO: backend suggestions API ready aanadhum (useQuery) idhai replace pannunga
// const ALL_TERMS = [...new Set(CATEGORIES.flatMap((c) => [c.name, ...c.items.map((i) => i.name)]))];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const recent = useRecentSearches();
  const debounced = useDebounce(query.trim(), 250);

  useClickOutside(ref, () => setOpen(false));

  // const suggestions = useMemo(() => {
  //   if (!debounced) return [];
  //   const q = debounced.toLowerCase();
  //   return ALL_TERMS.filter((t) => t.toLowerCase().includes(q)).slice(0, 6);
  // }, [debounced]);
const { data: suggestions = [] } = useSearchSuggestions(debounced);

  const submit = (term) => {
    const q = term.trim();
    if (!q) return;
    recent.add(q);
    setQuery(q);
    setOpen(false);
    navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(q)}`);
  };

  const row =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-body hover:bg-stage";

  return (
    <div ref={ref} className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
        className="flex items-center gap-2 rounded-full border border-line-card bg-card px-4 py-2 focus-within:border-terracotta"
      >
        <Search size={16} className="text-muted" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search products, brands and more..."
          className="w-full bg-transparent text-sm text-body outline-none placeholder:text-subtle"
        />
        {query && (
          <button type="button" aria-label="Clear" onClick={() => setQuery("")}>
            <X size={16} className="text-muted" />
          </button>
        )}
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-line bg-card p-2 shadow-soft">
          {!debounced ? (
            <>
              {recent.items.length > 0 && (
                <div className="mb-2">
                  <div className="flex items-center justify-between px-3 py-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Recent searches
                    </span>
                    <button onClick={recent.clear} className="text-xs text-terracotta">
                      Clear all
                    </button>
                  </div>
                  {recent.items.map((t) => (
                    <div key={t} className="flex items-center">
                      <button type="button" onClick={() => submit(t)} className={row}>
                        <Clock size={14} className="text-subtle" /> {t}
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${t}`}
                        onClick={() => recent.remove(t)}
                        className="p-2 text-subtle hover:text-display"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
                  Popular
                </span>
                {POPULAR.map((t) => (
                  <button key={t} type="button" onClick={() => submit(t)} className={row}>
                    <TrendingUp size={14} className="text-subtle" /> {t}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {suggestions.map((t) => (
                <button key={t} type="button" onClick={() => submit(t)} className={row}>
                  <Search size={14} className="text-subtle" /> {t}
                </button>
              ))}
              <button type="button" onClick={() => submit(debounced)} className={row}>
                <Search size={14} className="text-terracotta" />
                Search for “{debounced}”
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}