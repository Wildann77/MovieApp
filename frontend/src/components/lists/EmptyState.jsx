import React from 'react';
import { Button } from '../ui/button';
import { IconSearch, IconPlus } from '@tabler/icons-react';
import { cn } from '../../lib/utils';

const EmptyState = ({
  message = "No items found",
  description = "Try adjusting your search or add a new item.",
  icon = IconSearch,
  actionText,
  onAction,
  className = "",
  ...props
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)} {...props}>
      <div className="p-4 bg-muted/50 rounded-full mb-4">
        {icon && <icon className="h-8 w-8 text-muted-foreground" />}
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{message}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      
      {actionText && onAction && (
        <Button onClick={onAction} className="gap-2">
          <IconPlus className="h-4 w-4" />
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
