import { useCallback } from 'react';
import { useLocalStorage } from '@hooks/useLocalStorage.js';

const MAX_HISTORY = 10;
const STORAGE_KEY = 'cinestream_search_history';

/**
 * Persists and manages recent search terms in localStorage.
 * Automatically deduplicates and caps the list at MAX_HISTORY entries.
 */
export const useSearchHistory = () => {
  const [history, setHistory, clearHistory] = useLocalStorage(STORAGE_KEY, []);

  const addToHistory = useCallback(
    (term) => {
      const trimmed = term?.trim();
      if (!trimmed || trimmed.length < 2) return;

      setHistory((prev) => {
        // Move to front if already exists, otherwise prepend
        const deduped = prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase());
        return [trimmed, ...deduped].slice(0, MAX_HISTORY);
      });
    },
    [setHistory]
  );

  const removeFromHistory = useCallback(
    (term) => {
      setHistory((prev) => prev.filter((t) => t !== term));
    },
    [setHistory]
  );

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
};
