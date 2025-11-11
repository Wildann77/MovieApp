import { useQuery } from "@tanstack/react-query";
import { getSingleMovie } from "../lib/service";

export const useSingleMovie = (id) => {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getSingleMovie(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
};
