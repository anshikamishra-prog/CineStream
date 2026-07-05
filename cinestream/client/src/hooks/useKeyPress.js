import { useEffect, useCallback } from 'react';

/**
 * Listens for a specific key press globally.
 * @param {string} targetKey - e.g. 'Escape', 'Enter', ' '
 * @param {function} handler - called when key is pressed
 * @param {object} [options]
 * @param {boolean} [options.enabled=true]
 */
export const useKeyPress = (targetKey, handler, { enabled = true } = {}) => {
  const memoHandler = useCallback(handler, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event) => {
      if (event.key === targetKey) {
        memoHandler(event);
      }
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [targetKey, memoHandler, enabled]);
};
