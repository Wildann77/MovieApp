import React from 'react';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

const FormTextarea = ({
  label,
  error,
  required = false,
  className = "",
  containerClassName = "",
  minHeight = "120px",
  register,
  ...props
}) => {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <Label 
          htmlFor={props.id || props.name}
          className="text-sm font-medium flex items-center gap-2"
        >
          {required && <span className="text-destructive">*</span>}
          {label}
        </Label>
      )}
      
      <textarea
        className={cn(
          "w-full p-3 border border-input rounded-md resize-none focus:border-ring focus:ring-ring/50 focus:ring-[3px] text-sm transition-all duration-200",
          error && "border-destructive focus:border-destructive",
          className
        )}
        style={{ minHeight }}
        {...(register ? register : {})}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormTextarea;
