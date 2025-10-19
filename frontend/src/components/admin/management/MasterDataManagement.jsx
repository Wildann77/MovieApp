import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Skeleton } from '../../ui/skeleton';
import { Separator } from '../../ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../ui/select';
import { 
  IconPlus, 
  IconSearch,
  IconFilter,
  IconSortAscending,
  IconClearAll,
  IconRefresh,
  IconLoader2,
  IconSparkles,
  IconLock
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { useOptimizedSearch } from '../../../hooks/useOptimizedSearch';
import MasterDataTable from './shared/MasterDataTable';
import MasterDataForm from './shared/MasterDataForm';

const MasterDataManagement = ({ 
  entityName, 
  entityNamePlural, 
  icon: Icon, 
  hooks, 
  fields = ['name', 'bio'],
  searchPlaceholder = `Search ${entityNamePlural}...`,
  hasPhoto = false,
  photoEndpoint = null,
  displayName = entityName,
  displayNamePlural = entityNamePlural,
  mode = 'admin', // 'admin' or 'dashboard'
  sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'createdAt', label: 'Date Created' },
    { value: 'updatedAt', label: 'Last Updated' }
  ]
}) => {
  // Use optimized search hook for smooth search experience
  const { 
    searchInput, 
    debouncedSearch, 
    isTyping, 
    handleSearchChange, 
    clearSearch 
  } = useOptimizedSearch(300);

  const [searchParams, setSearchParams] = useState({
    search: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [createPhotoUrl, setCreatePhotoUrl] = useState("");
  const [editPhotoUrl, setEditPhotoUrl] = useState("");

  // ZERO LAG memoized searchParams - absolutely minimal
  const memoizedSearchParams = useMemo(() => searchParams, [
    searchParams.search,
    searchParams.page,
    searchParams.limit,
    searchParams.sortBy,
    searchParams.sortOrder
  ]);

  // Use the provided hooks
  const {
    data: items,
    isLoading,
    error,
    refetch
  } = hooks.useGet(memoizedSearchParams);

  const createMutation = hooks.useCreate();
  const updateMutation = hooks.useUpdate();
  const deleteMutation = hooks.useDelete();

  // Helper function to get the correct data structure based on mode
  const getItemsData = useCallback(() => {
    try {
      if (mode === 'admin') {
        // For admin mode, setelah axios interceptor, data structure menjadi: { data: { actors: [...], pagination: {...} }, pagination: {...} }
        // atau langsung { actors: [...], pagination: {...} } jika tidak ada pagination
        
        // Check if items.data exists and is an object
        if (items?.data && typeof items.data === 'object' && !Array.isArray(items.data)) {
          const entityKey = entityNamePlural.toLowerCase();
          const entityData = items.data[entityKey];
          
          // Ensure we return an array
          if (Array.isArray(entityData)) {
            return entityData;
          }
          
          // If entityData is not an array, try to extract array from it
          if (entityData && typeof entityData === 'object') {
            // Check if it has a data property that might be an array
            if (Array.isArray(entityData.data)) {
              return entityData.data;
            }
          }
        }
        
        // Fallback untuk format lama
        const entityKey = entityNamePlural.toLowerCase();
        const fallbackData = items?.[entityKey];
        
        if (Array.isArray(fallbackData)) {
          return fallbackData;
        }
        
        // Last resort - check if items itself is an array
        if (Array.isArray(items)) {
          return items;
        }
        
        return [];
      } else {
        // For dashboard mode, data structure is: { data: [...], pagination: {...} } atau langsung [...]
        const dashboardData = items?.data || items;
        
        if (Array.isArray(dashboardData)) {
          return dashboardData;
        }
        
        return [];
      }
    } catch (error) {
      console.error('Error in getItemsData:', error);
      return [];
    }
  }, [items, mode, entityNamePlural]);

  const getPaginationData = useCallback(() => {
    if (mode === 'admin') {
      // For admin mode, pagination bisa ada di items.pagination atau items.data.pagination
      if (items?.pagination) {
        return items.pagination;
      }
      if (items?.data && typeof items.data === 'object' && items.data.pagination) {
        return items.data.pagination;
      }
      return items?.pagination || {};
    } else {
      // For dashboard mode, pagination ada di items.pagination
      return items?.pagination || {};
    }
  }, [items, mode]);

  // Debug logging - moved after helper functions are defined
  console.log(`🔍 ${entityName} MasterDataManagement Debug:`, {
    searchParams: memoizedSearchParams,
    items,
    isLoading,
    error,
    mode,
    entityNamePlural,
    // Actual data structure after axios interceptor
    itemsData: getItemsData(),
    itemsDataLength: getItemsData().length,
    itemsDataIsArray: Array.isArray(getItemsData()),
    itemsPagination: getPaginationData(),
    // Raw items structure for debugging
    rawItems: items,
    itemsType: typeof items,
    itemsDataType: typeof items?.data,
    itemsDataIsArray: Array.isArray(items?.data)
  });

  // Update search params when debounced search changes
  React.useEffect(() => {
    setSearchParams(prev => ({
      ...prev,
      search: debouncedSearch,
      page: 1 // Reset to first page when searching
    }));
  }, [debouncedSearch]);

  const handlePageChange = useCallback((newPage) => {
    setSearchParams(prev => ({ ...prev, page: newPage }));
  }, []);

  const handleSortChange = useCallback((sortBy) => {
    setSearchParams(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1
    }));
  }, []);

  const handleLimitChange = useCallback((limit) => {
    setSearchParams(prev => ({ ...prev, limit: parseInt(limit), page: 1 }));
  }, []);

  const handleCreate = useCallback(async (formData) => {
    try {
      const dataToSubmit = hasPhoto ? { ...formData, photo: createPhotoUrl } : formData;
      await createMutation.mutateAsync(dataToSubmit);
      setIsCreateModalOpen(false);
      setCreatePhotoUrl("");
      toast.success(`${entityName} created successfully!`);
      refetch();
    } catch (error) {
      toast.error(`Failed to create ${entityName.toLowerCase()}: ${error.message}`);
    }
  }, [createMutation, entityName, hasPhoto, createPhotoUrl, refetch]);

  const handleUpdate = useCallback(async (formData) => {
    try {
      const dataToSubmit = hasPhoto ? { ...formData, photo: editPhotoUrl } : formData;
      await updateMutation.mutateAsync({ id: editingItem._id, data: dataToSubmit });
      setEditingItem(null);
      setEditPhotoUrl("");
      toast.success(`${entityName} updated successfully!`);
      refetch();
    } catch (error) {
      toast.error(`Failed to update ${entityName.toLowerCase()}: ${error.message}`);
    }
  }, [updateMutation, entityName, editingItem, hasPhoto, editPhotoUrl, refetch]);

  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    // Initialize editPhotoUrl with existing photo when editing
    if (hasPhoto && item.photo) {
      setEditPhotoUrl(item.photo);
    } else {
      setEditPhotoUrl("");
    }
  }, [hasPhoto]);

  const handleDelete = useCallback(async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success(`${entityName} deleted successfully!`);
        refetch();
      } catch (error) {
        toast.error(`Failed to delete ${entityName.toLowerCase()}: ${error.message}`);
      }
    }
  }, [deleteMutation, entityName, refetch]);

  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      const itemsData = getItemsData();
      if (Array.isArray(itemsData)) {
        setSelectedItems(itemsData.map(item => item._id) || []);
      } else {
        setSelectedItems([]);
      }
    } else {
      setSelectedItems([]);
    }
  }, [getItemsData]);

  const handleSelectItem = useCallback((id, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  }, []);

  const handleBulkDelete = useCallback(async () => {
    if (selectedItems.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} ${entityNamePlural.toLowerCase()}? This action cannot be undone.`)) {
      try {
        await Promise.all(selectedItems.map(id => deleteMutation.mutateAsync(id)));
        setSelectedItems([]);
        toast.success(`${selectedItems.length} ${entityNamePlural.toLowerCase()} deleted successfully!`);
        refetch();
      } catch (error) {
        toast.error(`Failed to delete ${entityNamePlural.toLowerCase()}: ${error.message}`);
      }
    }
  }, [selectedItems, deleteMutation, entityNamePlural, refetch]);

  const handleRefresh = useCallback(() => {
    refetch();
    toast.success(`${displayNamePlural} refreshed!`);
  }, [refetch, displayNamePlural]);

  const handleClearFilters = useCallback(() => {
    setSearchParams({
      search: "",
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc"
    });
    clearSearch();
    toast.success("Filters cleared!");
  }, [clearSearch]);

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading {entityNamePlural.toLowerCase()}</p>
            <Button onClick={refetch} variant="outline">
              <IconRefresh className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                {displayNamePlural} Management
                {mode === 'dashboard' && (
                  <Badge variant="secondary" className="ml-2">
                    <IconSparkles className="h-3 w-3 mr-1" />
                    Dashboard
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Manage {displayNamePlural.toLowerCase()} in your system
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <IconRefresh className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                size="sm"
              >
                <IconPlus className="mr-2 h-4 w-4" />
                Add {displayName}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
                {isTyping && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <IconLoader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select
                value={searchParams.sortBy}
                onValueChange={handleSortChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Items per page */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Items per page</label>
              <Select
                value={searchParams.limit.toString()}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <div className="flex gap-2">
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <IconClearAll className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                {selectedItems.length > 0 && (
                  <Button
                    onClick={handleBulkDelete}
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                  >
                    Delete ({selectedItems.length})
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <MasterDataTable
              items={getItemsData()}
              pagination={getPaginationData()}
              onPageChange={handlePageChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
              selectedItems={selectedItems}
              onSelectAll={handleSelectAll}
              onSelectItem={handleSelectItem}
              hasPhoto={hasPhoto}
              fields={fields}
              entityName={entityName}
              entityNamePlural={entityNamePlural}
              icon={Icon}
            />
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <MasterDataForm
          entityName={entityName}
          entityNamePlural={entityNamePlural}
          fields={fields}
          onSubmit={handleCreate}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setCreatePhotoUrl("");
          }}
          isLoading={createMutation.isPending}
          hasPhoto={hasPhoto}
          photoUrl={createPhotoUrl}
          setPhotoUrl={setCreatePhotoUrl}
          photoEndpoint={photoEndpoint}
          icon={Icon}
        />
      )}

      {/* Edit Modal */}
      {editingItem && (
        <MasterDataForm
          entityName={entityName}
          entityNamePlural={entityNamePlural}
          fields={fields}
          initialData={editingItem}
          onSubmit={handleUpdate}
          onCancel={() => {
            setEditingItem(null);
            setEditPhotoUrl("");
          }}
          isLoading={updateMutation.isPending}
          hasPhoto={hasPhoto}
          photoUrl={editPhotoUrl}
          setPhotoUrl={setEditPhotoUrl}
          photoEndpoint={photoEndpoint}
          icon={Icon}
        />
      )}
    </div>
  );
};

export default MasterDataManagement;