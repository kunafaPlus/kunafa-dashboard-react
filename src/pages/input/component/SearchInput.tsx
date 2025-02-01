import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import { SearchInputProps, SearchResult } from "../utils/type";

export const searchInputVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "border rounded-lg",
        filled: "bg-muted border-transparent",
        ghost: "border-transparent",
      },
      size: {
        sm: "text-sm py-1 px-2",
        md: "text-base py-2 px-3",
        lg: "text-lg py-3 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);



const DEFAULT_DEBOUNCE_MS = 300;
const DEFAULT_MIN_CHARS = 2;
const DEFAULT_MAX_RESULTS = 10;
const HISTORY_KEY = "searchInputHistory";

function SearchInput<T>({
  className,
  variant,
  size,
  results = [],
  onSearch,
  onResultSelect,
  onChange,
  error,
  hint,
  loading = false,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  minChars = DEFAULT_MIN_CHARS,
  maxResults = DEFAULT_MAX_RESULTS,
  showHistory = true,
  clearOnSelect = true,
  renderResult,
  renderNoResults,
  renderLoading,
  filterResults,
  disabled,
  label,
  placeholder,

  ...props
}: SearchInputProps<T>) {
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [history, setHistory] = React.useState<string[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const searchTimeout = React.useRef<number>();

  // Load search history
  React.useEffect(() => {
    if (showHistory) {
      try {
        const savedHistory = localStorage.getItem(HISTORY_KEY);
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error("Failed to load search history:", error);
      }
    }
  }, [showHistory]);

  // Save search history
  const saveHistory = (query: string) => {
    if (showHistory && query.trim()) {
      const newHistory = [
        query,
        ...history.filter((h) => h !== query),
      ].slice(0, 10);
      setHistory(newHistory);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error("Failed to save search history:", error);
      }
    }
  };

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter results based on query
  const filteredResults = React.useMemo(() => {
    if (!query || query.length < minChars) return [];

    let filtered = results;
    if (filterResults) {
      filtered = filterResults(results, query);
    } else {
      filtered = results.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    return filtered.slice(0, maxResults);
  }, [results, query, minChars, maxResults, filterResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true);

    // Call the onChange prop if provided
    onChange?.(e);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Debounce search
    if (newQuery.length >= minChars) {
      searchTimeout.current = setTimeout(() => {
        onSearch?.(newQuery);
      }, debounceMs);
    }
  };

  const handleResultClick = (result: SearchResult<T>) => {
    onResultSelect?.(result);
    saveHistory(result.title);
    if (clearOnSelect) {
      setQuery("");
    }
    setIsOpen(false);
  };

  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem);
    onSearch?.(historyItem);
    setIsOpen(false);
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error("Failed to clear search history:", error);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {label && <p>{label}</p>}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            searchInputVariants({ variant, size }as{}),
            "pl-10 bg-transparent transition-colors outline-input-focus border-input-border disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-destructive focus:ring-destructive",
            className
          )}
          disabled={disabled}
          {...props}
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && !disabled && (query.length >= minChars || showHistory) && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-2">
              {renderLoading ? (
                renderLoading()
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Searching...
                  </span>
                </div>
              )}
            </div>
          ) : filteredResults.length > 0 ? (
            <div>
              {filteredResults.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-accent transition-colors"
                  onClick={() => handleResultClick(result)}
                >
                  {renderResult ? (
                    renderResult(result)
                  ) : (
                    <div>
                      <div className="font-medium">{result.title}</div>
                      {result.description && (
                        <div className="text-sm text-muted-foreground">
                          {result.description}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : query.length >= minChars ? (
            <div className="p-2 text-sm text-muted-foreground text-center">
              {renderNoResults ? (
                renderNoResults()
              ) : (
                "No results found"
              )}
            </div>
          ) : showHistory && history.length > 0 ? (
            <div>
              <div className="flex items-center justify-between px-3 py-1.5 border-b">
                <span className="text-sm text-muted-foreground">
                  Recent searches
                </span>
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-sm text-primary hover:underline"
                >
                  Clear
                </button>
              </div>
              {history.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-accent transition-colors"
                  onClick={() => handleHistoryClick(item)}
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 mr-2 text-muted-foreground"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{item}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {(error || hint) && (
        <div
          className={cn(
            "mt-1.5 text-sm",
            error ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {error || hint}
        </div>
      )}
    </div>
  );
}

export { SearchInput, type SearchResult };