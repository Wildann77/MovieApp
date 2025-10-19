import { useQuery } from "@tanstack/react-query";
import { getUserMovies } from "../lib/service";
import { useAuthContext } from "../context/auth-provider";

export default function useUserMovies(params = {}) {
  const { user } = useAuthContext();
  
  // Determine operation type for optimal caching
  const getCacheStrategy = () => {
    const { search, genre, year, director, page, limit } = params;
    
    // Search operations (minimal cache, immediate updates)
    if (search && search.length >= 3) {
      return { 
        type: 'search', 
        staleTime: 1000 * 30, // 30 seconds stale time for search results
        cacheTime: 1000 * 60 * 2, // 2 minutes cache for search results
        refetchOnWindowFocus: false,
        refetchOnMount: false
      };
    }
    
    // Filter operations (short cache, moderate updates)
    if (genre || year || director) {
      return { 
        type: 'filter', 
        staleTime: 1000 * 60, // 1 minute stale
        cacheTime: 1000 * 60 * 5, // 5 minutes cache
        refetchOnWindowFocus: false,
        refetchOnMount: false
      };
    }
    
    // Heavy operations (short cache)
    if (limit && limit > 50) {
      return { 
        type: 'heavy', 
        staleTime: 1000 * 60, 
        cacheTime: 1000 * 60 * 3,
        refetchOnWindowFocus: false,
        refetchOnMount: false
      };
    }
    
    // Deep pagination (medium cache)
    if (page && page > 5) {
      return { 
        type: 'deep-pagination', 
        staleTime: 1000 * 60 * 2, 
        cacheTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false
      };
    }
    
    // Medium operations (medium cache)
    if (limit && limit > 20) {
      return { 
        type: 'medium', 
        staleTime: 1000 * 60 * 3, 
        cacheTime: 1000 * 60 * 8,
        refetchOnWindowFocus: false,
        refetchOnMount: false
      };
    }
    
    // Pagination (medium cache)
    if (page && page > 2) {
      return { 
        type: 'pagination', 
        staleTime: 1000 * 60 * 5, 
        cacheTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        refetchOnMount: false
      };
    }
    
    // Light operations (long cache - default)
    return { 
      type: 'light', 
      staleTime: 1000 * 60 * 5, 
      cacheTime: 1000 * 60 * 15, // 15 minutes cache
      refetchOnWindowFocus: false,
      refetchOnMount: false
    };
  };

  const cacheStrategy = getCacheStrategy();

  // Enhanced enabled condition - don't run query for very short searches
  const shouldRunQuery = () => {
    if (!user?._id) return false;
    
    // Don't run query for search terms less than 3 characters
    if (params.search && params.search.length > 0 && params.search.length < 3) {
      return false;
    }
    
    return true;
  };

  return useQuery({
    queryKey: ["userMovies", user?._id, params],
    queryFn: () => {
      const queryParams = { ...params, user: user?._id };
      console.log("🔍 useUserMovies - Fetching movies for user:", user?._id, "with params:", queryParams);
      return getUserMovies(queryParams);
    },
    enabled: shouldRunQuery(), // Enhanced enabled condition
    staleTime: cacheStrategy.staleTime,
    gcTime: cacheStrategy.cacheTime, // Use gcTime instead of cacheTime for React Query v5
    retry: 1, // Reduce retry to 1 for better UX
    refetchOnWindowFocus: cacheStrategy.refetchOnWindowFocus,
    refetchOnMount: cacheStrategy.refetchOnMount,
    // Add placeholder data for smoother transitions
    placeholderData: (previousData) => previousData,
    // Add network mode for better performance
    networkMode: 'online',
  });
}
