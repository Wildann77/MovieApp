import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

const FormInput = ({
  label,
  error,
  required = false,
  icon,
  className = "",
  containerClassName = "",
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
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          className={cn(
            icon && "pl-10",
            error && "border-destructive focus:border-destructive",
            className
          )}
          {...(register ? register : {})}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
