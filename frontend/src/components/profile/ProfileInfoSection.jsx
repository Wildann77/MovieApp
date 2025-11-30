import React from 'react';
import { IconMail, IconEdit, IconDeviceFloppy as IconSave } from '@tabler/icons-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import FormField from '../shared/FormField';
import ActionButtons from '../shared/ActionButtons';
import InfoCard from '../shared/InfoCard';

const ProfileInfoSection = ({
  register,
  errors,
  isEditing,
  userData,
  handleEdit,
  onSubmit,
  onCancel,
  className = ""
}) => {
  return (
    <div className={`lg:col-span-2 ${className}`}>
      <div className="bg-gradient-to-r from-muted/30 to-muted/20 p-6 rounded-xl border border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <span className="p-2 bg-primary/10 rounded-lg">👤</span>
            Personal Information
          </h3>
          {!isEditing && (
            <Button
              onClick={handleEdit}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Username */}
          <FormField
            label="Username"
            error={errors.username?.message}
            required
          >
            <Input
              id="username"
              {...register("username")}
              placeholder="Enter your username"
              disabled={!isEditing}
              className="h-12 border-2 border-input focus:border-primary focus:ring-primary rounded-lg text-lg font-medium transition-all duration-200 disabled:bg-muted disabled:cursor-not-allowed"
            />
          </FormField>

          {/* Email */}
          <FormField
            label="Email Address"
            error={errors.email?.message}
            required
            icon={<IconMail className="h-5 w-5 text-muted-foreground" />}
          >
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email address"
              disabled={!isEditing}
              className="pl-12 h-12 border-2 border-input focus:border-primary focus:ring-primary rounded-lg text-lg font-medium transition-all duration-200 disabled:bg-muted disabled:cursor-not-allowed"
            />
          </FormField>

          {/* User Info Display */}
          {!isEditing && userData && (
            <InfoCard
              title="Account Information"
              data={{
                'Member since': userData.createdAt,
                'Role': userData.role || 'User',
                'Status': 'Active'
              }}
            />
          )}

          {/* Actions */}
          {isEditing && (
            <ActionButtons
              onCancel={onCancel}
              submitText="Save Changes"
              submitIcon={<IconSave className="h-4 w-4" />}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileInfoSection;
