import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { IconX, IconUser } from '@tabler/icons-react';
import { cn } from '../../lib/utils';

const PhotoPreview = ({
  src,
  alt = "Photo preview",
  size = "h-32 w-32",
  showRemove = true,
  onRemove,
  className = "",
  fallbackIcon: FallbackIcon = IconUser,
  ...props
}) => {
  if (!src) return null;

  return (
    <div className={cn("relative inline-block group", className)} {...props}>
      <Avatar className={cn("border-4 border-white shadow-lg", size)}>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>
          <FallbackIcon className="h-16 w-16" />
        </AvatarFallback>
      </Avatar>
      
      {showRemove && onRemove && (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0 shadow-lg hover:scale-110 transition-transform"
          onClick={onRemove}
        >
          <IconX className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default PhotoPreview;
