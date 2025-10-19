import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { PhotoUpload } from '../../../shared';
import { 
  IconEdit, 
  IconLoader2
} from '@tabler/icons-react';

const MasterDataForm = ({ 
  entityName, 
  entityNamePlural,
  fields, 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading,
  hasPhoto = false,
  photoUrl = "",
  setPhotoUrl,
  photoEndpoint = null,
  icon: Icon
}) => {
  const [formData, setFormData] = useState(
    initialData || fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
  );

  const [errors, setErrors] = useState({});

  // Update form data when initialData changes (for editing)
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // Initialize photoUrl with existing photo when editing
      if (hasPhoto && initialData.photo && !photoUrl) {
        setPhotoUrl(initialData.photo);
      }
    } else {
      setFormData(fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));
    }
  }, [initialData, fields, hasPhoto]); // Removed photoUrl from dependencies to prevent reset

  // Separate effect to handle photoUrl initialization for editing mode
  React.useEffect(() => {
    if (initialData && hasPhoto && initialData.photo && !photoUrl) {
      setPhotoUrl(initialData.photo);
    }
  }, [initialData, hasPhoto]); // Only depend on initialData and hasPhoto

  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields
    fields.forEach(field => {
      if (field === 'name' && (!formData[field] || formData[field].trim() === '')) {
        newErrors[field] = 'Name is required';
      }
      if (field === 'bio' && (!formData[field] || formData[field].trim().length < 10)) {
        newErrors[field] = 'Bio must be at least 10 characters';
      }
    });

    // Validate photo if required
    if (hasPhoto && !photoUrl) {
      newErrors.photo = 'Photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoUpload = (url) => {
    setPhotoUrl(url);
    if (errors.photo) {
      setErrors(prev => ({ ...prev, photo: '' }));
    }
  };

  const getFieldLabel = (field) => {
    const labels = {
      name: 'Name',
      bio: 'Biography',
      description: 'Description'
    };
    return labels[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  const getFieldPlaceholder = (field) => {
    const placeholders = {
      name: `Enter ${entityName.toLowerCase()} name...`,
      bio: `Enter ${entityName.toLowerCase()} biography...`,
      description: `Enter ${entityName.toLowerCase()} description...`
    };
    return placeholders[field] || `Enter ${field}...`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            {initialData ? `Edit ${entityName}` : `Create ${entityName}`}
          </CardTitle>
          <CardDescription>
            {initialData 
              ? `Update the ${entityName.toLowerCase()} information below` 
              : `Add a new ${entityName.toLowerCase()} to the system`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload Section */}
            {hasPhoto && (
              <PhotoUpload
                label={`${entityName} Photo`}
                value={photoUrl || (initialData && initialData.photo) || ""}
                onChange={handlePhotoUpload}
                endpoint={photoEndpoint}
                error={errors.photo}
                placeholder={`Upload ${entityName.toLowerCase()} photo`}
                maxSize="4MB"
                previewSize="h-20 w-20"
                disabled={isLoading}
              />
            )}

            {/* Form Fields */}
            <div className="grid gap-4">
              {fields.map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium">
                    {getFieldLabel(field)}
                    {field === 'name' && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field === 'bio' || field === 'description' ? (
                    <textarea
                      value={formData[field] || ''}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className={`w-full p-3 border rounded-md min-h-[120px] resize-none ${
                        errors[field] ? 'border-red-500' : ''
                      }`}
                      placeholder={getFieldPlaceholder(field)}
                      required={field === 'name'}
                    />
                  ) : (
                    <Input
                      value={formData[field] || ''}
                      onChange={(e) => handleChange(field, e.target.value)}
                      placeholder={getFieldPlaceholder(field)}
                      required={field === 'name'}
                      className={errors[field] ? 'border-red-500' : ''}
                    />
                  )}
                  {errors[field] && (
                    <p className="text-xs text-red-500">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    {initialData ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <IconEdit className="mr-2 h-4 w-4" />
                    {initialData ? 'Update' : 'Create'}
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterDataForm;

