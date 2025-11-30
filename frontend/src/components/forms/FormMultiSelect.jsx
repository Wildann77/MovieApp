import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { IconSearch, IconChevronDown, IconX } from '@tabler/icons-react';
import { cn } from '../../lib/utils';

const FormMultiSelect = ({
  label,
  error,
  required = false,
  options = [],
  value = [],
  onChange,
  searchable = false,
  searchValue = "",
  onSearchChange,
  placeholder = "Select options",
  emptyMessage = "No options found",
  maxDisplay = 3,
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

  const selectedOptions = options.filter(option => value.includes(option.value));

  const handleToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange?.(newValue);
  };

  const handleRemove = (optionValue) => {
    const newValue = value.filter(v => v !== optionValue);
    onChange?.(newValue);
  };

  const displayText = selectedOptions.length > 0 
    ? `${selectedOptions.length} selected`
    : placeholder;

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <Label className="text-sm font-medium flex items-center gap-2">
          {required && <span className="text-destructive">*</span>}
          {label}
        </Label>
      )}
      
      <div className="space-y-2">
        {/* Selected Items */}
        {selectedOptions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedOptions.slice(0, maxDisplay).map((option) => (
              <Badge key={option.value} variant="secondary" className="gap-1">
                {option.label}
                <button
                  type="button"
                  onClick={() => handleRemove(option.value)}
                  className="ml-1 hover:text-destructive"
                >
                  <IconX className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedOptions.length > maxDisplay && (
              <Badge variant="outline">
                +{selectedOptions.length - maxDisplay} more
              </Badge>
            )}
          </div>
        )}

        {/* Selector */}
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
              selectedOptions.length === 0 && "text-muted-foreground"
            )}>
              {displayText}
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
                  filteredOptions.map((option) => {
                    const isSelected = value.includes(option.value);
                    return (
                      <div
                        key={option.value}
                        className={cn(
                          "px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors flex items-center gap-2",
                          isSelected && "bg-primary/10 text-primary font-medium"
                        )}
                        onClick={() => handleToggle(option.value)}
                      >
                        <div className={cn(
                          "w-4 h-4 border rounded flex items-center justify-center",
                          isSelected && "bg-primary border-primary text-primary-foreground"
                        )}>
                          {isSelected && <span className="text-xs">✓</span>}
                        </div>
                        {option.label}
                      </div>
                    );
                  })
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    {emptyMessage}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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

export default FormMultiSelect;
