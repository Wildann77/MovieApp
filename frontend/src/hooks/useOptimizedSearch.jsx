import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from './use-debounce';

/**
 * Optimized search hook with smooth debouncing and loading states
 * Similar to use-search.jsx but more focused on form input optimization
 */
export const useOptimizedSearch = (debounceMs = 500) => {
  const [searchInput, setSearchInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const debouncedSearch = useDebounce(searchInput, debounceMs);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // Eliminated useEffect logging to remove any potential lag

  // Handle input change with ZERO LAG - ULTRA OPTIMIZED
  const handleSearchChange = useCallback((value) => {
    // Single state update for maximum performance
    setSearchInput(value);
    
    // Use ref-based typing state to avoid re-renders
    isTypingRef.current = true;
    setIsTyping(true);

    // Use requestAnimationFrame for non-blocking timeout management
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Minimal timeout for typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      setIsTyping(false);
    }, debounceMs + 100);
  }, [debounceMs]);

  // Clear search - ZERO LAG optimized
  const clearSearch = useCallback(() => {
    setSearchInput('');
    isTypingRef.current = false;
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    searchInput,
    debouncedSearch,
    isTyping,
    isSearching: isTyping && searchInput.length > 0, // Show searching only when actually typing
    handleSearchChange,
    clearSearch,
  };
};
