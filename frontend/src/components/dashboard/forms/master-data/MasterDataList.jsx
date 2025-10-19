import React from 'react';
import { ListContainer } from '@/components/lists';
import { ListItem } from '@/components/lists';
import { IconUser, IconTag, IconLock } from '@tabler/icons-react';

const MasterDataList = ({
  config,
  items = [],
  isLoading = false,
  searchValue = "",
  onSearchChange,
  selectedItem,
  onItemSelect,
  onDeleteItem,
  isDeleting = false,
  onNewItem,
  ...props
}) => {
  const getAvatarFallback = () => {
    if (config.hasPhoto) {
      return <IconUser className="h-6 w-6" />;
    }
    return <config.icon className="h-6 w-6 text-primary" />;
  };

  const getAvatarContent = (item) => {
    if (config.hasPhoto) {
      return null; // Will use photo from item
    }
    return (
      <div className="h-12 w-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg flex items-center justify-center border-2 border-border">
        <config.icon className="h-6 w-6 text-primary" />
      </div>
    );
  };

  return (
    <ListContainer
      title={`My ${config.displayName} Library`}
      description={`Browse and manage your ${config.displayNamePlural.toLowerCase()}`}
      icon={<config.icon className="h-5 w-5 text-primary" />}
      items={items}
      isLoading={isLoading}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={config.listConfig.searchPlaceholder}
      emptyMessage={config.listConfig.emptyMessage}
      emptyDescription={config.listConfig.emptyDescription}
      count={items.length}
      headerActions={
        <button
          onClick={onNewItem}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 gap-2 w-full sm:w-auto"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">New</span>
        </button>
      }
      {...props}
    >
      {items.map((item) => (
        <ListItem
          key={item._id}
          item={item}
          isSelected={selectedItem?._id === item._id}
          onSelect={onItemSelect}
          onDelete={onDeleteItem}
          isDeleting={isDeleting}
          showAvatar={true}
          avatarFallback={getAvatarFallback()}
          showOwnership={true}
        >
          {!config.hasPhoto && getAvatarContent(item)}
        </ListItem>
      ))}
    </ListContainer>
  );
};

export default MasterDataList;
