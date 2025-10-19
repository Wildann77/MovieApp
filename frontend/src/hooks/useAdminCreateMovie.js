import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createAnyMovie } from "../lib/service";

/**
 * Admin hook for creating movies
 * Uses admin API endpoint that bypasses user ownership restrictions
 */
export const useAdminCreateMovie = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (movieData) => createAnyMovie(movieData),
        onMutate: async (movieData) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["adminMovies"] });
            await queryClient.cancelQueries({ queryKey: ["movies"] });
            
            // Snapshot previous values
            const previousAdminMovies = queryClient.getQueryData(["adminMovies"]);
            const previousMovies = queryClient.getQueryData(["movies"]);
            
            // Create optimistic movie object
            const optimisticMovie = {
                ...movieData,
                _id: `temp-${Date.now()}`, // Temporary ID
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isOptimistic: true, // Flag to identify optimistic updates
            };
            
            // Optimistically update admin movies list
            queryClient.setQueryData(["adminMovies"], (old) => {
                if (!old?.data) return old;
                return {
                    ...old,
                    data: [optimisticMovie, ...old.data],
                    totalMovies: old.totalMovies ? old.totalMovies + 1 : old.totalMovies
                };
            });
            
            // Optimistically update public movies list
            queryClient.setQueryData(["movies"], (old) => {
                if (!old?.movies) return old;
                return {
                    ...old,
                    movies: [optimisticMovie, ...old.movies],
                    total: old.total ? old.total + 1 : old.total
                };
            });
            
            return { previousAdminMovies, previousMovies, optimisticMovie };
        },
        onError: (error, movieData, context) => {
            // Rollback on error
            if (context?.previousAdminMovies) {
                queryClient.setQueryData(["adminMovies"], context.previousAdminMovies);
            }
            if (context?.previousMovies) {
                queryClient.setQueryData(["movies"], context.previousMovies);
            }
            
            toast.error(error.response?.data?.message || "Failed to create movie");
        },
        onSuccess: (data, movieData, context) => {
            // Update with real data
            if (data) {
                const realMovie = data;
                
                // Update admin movies list with real data
                queryClient.setQueryData(["adminMovies"], (old) => {
                    if (!old?.data) return old;
                    return {
                        ...old,
                        data: old.data.map(m => 
                            m.isOptimistic && m.title === movieData.title 
                                ? realMovie 
                                : m
                        )
                    };
                });
                
                // Update public movies list with real data
                queryClient.setQueryData(["movies"], (old) => {
                    if (!old?.movies) return old;
                    return {
                        ...old,
                        movies: old.movies.map(m => 
                            m.isOptimistic && m.title === movieData.title 
                                ? realMovie 
                                : m
                        )
                    };
                });
                
                // Cache the new movie
                queryClient.setQueryData(["movie", realMovie._id], realMovie);
            }
            
            toast.success("🎬 Movie created successfully!");
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: ["adminMovies"] });
            queryClient.invalidateQueries({ queryKey: ["movies"] });
        },
    });
};
