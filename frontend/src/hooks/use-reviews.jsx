import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    createReview, 
    getMovieReviews, 
    getUserMovieReview, 
    updateReview, 
    deleteReview, 
    toggleReviewLike,
    getUserReviews
} from '../lib/service.js';
import useAuth from './use-auth.jsx';
import { useStore } from '../store/store';
import { useAuthContext } from '../context/auth-provider';

// Hook untuk mendapatkan reviews movie
export const useMovieReviews = (movieId, options = {}) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    
    return useQuery({
        queryKey: ['movieReviews', movieId, page, limit, sortBy, sortOrder],
        queryFn: () => getMovieReviews(movieId, { page, limit, sortBy, sortOrder }),
        enabled: !!movieId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook untuk mendapatkan review user untuk movie tertentu
export const useUserMovieReview = (movieId) => {
    const { user } = useAuthContext();
    const accessToken = useStore.use.accessToken();
    
    return useQuery({
        queryKey: ['userMovieReview', movieId, user?.id],
        queryFn: () => getUserMovieReview(movieId, accessToken),
        enabled: !!movieId && !!accessToken, // Remove user requirement since user might not load properly
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error) => {
            // Don't retry on 404 (no review found)
            if (error?.status === 404) return false;
            return failureCount < 3;
        },
    });
};

// Hook untuk mendapatkan semua reviews user
export const useUserReviews = (options = {}) => {
    const { user } = useAuthContext();
    const accessToken = useStore.use.accessToken();
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    
    return useQuery({
        queryKey: ['userReviews', user?.id, page, limit, sortBy, sortOrder],
        queryFn: () => getUserReviews({ page, limit, sortBy, sortOrder }, accessToken),
        enabled: !!user && !!accessToken,
        staleTime: 5 * 60 * 1000,
    });
};

// Hook untuk create review
export const useCreateReview = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();
    const accessToken = useStore.use.accessToken();
    
    return useMutation({
        mutationFn: ({ movieId, reviewData }) => createReview(movieId, reviewData, accessToken),
        onSuccess: (data, variables) => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['movieReviews', variables.movieId] });
            queryClient.invalidateQueries({ queryKey: ['userMovieReview', variables.movieId] });
            queryClient.invalidateQueries({ queryKey: ['userReviews'] });
            queryClient.invalidateQueries({ queryKey: ['movie', variables.movieId] });
            queryClient.invalidateQueries({ queryKey: ['movies'] });
        },
        onError: (error) => {
            console.error('Create review error:', error);
        },
    });
};

// Hook untuk update review
export const useUpdateReview = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();
    const accessToken = useStore.use.accessToken();
    
    return useMutation({
        mutationFn: ({ reviewId, reviewData }) => updateReview(reviewId, reviewData, accessToken),
        onSuccess: (data, variables) => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['movieReviews'] });
            queryClient.invalidateQueries({ queryKey: ['userMovieReview'] });
            queryClient.invalidateQueries({ queryKey: ['userReviews'] });
            queryClient.invalidateQueries({ queryKey: ['movie'] });
            queryClient.invalidateQueries({ queryKey: ['movies'] });
            
            console.log('Review updated successfully:', data); // Debug log
        },
        onError: (error) => {
            console.error('Update review error:', error);
        },
    });
};

// Hook untuk delete review
export const useDeleteReview = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();
    const accessToken = useStore.use.accessToken();
    
    return useMutation({
        mutationFn: (reviewId) => deleteReview(reviewId, accessToken),
        onSuccess: (data, variables) => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['movieReviews'] });
            queryClient.invalidateQueries({ queryKey: ['userMovieReview'] });
            queryClient.invalidateQueries({ queryKey: ['userReviews'] });
            queryClient.invalidateQueries({ queryKey: ['movie'] });
            queryClient.invalidateQueries({ queryKey: ['movies'] });
        },
        onError: (error) => {
            console.error('Delete review error:', error);
        },
    });
};

// Hook untuk like/unlike review
export const useToggleReviewLike = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();
    const accessToken = useStore.use.accessToken();
    
    return useMutation({
        mutationFn: (reviewId) => toggleReviewLike(reviewId, accessToken),
        onSuccess: () => {
            // Invalidate review queries to refresh like counts
            queryClient.invalidateQueries({ queryKey: ['movieReviews'] });
            queryClient.invalidateQueries({ queryKey: ['userReviews'] });
        },
        onError: (error) => {
            console.error('Toggle review like error:', error);
        },
    });
};
