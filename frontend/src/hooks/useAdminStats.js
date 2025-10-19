import { useQuery } from "@tanstack/react-query";
import { getSystemStats } from "../lib/service";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => {
      console.log("🔍 Fetching admin stats...");
      return getSystemStats();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: true, // Allow refetch on focus
    refetchOnMount: true, // Allow refetch on mount
    retry: (failureCount, error) => {
      console.log("❌ Admin stats fetch error:", error);
      if (error?.response?.status === 403 || error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    onSuccess: (data) => {
      console.log("✅ Admin stats loaded:", data);
    },
    onError: (error) => {
      console.error("❌ Admin stats error:", error);
    },
  });
};

