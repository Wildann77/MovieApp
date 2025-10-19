import React from 'react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { IconUpload, IconX, IconUser } from '@tabler/icons-react';
import { cn } from '../../lib/utils';
import { generateUploadButton } from '@uploadthing/react';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const UploadButton = generateUploadButton({
  url: `${baseURL}/uploadthing`,
});

const FormUpload = ({
  label,
  error,
  required = false,
  value = "",
  onChange,
  endpoint = "imageUploader",
  className = "",
  containerClassName = "",
  previewSize = "h-32 w-32",
  showPreview = true,
  accept = "image/*",
  maxSize = "10MB",
  ...props
}) => {
  const handleUploadComplete = (res) => {
    if (res && res[0]) {
      onChange?.(res[0].url);
    }
  };

  const handleRemove = () => {
    onChange?.("");
  };

  return (
    <div className={cn("space-y-4", containerClassName)}>
      {label && (
        <Label className="text-sm font-medium flex items-center gap-2">
          {required && <span className="text-destructive">*</span>}
          {label}
        </Label>
      )}
      
      <div className={cn("", className)}>
        {value && showPreview ? (
          <div className="space-y-4">
            <div className="relative inline-block group">
              <Avatar className={cn("border-4 border-white shadow-lg", previewSize)}>
                <AvatarImage src={value} alt="Upload preview" />
                <AvatarFallback>
                  <IconUser className="h-16 w-16" />
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0 shadow-lg hover:scale-110 transition-transform"
                onClick={handleRemove}
              >
                <IconX className="h-4 w-4" />
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              className="w-full"
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group">
            <div className="group-hover:scale-110 transition-transform duration-300">
              <IconUpload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            </div>
            <p className="text-sm font-medium mb-2">Upload {label?.toLowerCase() || 'file'}</p>
            <p className="text-xs text-muted-foreground mb-4">
              Max size: {maxSize}
            </p>
            <UploadButton
              endpoint={endpoint}
              onClientUploadComplete={handleUploadComplete}
              onUploadError={(error) => console.error('Upload failed:', error)}
              {...props}
            />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormUpload;
