import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminReviews, deleteAnyReview } from "../lib/service";
import { toast } from "sonner";

export const useAdminReviews = (params = {}) => {
  return useQuery({
    queryKey: ["admin-reviews", params],
    queryFn: () => {
      console.log("🔍 Fetching admin reviews with params:", params);
      return getAdminReviews(params);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true, // Allow refetch on focus
    retry: (failureCount, error) => {
      console.log("❌ Admin reviews fetch error:", error);
      if (error?.response?.status === 403 || error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    onSuccess: (data) => {
      console.log("✅ Admin reviews loaded:", data);
    },
    onError: (error) => {
      console.error("❌ Admin reviews error:", error);
    },
  });
};

export const useDeleteAnyReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) => deleteAnyReview(reviewId),
    onSuccess: () => {
      // Invalidate and refetch review lists
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete review");
    },
  });
};

