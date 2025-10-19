import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getUserFavorites, 
  addToFavorites, 
  removeFromFavorites, 
  toggleFavorite 
} from "@/lib/service";
import { useAuthContext } from "@/context/auth-provider";
import { useStore } from "@/store/store";

// Hook to get user's favorites with pagination and filtering
export const useFavorites = (params = {}) => {
  const { user, isLoading } = useAuthContext();
  const accessToken = useStore.use.accessToken();

  // Determine cache strategy based on params (similar to useMovies)
  const getCacheStrategy = () => {
    const { search, genre, year, page, limit, sortBy, sortOrder } = params;
    
    // Heavy Operations (Short cache)
    if (genre || year || search) {
      return { 
        type: 'filter', 
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
    queryKey: ["user", "favorites", params],
    queryFn: () => getUserFavorites(params),
    enabled: !!accessToken && !!user && !isLoading,
    staleTime: cacheStrategy.staleTime,
    gcTime: cacheStrategy.cacheTime, // Use gcTime for React Query v5
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
    notifyOnChangeProps: ['data', 'error', 'isLoading'],
  });
};

// Hook to toggle favorite status dengan optimistic updates
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavorite,
    onMutate: async (movieId) => {
      // ✅ Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["user", "favorites"] });
      await queryClient.cancelQueries({ queryKey: ["movie", movieId] });
      await queryClient.cancelQueries({ queryKey: ["movies"] });
      
      // ✅ Snapshot previous values
      const previousFavorites = queryClient.getQueryData(["user", "favorites"]);
      const previousMovie = queryClient.getQueryData(["movie", movieId]);
      const previousMovies = queryClient.getQueryData(["movies"]);
      
      // ✅ Get current favorite status
      const currentMovie = previousMovie || 
        previousMovies?.movies?.find(m => m._id === movieId) ||
        previousFavorites?.favorites?.find(m => m._id === movieId);
      
      const newFavoriteStatus = !currentMovie?.isFavorite;
      
      // ✅ Optimistically update favorites
      queryClient.setQueryData(["user", "favorites"], (old) => {
        if (!old?.favorites) return old;
        
        if (newFavoriteStatus) {
          // Add to favorites
          const movieToAdd = previousMovie || 
            previousMovies?.movies?.find(m => m._id === movieId);
          if (movieToAdd) {
            return {
              ...old,
              favorites: [{ ...movieToAdd, isFavorite: true }, ...old.favorites],
              total: old.total ? old.total + 1 : old.total
            };
          }
        } else {
          // Remove from favorites
          return {
            ...old,
            favorites: old.favorites.filter(m => m._id !== movieId),
            total: old.total ? old.total - 1 : old.total
          };
        }
        return old;
      });
      
      // ✅ Optimistically update individual movie
      queryClient.setQueryData(["movie", movieId], (old) => {
        if (!old) return old;
        return {
          ...old,
          isFavorite: newFavoriteStatus,
        };
      });
      
      // ✅ Optimistically update movies list
      queryClient.setQueryData(["movies"], (old) => {
        if (!old?.movies) return old;
        return {
          ...old,
          movies: old.movies.map(m => 
            m._id === movieId ? { ...m, isFavorite: newFavoriteStatus } : m
          )
        };
      });
      
      return { previousFavorites, previousMovie, previousMovies, newFavoriteStatus };
    },
    onError: (error, movieId, context) => {
      // ✅ Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(["user", "favorites"], context.previousFavorites);
      }
      if (context?.previousMovie) {
        queryClient.setQueryData(["movie", movieId], context.previousMovie);
      }
      if (context?.previousMovies) {
        queryClient.setQueryData(["movies"], context.previousMovies);
      }
      
      console.error("Error toggling favorite:", error);
    },
    onSuccess: (data, movieId) => {
      // ✅ Update with real data
      queryClient.setQueryData(["movie", movieId], (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            isFavorite: data.isFavorite,
          };
        }
        return oldData;
      });
    },
    onSettled: () => {
      // ✅ Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["user", "favorites"] });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
};

// Hook to add movie to favorites
export const useAddToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "favorites"] });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
};

// Hook to remove movie from favorites
export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "favorites"] });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
};

// Hook to check if a movie is in favorites
export const useIsFavorite = (movieId) => {
  const { data: favoritesData, isLoading } = useFavorites();
  const favorites = favoritesData?.favorites || [];
  
  return {
    isFavorite: favorites.some((movie) => movie._id === movieId),
    isLoading,
  };
};
