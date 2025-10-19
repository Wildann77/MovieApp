import React from 'react';
import { IconStar } from '@tabler/icons-react';

const ReviewRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <IconStar
        key={i}
        className={`h-3 w-3 ${
          i < rating ? "text-yellow-500 fill-current" : "text-muted-foreground"
        }`}
      />
    ))}
    <span className="text-sm ml-1">{rating}/5</span>
  </div>
);

export default ReviewRating;
