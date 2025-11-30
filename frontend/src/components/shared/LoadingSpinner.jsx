import React from 'react';

const LoadingSpinner = ({ 
  size = 'default', 
  text = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    default: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]} mb-4`}></div>
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
