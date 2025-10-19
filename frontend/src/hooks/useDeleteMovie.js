import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMovie } from "../lib/service";
import { useAuthContext } from "../context/auth-provider";
import { useStore } from "../store/store";
import { toast } from "sonner";

export const useDeleteMovie = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();
    const accessToken = useStore.use.accessToken();

    return useMutation({
        mutationFn: async (movieId) => {
            if (!accessToken) {
                throw new Error("No access token available");
            }
            return await deleteMovie(movieId, accessToken);
        },
        onMutate: async (movieId) => {
            // ✅ Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["movies"] });
            await queryClient.cancelQueries({ queryKey: ["userMovies"] });
            
            // ✅ Snapshot previous values
            const previousMovies = queryClient.getQueryData(["movies"]);
            const previousUserMovies = queryClient.getQueryData(["userMovies"]);
            
            // ✅ Optimistically update movies list
            queryClient.setQueryData(["movies"], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    movies: old.movies?.filter(m => m._id !== movieId) || [],
                    total: old.total ? old.total - 1 : old.total
                };
            });
            
            // ✅ Optimistically update user movies list
            queryClient.setQueryData(["userMovies"], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    movies: old.movies?.filter(m => m._id !== movieId) || [],
                    total: old.total ? old.total - 1 : old.total
                };
            });
            
            // ✅ Remove specific movie from cache
            queryClient.removeQueries({ queryKey: ["movie", movieId] });
            
            return { previousMovies, previousUserMovies };
        },
        onError: (error, movieId, context) => {
            // ✅ Rollback on error
            if (context?.previousMovies) {
                queryClient.setQueryData(["movies"], context.previousMovies);
            }
            if (context?.previousUserMovies) {
                queryClient.setQueryData(["userMovies"], context.previousUserMovies);
            }
            
            console.error("Error deleting movie:", error);
            toast.error("Failed to delete movie. Please try again.");
        },
        onSuccess: (data, movieId) => {
            toast.success("Movie deleted successfully!");
        },
        onSettled: () => {
            // ✅ Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: ["movies"] });
            queryClient.invalidateQueries({ queryKey: ["userMovies"] });
        },
    });
};
