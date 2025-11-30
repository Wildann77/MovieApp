import React from 'react';
import { cn } from '../../lib/utils';

const TwoColumnLayout = ({
  leftContent,
  rightContent,
  leftClassName = "",
  rightClassName = "",
  className = "",
  ...props
}) => {
  return (
    <div className={cn("flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6", className)} {...props}>
      <div className={cn("lg:col-span-1 order-2 lg:order-1", leftClassName)}>
        {leftContent}
      </div>
      
      <div className={cn("lg:col-span-2 order-1 lg:order-2", rightClassName)}>
        {rightContent}
      </div>
    </div>
  );
};

export default TwoColumnLayout;
