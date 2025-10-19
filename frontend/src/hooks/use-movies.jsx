import { useQuery } from "@tanstack/react-query";
import { getAllMovies } from "../lib/service";

export default function useMovies(params = {}) {
  // Determine operation type for optimal caching
  const getCacheStrategy = () => {
    const { search, genre, year, director, page, limit, sortBy, sortOrder, random } = params;
    
    // Random operations (No cache - always fresh)
    if (random) {
      return { 
        type: 'random', 
        staleTime: 0, 
        cacheTime: 0, // No cache for random data
        refetchOnWindowFocus: true,
        refetchOnMount: true
      };
    }
    
    // Very Heavy Operations (Minimal cache)
    if (search && search.length > 0) {
      return { 
        type: 'search', 
        staleTime: 0, 
        cacheTime: 1000 * 30, // 30 seconds cache for search
        refetchOnWindowFocus: true,
        refetchOnMount: true
      };
    }
    
    // Heavy Operations (Short cache)
    if (genre || year || director) {
      return { 
        type: 'filter', 
        staleTime: 1000 * 30, 
        cacheTime: 1000 * 60 * 2, // 30 seconds stale, 2 min cache
        refetchOnWindowFocus: true,
        refetchOnMount: false
      };
    }
    
    // Large dataset operations
    if (limit && limit > 50) {
      return { 
        type: 'heavy', 
        staleTime: 1000 * 30, 
        cacheTime: 1000 * 60 * 2, // 30 seconds stale, 2 min cache
        refetchOnWindowFocus: true,
        refetchOnMount: false
      };
    }
    
    // Deep pagination (less likely to be revisited)
    if (page && page > 5) {
      return { 
        type: 'deep-pagination', 
        staleTime: 1000 * 60, 
        cacheTime: 1000 * 60 * 3, // 1 min stale, 3 min cache
        refetchOnWindowFocus: false,
        refetchOnMount: false
      };
    }
    
    // Medium Operations (Medium cache)
    if (limit && limit > 20) {
      return { 
        type: 'medium', 
        staleTime: 1000 * 60 * 2, 
        cacheTime: 1000 * 60 * 5, // 2 min stale, 5 min cache
        refetchOnWindowFocus: false,
        refetchOnMount: false
      };
    }
    
    // Regular pagination
    if (page && page > 2) {
      return { 
        type: 'pagination', 
        staleTime: 1000 * 60 * 3, 
        cacheTime: 1000 * 60 * 8, // 3 min stale, 8 min cache
        refetchOnWindowFocus: false,
        refetchOnMount: false
      };
    }
    
    // Sorting operations (moderate cache)
    if (sortBy && sortBy !== 'createdAt') {
      return { 
        type: 'sort', 
        staleTime: 1000 * 60 * 2, 
        cacheTime: 1000 * 60 * 5, // 2 min stale, 5 min cache
        refetchOnWindowFocus: false,
        refetchOnMount: false
      };
    }
    
    // Light Operations (Long cache - default)
    return { 
      type: 'light', 
      staleTime: 1000 * 60 * 5, 
      cacheTime: 1000 * 60 * 10, // 5 min stale, 10 min cache
      refetchOnWindowFocus: false,
      refetchOnMount: false
    };
  };

  const cacheStrategy = getCacheStrategy();

  return useQuery({
    queryKey: ["movies", params],
    queryFn: () => getAllMovies(params),
    staleTime: cacheStrategy.staleTime,
    gcTime: cacheStrategy.cacheTime,
    retry: (failureCount, error) => {
      // Don't retry on 404 or 403 errors
      if (error?.response?.status === 404 || error?.response?.status === 403) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: cacheStrategy.refetchOnWindowFocus,
    refetchOnMount: cacheStrategy.refetchOnMount,
    refetchOnReconnect: true, // Refetch when network reconnects
    keepPreviousData: true, // Keep previous data while fetching new data
    // Optimize for better UX
    notifyOnChangeProps: ['data', 'error', 'isLoading'],
  });
}
