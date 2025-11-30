import React from 'react';
import { IconUsers, IconVideo, IconUserEdit, IconTag } from '@tabler/icons-react';
import MasterDataManagement from '../admin/management/MasterDataManagement';

/**
 * Reusable wrapper for Master Data Management
 * Works with both Dashboard (user's own data) and Admin (system-wide data) systems
 */
const MasterDataWrapper = ({ 
  mode = 'admin', // 'admin' or 'dashboard'
  entityType, // 'actor', 'director', 'writer', 'genre'
  hooks,
  ...props 
}) => {
  // Configuration for different entity types
  const entityConfigs = {
    actor: {
      entityName: 'Actor',
      entityNamePlural: 'Actors',
      icon: IconUsers,
      fields: ['name', 'bio'],
      hasPhoto: true,
      photoEndpoint: 'actorPhoto',
      searchPlaceholder: 'Search actors...'
    },
    director: {
      entityName: 'Director', 
      entityNamePlural: 'Directors',
      icon: IconVideo,
      fields: ['name', 'bio'],
      hasPhoto: true,
      photoEndpoint: 'directorPhoto',
      searchPlaceholder: 'Search directors...'
    },
    writer: {
      entityName: 'Writer',
      entityNamePlural: 'Writers', 
      icon: IconUserEdit,
      fields: ['name', 'bio'],
      hasPhoto: false,
      photoEndpoint: null,
      searchPlaceholder: 'Search writers...'
    },
    genre: {
      entityName: 'Genre',
      entityNamePlural: 'Genres',
      icon: IconTag,
      fields: ['name', 'description'],
      hasPhoto: false,
      photoEndpoint: null,
      searchPlaceholder: 'Search genres...'
    }
  };

  const config = entityConfigs[entityType];
  
  if (!config) {
    console.error(`❌ Invalid entityType: ${entityType}. Must be one of: ${Object.keys(entityConfigs).join(', ')}`);
    return (
      <div className="px-4 lg:px-6">
        <div className="p-4">
          <div className="text-red-600">Invalid entity type: {entityType}</div>
        </div>
      </div>
    );
  }

  if (!hooks) {
    console.error(`❌ hooks prop is required for MasterDataWrapper`);
    return (
      <div className="px-4 lg:px-6">
        <div className="p-4">
          <div className="text-red-600">Hooks configuration is missing</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6">
      <MasterDataManagement
        entityName={config.entityName}
        entityNamePlural={config.entityNamePlural}
        icon={config.icon}
        hooks={hooks}
        fields={config.fields}
        hasPhoto={config.hasPhoto}
        searchPlaceholder={config.searchPlaceholder}
        mode={mode}
        photoEndpoint={config.photoEndpoint}
        {...props}
      />
    </div>
  );
};

export default MasterDataWrapper;
