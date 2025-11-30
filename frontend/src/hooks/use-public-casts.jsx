import { useQuery } from "@tanstack/react-query";
import { getPublicCasts } from "../lib/service";

export default function usePublicCasts(params = {}) {
  // Determine operation type for optimal caching
  const getCacheStrategy = () => {
    const { search, page, limit } = params;
    
    // Very Heavy Operations (No cache - always fresh)
    if (search && search.length > 0) {
      return { type: 'search', staleTime: 0, cacheTime: 1000 * 30 }; // 30 seconds cache for search
    }
    
    // Heavy Operations (Short cache)
    if (limit && limit > 50) {
      return { type: 'heavy', staleTime: 1000 * 30, cacheTime: 1000 * 60 * 2 }; // 30 seconds stale, 2 min cache
    }
    
    if (page && page > 5) {
      return { type: 'deep-pagination', staleTime: 1000 * 60, cacheTime: 1000 * 60 * 3 }; // 1 min stale, 3 min cache
    }
    
    // Medium Operations (Medium cache)
    if (limit && limit > 20) {
      return { type: 'medium', staleTime: 1000 * 60 * 2, cacheTime: 1000 * 60 * 5 }; // 2 min stale, 5 min cache
    }
    
    if (page && page > 2) {
      return { type: 'pagination', staleTime: 1000 * 60 * 3, cacheTime: 1000 * 60 * 8 }; // 3 min stale, 8 min cache
    }
    
    // Light Operations (Long cache - default)
    return { type: 'light', staleTime: 1000 * 60 * 5, cacheTime: 1000 * 60 * 10 }; // 5 min stale, 10 min cache
  };

  const cacheStrategy = getCacheStrategy();

  return useQuery({
    queryKey: ["public-casts", params],
    queryFn: () => getPublicCasts(params),
    staleTime: cacheStrategy.staleTime,
    gcTime: cacheStrategy.cacheTime, // Use gcTime for React Query v5
    retry: 2,
    refetchOnWindowFocus: cacheStrategy.type === 'search' || cacheStrategy.type === 'heavy',
    refetchOnMount: cacheStrategy.type === 'search',
    // ✅ Add placeholder data for smoother transitions
    placeholderData: (previousData) => previousData,
    keepPreviousData: true, // Keep previous data while fetching new data
  });
}
