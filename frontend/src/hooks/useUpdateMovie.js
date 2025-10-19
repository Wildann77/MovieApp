import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMovie } from "../lib/service";
import { useAuthContext } from "../context/auth-provider";
import { useStore } from "../store/store";
import { toast } from "sonner";

export const useUpdateMovie = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();
    const accessToken = useStore.use.accessToken();

    return useMutation({
        mutationFn: async ({ movieId, movieData }) => {
            if (!accessToken) {
                throw new Error("No access token available");
            }
            return await updateMovie(movieId, movieData, accessToken);
        },
        onMutate: async ({ movieId, movieData }) => {
            // ✅ Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["movie", movieId] });
            await queryClient.cancelQueries({ queryKey: ["movies"] });
            await queryClient.cancelQueries({ queryKey: ["userMovies"] });
            
            // ✅ Snapshot previous values
            const previousMovie = queryClient.getQueryData(["movie", movieId]);
            const previousMovies = queryClient.getQueryData(["movies"]);
            const previousUserMovies = queryClient.getQueryData(["userMovies"]);
            
            // ✅ Optimistically update specific movie
            if (previousMovie) {
                queryClient.setQueryData(["movie", movieId], (old) => ({
                    ...old,
                    ...movieData,
                    updatedAt: new Date().toISOString()
                }));
            }
            
            // ✅ Optimistically update movies list
            queryClient.setQueryData(["movies"], (old) => {
                if (!old?.movies) return old;
                return {
                    ...old,
                    movies: old.movies.map(m => 
                        m._id === movieId ? { ...m, ...movieData } : m
                    )
                };
            });
            
            // ✅ Optimistically update user movies list
            queryClient.setQueryData(["userMovies"], (old) => {
                if (!old?.movies) return old;
                return {
                    ...old,
                    movies: old.movies.map(m => 
                        m._id === movieId ? { ...m, ...movieData } : m
                    )
                };
            });
            
            return { previousMovie, previousMovies, previousUserMovies };
        },
        onError: (error, variables, context) => {
            // ✅ Rollback on error
            if (context?.previousMovie) {
                queryClient.setQueryData(["movie", variables.movieId], context.previousMovie);
            }
            if (context?.previousMovies) {
                queryClient.setQueryData(["movies"], context.previousMovies);
            }
            if (context?.previousUserMovies) {
                queryClient.setQueryData(["userMovies"], context.previousUserMovies);
            }
            
            console.error("Error updating movie:", error);
            toast.error("Failed to update movie. Please try again.");
        },
        onSuccess: (data, variables) => {
            toast.success("Movie updated successfully!");
        },
        onSettled: (data, error, variables) => {
            // ✅ Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: ["movie", variables.movieId] });
            queryClient.invalidateQueries({ queryKey: ["movies"] });
            queryClient.invalidateQueries({ queryKey: ["userMovies"] });
        },
    });
};
