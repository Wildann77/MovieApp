import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportReview } from "../lib/service";
import { toast } from "sonner";

export const useReportReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, reason }) => reportReview(reviewId, reason),
    onSuccess: (data) => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["movie"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to report review");
    }
  });
};
