import React from 'react';
import { Separator } from '../ui/separator';
import { cn } from '../../lib/utils';

const FormSection = ({
  title,
  description,
  children,
  className = "",
  showSeparator = true,
  ...props
}) => {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-primary rounded-full"></div>
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        {children}
      </div>
      
      {showSeparator && <Separator />}
    </div>
  );
};

export default FormSection;
