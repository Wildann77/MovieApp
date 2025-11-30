import { useQuery } from "@tanstack/react-query";
import { getAllMovies } from "../lib/service";

export default function useMovies(params = {}) {
  return useQuery({
    queryKey: ["movies", params],
    queryFn: () => getAllMovies(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: (failureCount, error) => {
      if (error?.response?.status === 404 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    keepPreviousData: true,
  });
}
