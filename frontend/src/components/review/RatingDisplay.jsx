import React from 'react';
import { Star } from 'lucide-react';

const RatingDisplay = ({ 
    rating, 
    totalReviews, 
    showCount = true, 
    size = 'md',
    interactive = false,
    onRatingClick 
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8'
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= Math.floor(rating);
            const isHalfFilled = starValue === Math.ceil(rating) && rating % 1 !== 0;
            
            return (
                <button
                    key={index}
                    type="button"
                    className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                    onClick={() => interactive && onRatingClick?.(starValue)}
                    disabled={!interactive}
                >
                    <Star
                        className={`${sizeClasses[size]} ${
                            isFilled
                                ? 'text-yellow-400 fill-current'
                                : isHalfFilled
                                ? 'text-yellow-400 fill-current opacity-50'
                                : 'text-muted-foreground'
                        }`}
                    />
                </button>
            );
        });
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                {renderStars()}
            </div>
            {showCount && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
                    {totalReviews > 0 && (
                        <span className="text-muted-foreground">
                            ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default RatingDisplay;
