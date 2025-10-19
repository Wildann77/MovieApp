import React from 'react';
import { PageLayout, PageHeader, TwoColumnLayout } from '@/components/layouts';
import { ConfirmDialog } from '@/components/shared';
import useConfirmDialog from '@/hooks/ui/useConfirmDialog';
import useMasterDataForm from '@/hooks/forms/useMasterDataForm';
import MasterDataList from './MasterDataList';
import MasterDataForm from './MasterDataForm';
import { IconSparkles, IconLock } from '@tabler/icons-react';

const MasterDataLayout = ({ config }) => {
  const masterDataForm = useMasterDataForm(config);
  const confirmDialog = useConfirmDialog();

  const {
    // Form state
    register,
    handleSubmit,
    errors,
    isEditing,
    selectedItem,
    photoUrl,
    setPhotoUrl,
    
    // Search
    searchValue,
    handleSearchChange,
    filteredItems,
    
    // CRUD operations
    items,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    
    // Handlers
    handleItemSelect,
    handleNewItem,
    handleDeleteItem,
    onSubmit,
  } = masterDataForm;

  const pageHeaderBadges = [
    {
      icon: <IconSparkles className="h-3 w-3" />,
      text: `My ${config.displayName} Database`,
      variant: "secondary"
    },
    {
      icon: <IconLock className="h-3 w-3" />,
      text: "Personal",
      variant: "outline"
    }
  ];

  return (
    <>
      <PageLayout>
        {/* Page Header */}
        <PageHeader
          title={`My ${config.displayNamePlural} Management`}
          description={`Create and manage your personal ${config.displayNamePlural.toLowerCase()} with ${config.hasPhoto ? 'photos and ' : ''}biographies`}
          icon={<config.icon className="h-6 w-6 text-primary" />}
          badges={pageHeaderBadges}
          count={filteredItems.length}
        />

        {/* Main Content */}
        <TwoColumnLayout
          leftContent={
            <MasterDataList
              config={config}
              items={filteredItems}
              isLoading={isLoading}
              searchValue={searchValue}
              onSearchChange={handleSearchChange}
              selectedItem={selectedItem}
              onItemSelect={handleItemSelect}
              onDeleteItem={handleDeleteItem}
              isDeleting={isDeleting}
              onNewItem={handleNewItem}
            />
          }
          rightContent={
            <MasterDataForm
              config={config}
              register={register}
              handleSubmit={handleSubmit}
              errors={errors}
              isEditing={isEditing}
              selectedItem={selectedItem}
              photoUrl={photoUrl}
              setPhotoUrl={setPhotoUrl}
              onSubmit={onSubmit}
              onDeleteItem={handleDeleteItem}
              onNewItem={handleNewItem}
              isCreating={isCreating}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          }
        />
      </PageLayout>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.dialogConfig.title}
        message={confirmDialog.dialogConfig.message}
        confirmText={confirmDialog.dialogConfig.confirmText}
        cancelText={confirmDialog.dialogConfig.cancelText}
        onConfirm={confirmDialog.handleConfirm}
        onCancel={confirmDialog.handleCancel}
        variant={confirmDialog.dialogConfig.variant || "destructive"}
      />
    </>
  );
};

export default MasterDataLayout;
