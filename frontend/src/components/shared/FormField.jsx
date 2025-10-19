import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

const FormField = ({
  label,
  error,
  required = false,
  icon,
  children,
  className = ""
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <Label
        htmlFor={label?.toLowerCase().replace(/\s+/g, '-')}
        className="text-sm font-semibold text-foreground flex items-center gap-2"
      >
        <span className="w-2 h-2 bg-primary rounded-full"></span>
        {label} {required && '*'}
      </Label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
        {children}
      </div>
      
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
