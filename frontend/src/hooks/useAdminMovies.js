import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminMovies, updateAnyMovie, deleteAnyMovie } from "../lib/service";
import { toast } from "sonner";

export const useAdminMovies = (params = {}) => {
  return useQuery({
    queryKey: ["admin-movies", params],
    queryFn: () => {
      console.log("🔍 Fetching admin movies with params:", params);
      return getAdminMovies(params);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true, // Allow refetch on focus
    retry: (failureCount, error) => {
      console.log("❌ Admin movies fetch error:", error);
      if (error?.response?.status === 403 || error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    onSuccess: (data) => {
      console.log("✅ Admin movies loaded:", data);
    },
    onError: (error) => {
      console.error("❌ Admin movies error:", error);
    },
  });
};

export const useUpdateAnyMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ movieId, movieData }) => updateAnyMovie(movieId, movieData),
    onSuccess: () => {
      // Invalidate and refetch movie lists
      queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      // Toast will be handled by the calling component
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update movie");
    },
  });
};

export const useDeleteAnyMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieId) => deleteAnyMovie(movieId),
    onSuccess: () => {
      // Invalidate and refetch movie lists
      queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast.success("Movie deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete movie");
    },
  });
};

