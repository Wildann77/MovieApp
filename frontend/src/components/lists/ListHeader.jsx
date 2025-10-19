import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { IconPlus, IconSparkles } from '@tabler/icons-react';
import { cn } from '../../lib/utils';

const ListHeader = ({
  title,
  description,
  icon,
  count,
  onAdd,
  addText = "New",
  showAdd = true,
  badges = [],
  className = "",
  ...props
}) => {
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {badges.map((badge, index) => (
          <Badge key={index} variant={badge.variant || "secondary"} className="gap-1">
            {badge.icon && <badge.icon className="h-3 w-3" />}
            {badge.text}
          </Badge>
        ))}
        
        {count !== undefined && (
          <Badge variant="outline">{count} items</Badge>
        )}
        
        {showAdd && onAdd && (
          <Button
            onClick={onAdd}
            size="sm"
            className="gap-2"
          >
            <IconPlus className="h-4 w-4" />
            {addText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ListHeader;
