import { useState, useEffect, useCallback } from 'react';

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback(callback, delay) {
  const [pendingValue, setPendingValue] = useState(null);
  const debouncedValue = useDebounce(pendingValue, delay);

  useEffect(() => {
    if (debouncedValue !== null && debouncedValue !== undefined) {
      callback(debouncedValue);
    }
  }, [debouncedValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const setValue = useCallback((v) => setPendingValue(v), []);
  return setValue;
}
