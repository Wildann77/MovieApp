import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { IconSearch, IconChevronDown } from '@tabler/icons-react';
import { cn } from '../../lib/utils';

const FormSelect = ({
  label,
  error,
  required = false,
  options = [],
  value = "",
  onChange,
  searchable = false,
  searchValue = "",
  onSearchChange,
  placeholder = "Select an option",
  emptyMessage = "No options found",
  className = "",
  containerClassName = "",
  ...props
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filteredOptions, setFilteredOptions] = React.useState(options);

  React.useEffect(() => {
    if (searchable && searchValue) {
      const filtered = options.filter(option =>
        option.label?.toLowerCase().includes(searchValue.toLowerCase()) ||
        option.value?.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [options, searchValue, searchable]);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue) => {
    onChange?.(optionValue);
    setIsOpen(false);
    if (onSearchChange) {
      onSearchChange("");
    }
  };

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <Label className="text-sm font-medium flex items-center gap-2">
          {required && <span className="text-destructive">*</span>}
          {label}
        </Label>
      )}
      
      <div className="relative">
        <div
          className={cn(
            "flex items-center justify-between w-full p-3 border border-input rounded-md cursor-pointer hover:border-primary/50 transition-colors",
            error && "border-destructive",
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={cn(
            "text-sm",
            !selectedOption && "text-muted-foreground"
          )}>
            {selectedOption?.label || placeholder}
          </span>
          <IconChevronDown className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )} />
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {searchable && (
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search options..."
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="pl-10"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
            
            <div className="py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors",
                      value === option.value && "bg-primary/10 text-primary font-medium"
                    )}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {emptyMessage}
                </div>
              )}
            </div>
          </div>
        )}
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

export default FormSelect;
