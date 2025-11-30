import React from 'react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';
import Loader from '../kokonutui/loader';

const LoadingBoundary = ({
  isLoading,
  loadingText = 'Loading...',
  loadingSubtext = 'Please wait while we fetch the data',
  size = 'md',
  fullScreen = false,
  children,
  className = '',
  ...props
}) => {
  if (!isLoading) {
    return children;
  }

  const content = (
    <div className={cn(
      "flex items-center justify-center",
      fullScreen ? "min-h-screen" : "min-h-[200px]",
      className
    )} {...props}>
      <div className="text-center space-y-4">
        <Loader 
          title={loadingText}
          subtitle={loadingSubtext}
          size={size}
        />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-8">
        {content}
      </CardContent>
    </Card>
  );
};

export default LoadingBoundary;
