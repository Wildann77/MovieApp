import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getAllWriters,
    getWriterById,
    createWriter,
    updateWriter,
    deleteWriter,
} from "../lib/service";

// 🔹 Get all writers with optimal caching
export const useWriters = (params = {}) => {
    // Determine operation type for optimal caching
    const getCacheStrategy = () => {
        const { search, page, limit } = params;
        
        // Very Heavy Operations (Minimal cache)
        if (search && search.length > 0) {
            return { type: 'search', staleTime: 0, cacheTime: 1000 * 30 }; // 30 seconds cache for search
        }
        
        // Heavy Operations (Short cache)
        if (limit && limit > 50) {
            return { type: 'heavy', staleTime: 1000 * 30, cacheTime: 1000 * 60 * 2 }; // 30 seconds stale, 2 min cache
        }
        
        if (page && page > 5) {
            return { type: 'deep-pagination', staleTime: 1000 * 60, cacheTime: 1000 * 60 * 3 }; // 1 min stale, 3 min cache
        }
        
        // Medium Operations (Medium cache)
        if (limit && limit > 20) {
            return { type: 'medium', staleTime: 1000 * 60 * 2, cacheTime: 1000 * 60 * 5 }; // 2 min stale, 5 min cache
        }
        
        if (page && page > 2) {
            return { type: 'pagination', staleTime: 1000 * 60 * 3, cacheTime: 1000 * 60 * 8 }; // 3 min stale, 8 min cache
        }
        
        // Light Operations (Long cache - default)
        return { type: 'light', staleTime: 1000 * 60 * 5, cacheTime: 1000 * 60 * 10 }; // 5 min stale, 10 min cache
    };

    const cacheStrategy = getCacheStrategy();

    return useQuery({
        queryKey: ["writers", params],
        queryFn: () => getAllWriters(params),
        staleTime: cacheStrategy.staleTime,
        gcTime: cacheStrategy.cacheTime, // Use gcTime for React Query v5
        retry: 1,
        refetchOnWindowFocus: false, // Disable refetch on focus for better UX
        refetchOnMount: cacheStrategy.type === 'search',
        // ✅ Add placeholder data for smoother transitions
        placeholderData: (previousData) => previousData,
        keepPreviousData: true, // Keep previous data while fetching new data
    });
};

// 🔹 Get single writer by ID
export const useWriter = (writerId) => {
    return useQuery({
        queryKey: ["writer", writerId],
        queryFn: () => getWriterById(writerId),
        enabled: !!writerId,
        staleTime: 1000 * 60 * 5,
        retry: 2,
        refetchOnWindowFocus: false,
    });
};

// 🔹 Create new writer
export const useCreateWriter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (writerData) => createWriter(writerData),
        onSuccess: () => {
            toast.success("✍️ Writer created successfully!");
            queryClient.invalidateQueries({ queryKey: ["writers"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to create writer");
        },
    });
};

// 🔹 Update writer
export const useUpdateWriter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ writerId, writerData }) => updateWriter(writerId, writerData),
        onSuccess: (data, variables) => {
            toast.success("✍️ Writer updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["writers"] });
            queryClient.invalidateQueries({ queryKey: ["writer", variables.writerId] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update writer");
        },
    });
};

// 🔹 Delete writer
export const useDeleteWriter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (writerId) => deleteWriter(writerId),
        onSuccess: () => {
            toast.success("✍️ Writer deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["writers"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete writer");
        },
    });
};
