import { useQuery } from "@tanstack/react-query";
import { getGlobalMasterData } from "../lib/service";

// 🔹 Get all global master data (actors, directors, writers, genres) from all users
export const useGlobalMasterData = () => {
    return useQuery({
        queryKey: ["globalMasterData"],
        queryFn: getGlobalMasterData,
        staleTime: 1000 * 60 * 5, // 5 minutes cache (global data changes less frequently)
        gcTime: 1000 * 60 * 15, // 15 minutes cache
        retry: 2,
        refetchOnWindowFocus: false, // Global master data doesn't need frequent refetch
        refetchOnMount: false, // Don't refetch on every mount
        // ✅ Add placeholder data for smoother transitions
        placeholderData: (previousData) => previousData,
        keepPreviousData: true, // Keep previous data while fetching new data
    });
};
