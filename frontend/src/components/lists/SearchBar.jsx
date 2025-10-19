import React from 'react';
import { Input } from '../ui/input';
import { IconSearch } from '@tabler/icons-react';
import { cn } from '../../lib/utils';

const SearchBar = ({
  value = "",
  onChange,
  placeholder = "Search...",
  className = "",
  ...props
}) => {
  return (
    <div className={cn("relative", className)}>
      <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="pl-10"
        {...props}
      />
    </div>
  );
};

export default SearchBar;
