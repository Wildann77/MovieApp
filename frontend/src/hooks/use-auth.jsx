import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/service";
import { useStore } from "@/store/store";

const useAuth = () => {
  const accessToken = useStore.use.accessToken();
  
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUser,
    enabled: !!accessToken, // Only run query if we have a token
    staleTime: 1000 * 60 * 15, // 15 menit cache (user data jarang berubah)
    gcTime: 1000 * 60 * 30, // 30 menit cache (user session)
    retry: (failureCount, error) => {
      // Don't retry on 401 errors (unauthorized)
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: true, // Refetch on focus untuk check session validity
    refetchOnMount: false, // Tidak perlu refetch setiap mount
  });


  return query;
};

export default useAuth;
