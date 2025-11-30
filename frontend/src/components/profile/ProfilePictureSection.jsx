import React from 'react';
import { IconUser, IconX } from '@tabler/icons-react';
import { Button } from '../ui/button';
import ImageUpload from '../shared/ImageUpload';

const ProfilePictureSection = ({
  profilePicture,
  setProfilePicture,
  isEditing,
  className = ""
}) => {
  return (
    <div className={`lg:col-span-1 ${className}`}>
      <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-6 rounded-xl border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <span className="p-2 bg-primary/10 rounded-lg">📸</span>
          Profile Picture
        </h3>

        <div className="flex flex-col items-center space-y-6">
          {profilePicture ? (
            <div className="relative group">
              <img
                src={profilePicture}
                alt="Profile picture"
                className="w-48 h-48 object-cover rounded-2xl border-4 border-white shadow-2xl transition-transform duration-300 group-hover:scale-105"
              />
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-3 -right-3 h-8 w-8 rounded-full p-0 shadow-lg hover:scale-110 transition-transform"
                  onClick={() => setProfilePicture("")}
                >
                  <IconX className="h-4 w-4" />
                </Button>
              )}
            </div>
          ) : (
            <div className="w-48 h-48 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl border-4 border-border shadow-2xl flex items-center justify-center">
              <IconUser className="h-24 w-24 text-muted-foreground" />
            </div>
          )}

          {isEditing && (
            <div className="w-full">
              <ImageUpload
                imageUrl={profilePicture}
                onImageChange={setProfilePicture}
                endpoint="userAvatar"
                placeholder="Upload profile picture"
                maxWidth="w-full"
                maxHeight="h-auto"
                showRemoveButton={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureSection;
