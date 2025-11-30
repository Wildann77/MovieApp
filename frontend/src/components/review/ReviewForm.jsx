import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
// Textarea component tidak ada, menggunakan textarea HTML biasa
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Star, Send } from 'lucide-react';
import { useCreateReview, useUpdateReview } from '../../hooks/use-reviews.jsx';
import { toast } from 'sonner';

const ReviewForm = ({ movieId, existingReview, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);

    const createReviewMutation = useCreateReview();
    const updateReviewMutation = useUpdateReview();

    const isLoading = createReviewMutation.isPending || updateReviewMutation.isPending;

    // Update form state when existingReview changes
    useEffect(() => {
        console.log('ReviewForm useEffect - existingReview:', existingReview); // Debug log
        if (existingReview) {
            setRating(existingReview.rating || 0);
            setComment(existingReview.comment || '');
            console.log('Setting form data - rating:', existingReview.rating, 'comment:', existingReview.comment); // Debug log
        } else {
            setRating(0);
            setComment('');
            console.log('Clearing form data'); // Debug log
        }
    }, [existingReview]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (rating < 1 || rating > 5) {
            toast.error('Rating must be between 1 and 5');
            return;
        }

        if (comment && comment.length > 500) {
            toast.error('Comment cannot exceed 500 characters');
            return;
        }

        try {
            if (existingReview) {
                console.log('Updating review:', { reviewId: existingReview._id, rating, comment }); // Debug log
                await updateReviewMutation.mutateAsync({
                    reviewId: existingReview._id,
                    reviewData: { rating, comment: comment.trim() }
                });
                toast.success('Review updated successfully');
            } else {
                console.log('Creating review:', { movieId, rating, comment }); // Debug log
                await createReviewMutation.mutateAsync({
                    movieId,
                    reviewData: { rating, comment: comment.trim() }
                });
                toast.success('Review created successfully');
            }
            
            // Reset form
            setRating(0);
            setComment('');
            onSuccess?.();
        } catch (error) {
            console.error('Review form error:', error); // Debug log
            const errorMessage = error.response?.data?.message || 'Something went wrong';
            toast.error(errorMessage);
        }
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= (hoveredRating || rating);
            
            return (
                <button
                    key={index}
                    type="button"
                    className={`p-1 transition-colors ${
                        isFilled ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400`}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(starValue)}
                    disabled={isLoading}
                >
                    <Star className="w-6 h-6 fill-current" />
                </button>
            );
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    {existingReview ? 'Edit Your Review' : 'Write a Review'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Rating Stars */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Rating:</span>
                        <div className="flex items-center gap-1">
                            {renderStars()}
                        </div>
                        {rating > 0 && (
                            <span className="text-sm text-muted-foreground">
                                ({rating}/5)
                            </span>
                        )}
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <label htmlFor="comment" className="text-sm font-medium">
                            Comment (optional)
                        </label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts about this movie..."
                            className="min-h-[100px] w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none bg-background text-foreground"
                            maxLength={500}
                            disabled={isLoading}
                        />
                        <div className="text-xs text-muted-foreground text-right">
                            {comment.length}/500 characters
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button 
                            type="submit" 
                            disabled={isLoading || rating === 0}
                            className="flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            {isLoading 
                                ? (existingReview ? 'Updating...' : 'Creating...') 
                                : (existingReview ? 'Update Review' : 'Submit Review')
                            }
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ReviewForm;
