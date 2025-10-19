import React from 'react';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { Checkbox } from '../../../ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu';
import { 
  IconEdit, 
  IconTrash, 
  IconDotsVertical
} from '@tabler/icons-react';

const MasterDataTable = ({ 
  items, 
  pagination, 
  onPageChange, 
  onEdit, 
  onDelete, 
  selectedItems, 
  onSelectAll, 
  onSelectItem,
  hasPhoto,
  fields,
  entityName,
  entityNamePlural,
  icon: Icon
}) => {
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];
  
  // Debug logging
  console.log('🔍 MasterDataTable Debug:', {
    items,
    itemsType: typeof items,
    itemsIsArray: Array.isArray(items),
    safeItems,
    safeItemsLength: safeItems.length,
    entityName,
    entityNamePlural
  });
  
  const allSelected = safeItems.length > 0 && selectedItems.length === safeItems.length;
  const someSelected = selectedItems.length > 0 && selectedItems.length < safeItems.length;

  return (
    <div className="w-full space-y-4">
      {/* Selection Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-2 py-1">
            {selectedItems.length} selected
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground hidden sm:block">
          Use filters above to search and filter {entityNamePlural.toLowerCase()}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold whitespace-nowrap w-12">
                  <Checkbox
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onCheckedChange={onSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                {hasPhoto && (
                  <TableHead className="font-semibold whitespace-nowrap w-16">
                    Photo
                  </TableHead>
                )}
                <TableHead className="font-semibold whitespace-nowrap">
                  Name
                </TableHead>
                {fields.includes('bio') && (
                  <TableHead className="font-semibold whitespace-nowrap">
                    Bio
                  </TableHead>
                )}
                {fields.includes('description') && (
                  <TableHead className="font-semibold whitespace-nowrap">
                    Description
                  </TableHead>
                )}
                <TableHead className="font-semibold whitespace-nowrap">
                  Created
                </TableHead>
                <TableHead className="text-right font-semibold whitespace-nowrap">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeItems?.length ? (
                safeItems.map((item) => (
                  <TableRow
                    key={item._id}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="py-4">
                      <Checkbox
                        checked={selectedItems.includes(item._id)}
                        onCheckedChange={(checked) => onSelectItem(item._id, checked)}
                        aria-label="Select row"
                      />
                    </TableCell>
                    {hasPhoto && (
                      <TableCell className="py-4">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          {item.photo ? (
                            <img 
                              src={item.photo} 
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="py-4">
                      <div className="font-medium max-w-[200px] truncate" title={item.name}>
                        {item.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {item._id.slice(-6)}
                      </div>
                    </TableCell>
                    {fields.includes('bio') && (
                      <TableCell className="py-4">
                        <div className="text-sm max-w-[200px] truncate" title={item.bio}>
                          {item.bio}
                        </div>
                      </TableCell>
                    )}
                    {fields.includes('description') && (
                      <TableCell className="py-4">
                        <div className="text-sm max-w-[200px] truncate" title={item.description}>
                          {item.description}
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="py-4">
                      <div className="text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <IconDotsVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => navigator.clipboard.writeText(item._id)}
                            >
                              Copy {entityName} ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEdit(item)}>
                              <IconEdit className="mr-2 h-4 w-4" />
                              Edit {entityName.toLowerCase()}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => onDelete(item._id, item.name)}
                            >
                              <IconTrash className="mr-2 h-4 w-4" />
                              Delete {entityName.toLowerCase()}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={hasPhoto ? 7 : 6}
                    className="h-24 text-center"
                  >
                    <div className="flex flex-col items-center justify-center py-8">
                      <Icon className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No {entityNamePlural.toLowerCase()} found.</p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or create a new {entityName.toLowerCase()}.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
        <div className="text-sm text-muted-foreground">
          <span className="hidden sm:inline">
            Showing {((pagination?.currentPage || 1) - 1) * (pagination?.itemsPerPage || 10) + 1} to{" "}
            {Math.min((pagination?.currentPage || 1) * (pagination?.itemsPerPage || 10), pagination?.totalItems || 0)} of{" "}
            {pagination?.totalItems || 0} {entityNamePlural.toLowerCase()}
          </span>
          <span className="sm:hidden">
            {pagination?.totalItems || 0} {entityNamePlural.toLowerCase()} total
          </span>
        </div>
        <div className="flex items-center justify-center sm:justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange && onPageChange((pagination?.currentPage || 1) - 1)}
            disabled={!pagination || pagination.currentPage <= 1}
            className="touch-manipulation"
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium">
              {pagination?.currentPage || 1} / {pagination?.totalPages || 1}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange && onPageChange((pagination?.currentPage || 1) + 1)}
            disabled={!pagination || pagination.currentPage >= pagination.totalPages}
            className="touch-manipulation"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MasterDataTable;

