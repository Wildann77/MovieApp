import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { IconSparkles } from '@tabler/icons-react';
import { cn } from '../../lib/utils';
import SearchBar from './SearchBar';
import EmptyState from './EmptyState';

const ListContainer = ({
  title,
  description,
  icon,
  items = [],
  isLoading = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  emptyMessage = "No items found",
  emptyDescription = "Try adjusting your search or add a new item.",
  children,
  className = "",
  headerActions,
  count,
  ...props
}) => {
  return (
    <Card className={cn("h-fit bg-card", className)} {...props}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
                {icon}
              </div>
            )}
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              {description && (
                <CardDescription className="text-sm">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {count !== undefined && (
              <Badge variant="outline">{count} items</Badge>
            )}
            {headerActions}
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4">
        <div className="space-y-4">
          {onSearchChange && (
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              message={emptyMessage}
              description={emptyDescription}
            />
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {children || items.map((item, index) => (
                <div key={item.id || index} className="p-3 rounded-lg border border-border">
                  {typeof item === 'string' ? item : JSON.stringify(item)}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListContainer;
