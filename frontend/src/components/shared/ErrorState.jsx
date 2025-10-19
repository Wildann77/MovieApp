import React from 'react';
import { Button } from '../ui/button';

const ErrorState = ({ 
  title = "Error", 
  message = "Something went wrong", 
  onRetry, 
  retryText = "Try Again",
  icon = "⚠️",
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="text-destructive text-6xl mb-4">{icon}</div>
      <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground mb-4 text-center max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="bg-primary text-primary-foreground">
          {retryText}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
