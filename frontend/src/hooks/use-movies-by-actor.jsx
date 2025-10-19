import { useQuery } from "@tanstack/react-query";
import { getMoviesByActor } from "../lib/service";

export const useMoviesByActor = (actorId, params = {}) => {
  return useQuery({
    queryKey: ["moviesByActor", actorId, params],
    queryFn: () => getMoviesByActor(actorId, params),
    enabled: !!actorId, // only run if actorId exists
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (optimized for relationship data)
    retry: 2,
    refetchOnWindowFocus: false,
    // ✅ Add placeholder data for smoother transitions
    placeholderData: (previousData) => previousData,
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};
