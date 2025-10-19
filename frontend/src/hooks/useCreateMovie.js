import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    createMovie,
} from "../lib/service";

// 🔹 Buat movie baru dengan optimistic updates
export const useCreateMovie = (accessToken) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (movieData) => createMovie(movieData, accessToken),
        onMutate: async (movieData) => {
            // ✅ Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["movies"] });
            await queryClient.cancelQueries({ queryKey: ["userMovies"] });
            
            // ✅ Snapshot previous values
            const previousMovies = queryClient.getQueryData(["movies"]);
            const previousUserMovies = queryClient.getQueryData(["userMovies"]);
            
            // ✅ Create optimistic movie object
            const optimisticMovie = {
                ...movieData,
                _id: `temp-${Date.now()}`, // Temporary ID
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isOptimistic: true, // Flag to identify optimistic updates
            };
            
            // ✅ Optimistically update movies list
            queryClient.setQueryData(["movies"], (old) => {
                if (!old?.movies) return old;
                return {
                    ...old,
                    movies: [optimisticMovie, ...old.movies],
                    total: old.total ? old.total + 1 : old.total
                };
            });
            
            // ✅ Optimistically update user movies list
            queryClient.setQueryData(["userMovies"], (old) => {
                if (!old?.movies) return old;
                return {
                    ...old,
                    movies: [optimisticMovie, ...old.movies],
                    total: old.total ? old.total + 1 : old.total
                };
            });
            
            return { previousMovies, previousUserMovies, optimisticMovie };
        },
        onError: (error, movieData, context) => {
            // ✅ Rollback on error
            if (context?.previousMovies) {
                queryClient.setQueryData(["movies"], context.previousMovies);
            }
            if (context?.previousUserMovies) {
                queryClient.setQueryData(["userMovies"], context.previousUserMovies);
            }
            
            toast.error(error.response?.data?.message || "Failed to create movie");
        },
        onSuccess: (data, movieData, context) => {
            // ✅ Update with real data
            if (data) {
                const realMovie = data;
                
                // ✅ Update movies list with real data
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
                
                // ✅ Update user movies list with real data
                queryClient.setQueryData(["userMovies"], (old) => {
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
                
                // ✅ Cache the new movie
                queryClient.setQueryData(["movie", realMovie._id], realMovie);
            }
            
            toast.success("🎬 Movie created successfully!");
        },
        onSettled: () => {
            // ✅ Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: ["movies"] });
            queryClient.invalidateQueries({ queryKey: ["userMovies"] });
        },
    });
};
