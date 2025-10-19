import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from './use-debounce';

/**
 * Optimized search select hook for forms with debouncing and caching
 * Similar to useSearchSelect but with better performance and UX
 */
export const useFormSearchSelect = (initialValues = {}) => {
  const [searchQueries, setSearchQueries] = useState(initialValues);
  
  // Create debounced versions for each search field with 500ms delay to reduce server load
  const debouncedSearchQueries = {};
  Object.keys(initialValues).forEach(field => {
    debouncedSearchQueries[field] = useDebounce(searchQueries[field] || '', 500);
  });

  const handleSearchChange = useCallback((field, value) => {
    console.log(`⌨️ Input change - Field: ${field}, Value: "${value}"`);
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

  // Memoize the debounced queries to prevent unnecessary re-renders
  const memoizedDebouncedQueries = useMemo(() => debouncedSearchQueries, [
    ...Object.values(debouncedSearchQueries)
  ]);

  return {
    searchQueries,
    debouncedSearchQueries: memoizedDebouncedQueries,
    handleSearchChange,
    clearSearch,
    clearAllSearches,
    resetSearches
  };
};
