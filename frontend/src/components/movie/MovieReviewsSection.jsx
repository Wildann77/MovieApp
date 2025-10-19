import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Plus, MessageCircle } from 'lucide-react';
import ReviewForm from '../review/ReviewForm';
import ReviewList from '../review/ReviewList';
import RatingDisplay from '../review/RatingDisplay';
import ReviewErrorBoundary from '../review/ReviewErrorBoundary';
import { useMovieReviews, useUserMovieReview } from '../../hooks/use-reviews.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { useStore } from '../../store/store';
import { useAuthContext } from '../../context/auth-provider';

export default function MovieReviewsSection({ movieId, movieRating, totalReviews }) {
    const { user, isLoading: authLoading } = useAuthContext();
    const accessToken = useStore.use.accessToken();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('reviews');
    const [editingReview, setEditingReview] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const { 
        data: reviewsData, 
        isLoading: reviewsLoading, 
        error: reviewsError,
        refetch: refetchReviews
    } = useMovieReviews(movieId);

    const { 
        data: userReviewData, 
        isLoading: userReviewLoading,
        error: userReviewError
    } = useUserMovieReview(movieId);

    // Check if userReviewData actually contains a review (has meaningful data)
    const userReview = userReviewData && userReviewData._id ? userReviewData : null;


    const handleReviewSuccess = () => {
        setShowReviewForm(false);
        setEditingReview(null);
        refetchReviews();
        // Invalidate user review query to refresh the data
        queryClient.invalidateQueries({ queryKey: ['userMovieReview', movieId] });
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setShowReviewForm(true);
        setActiveTab('write');
    };

    const handleWriteReview = () => {
        // If user has existing review, set it for editing, otherwise create new
        console.log('handleWriteReview called, userReview:', userReview); // Debug log
        setEditingReview(userReview);
        setShowReviewForm(true);
        setActiveTab('write');
    };

    return (
        <ReviewErrorBoundary>
            <div className="space-y-6">

                {/* Rating Summary */}
                <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-card-foreground">Overall Rating</h3>
                            <RatingDisplay 
                                rating={movieRating || 0} 
                                totalReviews={totalReviews || 0}
                                size="lg"
                            />
                        </div>
                        {(user || accessToken) && !userReview && (
                            <Button onClick={handleWriteReview} className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Write Review
                            </Button>
                        )}
                    </div>
                </div>

                {/* Reviews Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="reviews" className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Reviews
                        </TabsTrigger>
                        {(user || accessToken) && (
                            <TabsTrigger value="write" className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                {userReview ? 'Edit Review' : 'Write Review'}
                            </TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="reviews" className="mt-6">
                        <ReviewList
                            movieId={movieId}
                            reviews={reviewsData?.reviews || []}
                            isLoading={reviewsLoading}
                            error={reviewsError}
                            pagination={reviewsData?.pagination}
                            onEditReview={handleEditReview}
                        />
                    </TabsContent>

                    {(user || accessToken) && (
                        <TabsContent value="write" className="mt-6">
                            {showReviewForm ? (
                                <ReviewForm
                                    movieId={movieId}
                                    existingReview={editingReview}
                                    onSuccess={handleReviewSuccess}
                                />
                            ) : (
                                <div className="text-center py-8">
                                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground mb-4">
                                        {userReview ? 'Edit your review' : 'Share your thoughts about this movie'}
                                    </p>
                                    <Button onClick={handleWriteReview}>
                                        {userReview ? 'Edit Review' : 'Write Review'}
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </ReviewErrorBoundary>
    );
};

