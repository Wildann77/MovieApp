// hooks/useMovie.js
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSingleMovie } from "../lib/service";

export const useSingleMovie = (id) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getSingleMovie(id),
    enabled: !!id, // hanya jalan kalau id ada
    staleTime: 1000 * 60 * 10, // data fresh 10 menit (single movie jarang berubah)
    gcTime: 1000 * 60 * 60, // simpan cache 1 jam (single movie bisa di-cache lama)
    retry: 2,
    refetchOnWindowFocus: false, // Single movie tidak perlu refetch on focus
    placeholderData: (previousData) => {
      // First try to return previous data for smooth transitions
      if (previousData) {
        return previousData;
      }
      
      // If no previous data, try to get from list movie cache
      const moviesData = queryClient.getQueryData(["movies"]);
      const userMoviesData = queryClient.getQueryData(["userMovies"]);
      
      // Check both movies and userMovies cache
      const movies = moviesData?.data || userMoviesData?.data || [];
      const foundMovie = movies.find((m) => m._id === id);
      
      return foundMovie;
    },
  });
};
