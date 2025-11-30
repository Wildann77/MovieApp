import { useState, useEffect, useCallback } from 'react';

const useSearch = (initialValue = "", delay = 300) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  // Debounce search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchValue, delay]);

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchValue("");
    setDebouncedValue("");
  }, []);

  return {
    searchValue,
    debouncedValue,
    handleSearchChange,
    clearSearch,
  };
};

export default useSearch;
