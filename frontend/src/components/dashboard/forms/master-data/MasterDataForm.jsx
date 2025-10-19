import React from 'react';
import { FormCard } from '@/components/layouts';
import { FormInput, FormTextarea, FormUpload, FormActions } from '@/components/forms';
import { IconEdit, IconPlus } from '@tabler/icons-react';

const MasterDataForm = ({
  config,
  register,
  handleSubmit,
  errors,
  isEditing,
  selectedItem,
  photoUrl,
  setPhotoUrl,
  onSubmit,
  onDeleteItem,
  onNewItem,
  isCreating,
  isUpdating,
  isDeleting,
  ...props
}) => {
  const getFormIcon = () => {
    return isEditing ? IconEdit : IconPlus;
  };

  const getFormTitle = () => {
    return isEditing ? config.formConfig.editTitle : config.formConfig.createTitle;
  };

  const getFormDescription = () => {
    return isEditing ? config.formConfig.editDescription : config.formConfig.createDescription;
  };

  const renderField = (field) => {
    const commonProps = {
      key: field.name,
      label: field.label,
      required: field.required,
      error: errors[field.name]?.message,
      placeholder: field.placeholder,
      register: register(field.name, {
        required: field.required,
        minLength: field.minLength,
      }),
    };

    switch (field.type) {
      case 'textarea':
        return (
          <FormTextarea
            {...commonProps}
            minHeight={field.minHeight || "120px"}
          />
        );
      default:
        return (
          <FormInput
            {...commonProps}
            type={field.type || 'text'}
          />
        );
    }
  };

  return (
    <FormCard
      title={getFormTitle()}
      description={getFormDescription()}
      icon={<getFormIcon className="h-5 w-5 text-primary" />}
      {...props}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Photo Upload Section */}
          {config.hasPhoto && (
            <div className="lg:col-span-1 order-2 lg:order-1">
              <FormUpload
                label={`${config.displayName} Photo`}
                required={true}
                value={photoUrl}
                onChange={setPhotoUrl}
                endpoint={config.photoEndpoint}
                error={!photoUrl ? "Photo is required" : ""}
              />
            </div>
          )}

          {/* Form Fields */}
          <div className={config.hasPhoto ? "lg:col-span-2 order-1 lg:order-2 space-y-4 lg:space-y-6" : "lg:col-span-3 space-y-4 lg:space-y-6"}>
            {config.fields.map(renderField)}
          </div>
        </div>

        {/* Actions */}
        <FormActions
          onCancel={onNewItem}
          onSubmit={handleSubmit(onSubmit)}
          onDelete={isEditing && selectedItem ? () => onDeleteItem(selectedItem) : null}
          cancelText="Reset Form"
          submitText={isEditing ? `Update ${config.displayName}` : `Create ${config.displayName}`}
          deleteText={`Delete ${config.displayName}`}
          isLoading={isCreating || isUpdating}
          isDeleting={isDeleting}
          showDelete={isEditing && !!selectedItem}
        />
      </form>
    </FormCard>
  );
};

export default MasterDataForm;
