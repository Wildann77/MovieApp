import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchMovies, searchActors } from '@/lib/service';
import { useDebounce } from '@/hooks/use-debounce';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Search movies query
  const { 
    data: moviesData, 
    isLoading: isSearchingMovies, 
    error: moviesError 
  } = useQuery({
    queryKey: ['search-movies', debouncedSearchQuery],
    queryFn: () => searchMovies(debouncedSearchQuery),
    enabled: debouncedSearchQuery.length >= 2, // Only search if query is at least 2 characters
    staleTime: 2 * 60 * 1000, // 2 minutes (search results change frequently)
    gcTime: 10 * 60 * 1000, // 10 minutes
    // ✅ Add placeholder data for smoother transitions
    placeholderData: (previousData) => previousData,
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  // Search actors query
  const { 
    data: actorsData, 
    isLoading: isSearchingActors, 
    error: actorsError 
  } = useQuery({
    queryKey: ['search-actors', debouncedSearchQuery],
    queryFn: () => searchActors(debouncedSearchQuery),
    enabled: debouncedSearchQuery.length >= 2, // Only search if query is at least 2 characters
    staleTime: 2 * 60 * 1000, // 2 minutes (search results change frequently)
    gcTime: 10 * 60 * 1000, // 10 minutes
    // ✅ Add placeholder data for smoother transitions
    placeholderData: (previousData) => previousData,
    keepPreviousData: true, // Keep previous data while fetching new data
  });

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    if (value.length >= 2) {
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  }, []);

  // Handle escape key to close search
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // You can add navigation logic here if needed
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearchOpen(false);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  // Close search when clicking outside - DISABLED to fix navigation issues
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (isSearchOpen && 
  //         !event.target.closest('[data-search-input]') && 
  //         !event.target.closest('[data-search-dropdown]')) {
  //       setIsSearchOpen(false);
  //     }
  //   };

  //   if (isSearchOpen) {
  //     document.addEventListener('mousedown', handleClickOutside);
      
  //     return () => {
  //       document.removeEventListener('mousedown', handleClickOutside);
  //     };
  //   }
  // }, [isSearchOpen]);

  const isSearching = isSearchingMovies || isSearchingActors;
  const searchResults = {
    movies: moviesData?.data || [],
    actors: actorsData?.data || []
  };

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    searchResults,
    isSearching,
    searchError: moviesError || actorsError,
    isSearchOpen,
    handleSearchSubmit,
    clearSearch,
    closeSearch,
  };
};
