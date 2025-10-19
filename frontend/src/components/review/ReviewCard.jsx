import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Star, Heart, MoreHorizontal, Edit, Trash2, Flag, AlertTriangle } from 'lucide-react';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { useToggleReviewLike, useDeleteReview } from '../../hooks/use-reviews.jsx';
import { useReportReview } from '../../hooks/use-report-review';
import { useAuthContext } from '../../context/auth-provider';
import { toast } from 'sonner';
// Helper function untuk format waktu
const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
};

// Report Dialog Component
const ReportDialog = ({ isOpen, onClose, review, onSubmit }) => {
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
        if (reason.trim()) {
            onSubmit(review._id, reason.trim());
            setReason("");
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Report Review
                    </DialogTitle>
                    <DialogDescription>
                        Please provide a reason for reporting this review. This helps us understand the issue better.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                    {review?.user?.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">{review?.user?.username || "Unknown User"}</div>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-3 w-3 ${
                                                i < review?.rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-muted-foreground"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review?.comment}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Reason for reporting:</label>
                        <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Please describe why you're reporting this review..."
                            className="mt-2"
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleSubmit}
                        disabled={!reason.trim()}
                    >
                        <Flag className="h-4 w-4 mr-2" />
                        Report Review
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const ReviewCard = ({ review, onEdit, showMovie = false }) => {
    const { user } = useAuthContext();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [showReportDialog, setShowReportDialog] = useState(false);
    const [hasReported, setHasReported] = useState(false);

    const toggleLikeMutation = useToggleReviewLike();
    const deleteReviewMutation = useDeleteReview();
    const reportReviewMutation = useReportReview();

    const isOwner = user?.id === review.user._id;

    // Update like state when review or user changes
    useEffect(() => {
        if (review.likes && user?.id) {
            const userLiked = review.likes.some(like => {
                // Handle both populated and non-populated like objects
                if (typeof like === 'object' && like._id) {
                    return like._id === user.id;
                }
                return like === user.id;
            });
            setIsLiked(userLiked);
        } else {
            setIsLiked(false);
        }
        setLikeCount(review.likeCount || review.likes?.length || 0);
    }, [review.likes, review.likeCount, user?.id]);

    // Check if current user has reported this review
    useEffect(() => {
        if (review.reportedBy && user?.id) {
            const userReported = review.reportedBy.some(report => {
                // Handle both populated and non-populated report objects
                if (typeof report === 'object' && report.user) {
                    if (typeof report.user === 'object' && report.user._id) {
                        return report.user._id === user.id;
                    }
                    return report.user === user.id;
                }
                return false;
            });
            setHasReported(userReported);
        } else {
            setHasReported(false);
        }
    }, [review.reportedBy, user?.id]);

    const handleLike = async () => {
        if (!user) {
            toast.error('Please login to like reviews');
            return;
        }
        
        // Store original state for potential revert
        const originalLikedState = isLiked;
        const originalLikeCount = likeCount;
        
        // Optimistic update
        const newLikedState = !isLiked;
        const newLikeCount = newLikedState ? likeCount + 1 : Math.max(0, likeCount - 1);
        
        setIsLiked(newLikedState);
        setLikeCount(newLikeCount);
        
        try {
            const result = await toggleLikeMutation.mutateAsync(review._id);
            console.log('Like response:', result); // Debug log
            
            // Update state based on actual response
            if (result && result.data) {
                setIsLiked(result.data.liked);
                setLikeCount(result.data.likeCount);
            }
        } catch (error) {
            console.error('Like error:', error); // Debug log
            
            // Revert optimistic update on error
            setIsLiked(originalLikedState);
            setLikeCount(originalLikeCount);
            
            toast.error(error.response?.data?.message || 'Failed to update like');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await deleteReviewMutation.mutateAsync(review._id);
                toast.success('Review deleted successfully');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete review');
            }
        }
    };

    const handleReportReview = (reviewId, reason) => {
        reportReviewMutation.mutate({ reviewId, reason }, {
            onSuccess: () => {
                setHasReported(true);
                toast.success("Review reported successfully");
            }
        });
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => {
            const isFilled = index < rating;
            return (
                <Star
                    key={index}
                    className={`w-4 h-4 ${
                        isFilled ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
                    }`}
                />
            );
        });
    };

    return (
        <>
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarFallback>
                                {review.user.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm">
                                    {review.user.username}
                                </h4>
                                {review.isEdited && (
                                    <Badge variant="secondary" className="text-xs">
                                        Edited
                                    </Badge>
                                )}
                                {review.isReported && (
                                    <Badge variant="destructive" className="text-xs">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Reported
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                    {renderStars(review.rating)}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {formatTimeAgo(review.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Report Button - Show for non-owners */}
                        {!isOwner && user && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={hasReported ? undefined : () => setShowReportDialog(true)}
                                className={`h-8 w-8 p-0 transition-colors ${
                                    hasReported 
                                        ? "text-destructive cursor-default" 
                                        : "text-muted-foreground hover:text-destructive"
                                }`}
                                disabled={hasReported}
                                title={hasReported ? "You have already reported this review" : "Report this review"}
                            >
                                <Flag className={`w-4 h-4 ${hasReported ? "fill-current" : ""}`} />
                            </Button>
                        )}
                        
                        {/* Owner Menu */}
                        {isOwner && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onEdit?.(review)}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={handleDelete}
                                        className="text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {showMovie && (
                    <div className="mb-3 p-2 bg-muted rounded-md">
                        <p className="text-sm font-medium text-foreground">{review.movie?.title}</p>
                        <p className="text-xs text-muted-foreground">{review.movie?.year}</p>
                    </div>
                )}

                {review.comment && (
                    <p className="text-sm text-foreground mb-3 leading-relaxed">
                        {review.comment}
                    </p>
                )}

                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLike}
                        disabled={toggleLikeMutation.isPending}
                        className={`flex items-center gap-1 ${
                            isLiked ? 'text-red-500' : 'text-muted-foreground'
                        }`}
                    >
                        <Heart 
                            className={`w-4 h-4 ${
                                isLiked ? 'fill-current' : ''
                            }`} 
                        />
                        <span className="text-xs">{likeCount}</span>
                    </Button>

                    {review.isEdited && (
                        <span className="text-xs text-muted-foreground">
                            Edited {formatTimeAgo(review.editedAt)}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>

        <ReportDialog
            isOpen={showReportDialog}
            onClose={() => setShowReportDialog(false)}
            review={review}
            onSubmit={handleReportReview}
        />
    </>
    );
};

export default ReviewCard;
