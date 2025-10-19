import React from 'react';
import { Badge } from '../ui/badge';
import { IconSparkles } from '@tabler/icons-react';
import { cn } from '../../lib/utils';

const PageHeader = ({
  title,
  description,
  icon,
  badges = [],
  count,
  className = "",
  ...props
}) => {
  return (
    <div className={cn("flex flex-col gap-3 sm:gap-4", className)} {...props}>
      <div className="flex items-center gap-2 sm:gap-3">
        {icon && (
          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight leading-tight">{title}</h1>
          {description && (
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        {badges.map((badge, index) => (
          <Badge key={index} variant={badge.variant || "secondary"} className="gap-1 text-xs sm:text-sm">
            {badge.icon}
            {badge.text}
          </Badge>
        ))}
        
        {count !== undefined && (
          <Badge variant="outline" className="text-xs sm:text-sm">{count} items</Badge>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
