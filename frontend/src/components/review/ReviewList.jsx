import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Star, MessageCircle } from 'lucide-react';
import ReviewCard from './ReviewCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorState from '../shared/ErrorState';
import Loader from '../kokonutui/loader';

const ReviewList = ({ 
    movieId, 
    reviews, 
    isLoading, 
    error, 
    pagination, 
    onLoadMore,
    onEditReview 
}) => {
    if (isLoading && !reviews?.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Reviews
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Loader 
                        title="Loading Reviews"
                        subtitle="Please wait while we fetch the movie reviews"
                        size="md"
                    />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Reviews
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ErrorState 
                        message="Failed to load reviews" 
                        onRetry={() => window.location.reload()} 
                    />
                </CardContent>
            </Card>
        );
    }

    if (!reviews?.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Reviews
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No reviews yet</p>
                        <p className="text-sm text-muted-foreground">Be the first to review this movie!</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Reviews ({pagination?.total || reviews.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {reviews.map((review) => (
                    <ReviewCard
                        key={review._id}
                        review={review}
                        onEdit={onEditReview}
                    />
                ))}

                {/* Load More Button */}
                {pagination && pagination.currentPage < pagination.totalPages && (
                    <div className="flex justify-center pt-4">
                        <Button
                            variant="outline"
                            onClick={onLoadMore}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : 'Load More Reviews'}
                        </Button>
                    </div>
                )}

                {/* Loading indicator for load more */}
                {isLoading && reviews.length > 0 && (
                    <div className="flex justify-center">
                        <LoadingSpinner size="sm" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ReviewList;
