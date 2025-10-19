import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { IconSearch, IconX, IconCheck, IconPlus, IconLoader2 } from '@tabler/icons-react';

const SearchSelect = ({
  searchValue,
  onSearchChange,
  options = [],
  selectedItems = [],
  onSelect,
  onRemove,
  placeholder = "Search...",
  displayKey = "name",
  descriptionKey,
  icon: Icon = IconPlus,
  multiSelect = false,
  maxHeight = "max-h-48",
  className = "",
  isLoading = false,
  isFetching = false
}) => {
  const handleItemClick = (item) => {
    if (multiSelect) {
      onSelect(item._id);
    } else {
      onSelect(item._id);
    }
  };

  const isSelected = (itemId) => {
    if (multiSelect) {
      return selectedItems.some(item => item._id === itemId);
    }
    return selectedItems === itemId;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-12 h-12 border-2 border-input focus:border-primary focus:ring-primary rounded-lg text-lg font-medium transition-all duration-200"
        />
        {/* Loading indicator */}
        {(isLoading || isFetching) && (
          <IconLoader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary animate-spin" />
        )}
      </div>

      {/* Selected Items Display */}
      {multiSelect && selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          {selectedItems.map((item) => (
            <span key={item._id} className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {item[displayKey]}
              <button
                type="button"
                onClick={() => onRemove(item._id)}
                className="text-primary/70 hover:text-primary"
              >
                <IconX className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {!multiSelect && selectedItems && (
        <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{selectedItems[displayKey]}</p>
              {descriptionKey && selectedItems[descriptionKey] && (
                <p className="text-sm text-muted-foreground">{selectedItems[descriptionKey]}</p>
              )}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove("")}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <IconX className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Search Results */}
      {searchValue && (
        <>
          {/* Loading state */}
          {(isLoading || isFetching) && (
            <div className="p-4 text-center text-muted-foreground border border-border rounded-lg bg-card">
              <div className="flex items-center justify-center gap-2">
                <IconLoader2 className="h-4 w-4 animate-spin" />
                <span>Searching...</span>
              </div>
            </div>
          )}
          
          {/* Results */}
          {!isLoading && !isFetching && options.length > 0 && (
            <div className={`${maxHeight} overflow-y-auto border border-border rounded-lg bg-card`}>
              {options.map((option) => (
                <div
                  key={option._id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleItemClick(option);
                  }}
                  className={`p-3 cursor-pointer hover:bg-primary/5 transition-colors border-b border-border last:border-b-0 ${
                    isSelected(option._id) ? "bg-primary/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{option[displayKey]}</p>
                      {descriptionKey && option[descriptionKey] && (
                        <p className="text-sm text-muted-foreground line-clamp-1">{option[descriptionKey]}</p>
                      )}
                    </div>
                    {isSelected(option._id) && (
                      <IconCheck className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* No results */}
          {!isLoading && !isFetching && options.length === 0 && (
            <div className="p-4 text-center text-muted-foreground border border-border rounded-lg bg-card">
              <div className="flex flex-col items-center gap-2">
                <span>No items found matching "{searchValue}"</span>
                {searchValue.length < 3 && (
                  <span className="text-xs text-muted-foreground/70">
                    Type at least 3 characters to search
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchSelect;
