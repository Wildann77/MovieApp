import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from './use-debounce';

export const useSearchSelect = (initialValues = {}) => {
  const [searchQueries, setSearchQueries] = useState(initialValues);

  // ✅ Create debounced versions for each search field with 500ms delay to reduce server load
  const debouncedQueries = {};
  Object.keys(initialValues).forEach(field => {
    debouncedQueries[field] = useDebounce(searchQueries[field] || '', 500);
  });

  const handleSearchChange = useCallback((field, value) => {
    setSearchQueries(prev => ({ ...prev, [field]: value }));
  }, []);

  const clearSearch = useCallback((field) => {
    setSearchQueries(prev => ({ ...prev, [field]: '' }));
  }, []);

  const clearAllSearches = useCallback(() => {
    const clearedQueries = {};
    Object.keys(searchQueries).forEach(key => {
      clearedQueries[key] = '';
    });
    setSearchQueries(clearedQueries);
  }, [searchQueries]);

  const resetSearches = useCallback(() => {
    setSearchQueries(initialValues);
  }, [initialValues]);

  // ✅ Memoize the debounced queries to prevent unnecessary re-renders
  const memoizedDebouncedQueries = useMemo(() => debouncedQueries, [
    ...Object.values(debouncedQueries)
  ]);

  // ✅ Memoize searchQueries to prevent unnecessary re-renders
  const memoizedSearchQueries = useMemo(() => searchQueries, [
    ...Object.values(searchQueries)
  ]);

  return {
    searchQueries: memoizedSearchQueries,
    debouncedQueries: memoizedDebouncedQueries,
    handleSearchChange,
    clearSearch,
    clearAllSearches,
    resetSearches
  };
};
