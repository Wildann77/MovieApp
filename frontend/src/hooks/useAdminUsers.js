import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminUsers, updateUserRole, toggleUserStatus, deleteUser } from "../lib/service";
import { toast } from "sonner";

export const useAdminUsers = (params = {}) => {
  return useQuery({
    queryKey: ["admin-users", JSON.stringify(params)],
    queryFn: () => {
      console.log("🔍 Fetching admin users with params:", params);
      return getAdminUsers(params);
    },
    staleTime: 0, // Always consider data stale for admin operations
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false, // Disable refetch on focus to avoid unnecessary requests
    refetchOnMount: true, // Always refetch on mount
    retry: (failureCount, error) => {
      console.log("❌ Admin users fetch error:", error);
      if (error?.response?.status === 403 || error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    onSuccess: (data) => {
      console.log("✅ Admin users loaded:", data);
    },
    onError: (error) => {
      console.error("❌ Admin users error:", error);
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }) => updateUserRole(userId, role),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user lists
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(`User role updated to ${variables.role}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update user role");
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isActive }) => toggleUserStatus(userId, isActive),
    onSuccess: (data) => {
      // Invalidate and refetch user lists
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      const action = data.isActive ? "activated" : "deactivated";
      toast.success(`User ${action} successfully`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update user status");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: (data, userId) => {
      // Invalidate and refetch user lists
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(data.message || "User deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
};

