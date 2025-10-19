import { useQuery } from "@tanstack/react-query";
import { getAllMasterData } from "../lib/service";

// 🔹 Get all master data (actors, directors, writers, genres) in one call
export const useMasterData = () => {
    return useQuery({
        queryKey: ["masterData"],
        queryFn: getAllMasterData,
        staleTime: 1000 * 60 * 10, // 10 menit cache (master data jarang berubah)
        gcTime: 1000 * 60 * 60, // 1 jam cache (master data bisa di-cache lama)
        retry: 2,
        refetchOnWindowFocus: false, // Master data tidak perlu refetch on focus
        refetchOnMount: false, // Tidak perlu refetch setiap mount
        // ✅ Add placeholder data for smoother transitions
        placeholderData: (previousData) => previousData,
        keepPreviousData: true, // Keep previous data while fetching new data
    });
};
