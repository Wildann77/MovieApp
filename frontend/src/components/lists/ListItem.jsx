import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { IconUser, IconTrash } from '@tabler/icons-react';
import { cn } from '../../lib/utils';

const ListItem = ({
  item,
  isSelected = false,
  onSelect,
  onDelete,
  isDeleting = false,
  showAvatar = true,
  showDelete = true,
  avatarFallback = <IconUser className="h-6 w-6" />,
  className = "",
  children,
  ...props
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(item);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(item);
    }
  };

  const displayName = item.name || item.title || item.label || 'Unknown';
  const description = item.description || item.bio || item.subtitle || '';
  const photo = item.photo || item.image || item.avatar;

  return (
    <div
      className={cn(
        "p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm group border",
        isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border hover:border-primary/50 hover:bg-muted/50",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <div className="flex gap-3">
        {showAvatar && (
          <Avatar className="h-12 w-12">
            <AvatarImage src={photo} alt={displayName} />
            <AvatarFallback>
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        )}
        
        {!showAvatar && children}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm truncate">
              {displayName}
            </h3>
            {isSelected && (
              <Badge variant="secondary" className="text-xs">
                Selected
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>
          )}
        </div>
        
        {showDelete && onDelete && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
              title="Delete item"
            >
              <IconTrash className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default ListItem;
