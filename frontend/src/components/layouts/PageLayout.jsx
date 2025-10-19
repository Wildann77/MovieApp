import React from 'react';
import { cn } from '../../lib/utils';

const PageLayout = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={cn("min-h-screen bg-background p-2 sm:p-4 md:p-6", className)} {...props}>
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
