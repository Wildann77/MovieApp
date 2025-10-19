import React from 'react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { IconUpload, IconX, IconUser, IconPhoto } from '@tabler/icons-react';
import { cn } from '../../lib/utils';
import { generateUploadButton } from '@uploadthing/react';
import { toast } from 'sonner';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const UploadButton = generateUploadButton({
  url: `${baseURL}/uploadthing`,
});

const PhotoUpload = ({
  label,
  error,
  required = false,
  value = "",
  onChange,
  endpoint = "imageUploader",
  className = "",
  containerClassName = "",
  previewSize = "h-20 w-20",
  showPreview = true,
  accept = "image/*",
  maxSize = "4MB",
  placeholder = "Upload photo",
  disabled = false,
  ...props
}) => {
  const handleUploadComplete = (res) => {
    if (res && res[0]) {
      onChange?.(res[0].url);
      toast.success("Photo uploaded successfully!");
    }
  };

  const handleUploadError = (error) => {
    console.error('Upload failed:', error);
    toast.error(`Upload failed: ${error.message}`);
  };

  const handleRemove = () => {
    onChange?.("");
  };

  return (
    <div className={cn("space-y-3", containerClassName)}>
      {label && (
        <Label className="text-sm font-medium flex items-center gap-2">
          {required && <span className="text-destructive">*</span>}
          {label}
        </Label>
      )}
      
      <div className={cn("flex items-center gap-4", className)}>
        {/* Photo Preview */}
        <div className="flex-shrink-0">
          {value && showPreview ? (
            <div className="relative group">
              <Avatar className={cn("border-2 border-border shadow-md", previewSize)}>
                <AvatarImage src={value} alt="Photo preview" />
                <AvatarFallback>
                  <IconPhoto className="h-8 w-8 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 shadow-lg hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                  onClick={handleRemove}
                >
                  <IconX className="h-3 w-3" />
                </Button>
              )}
            </div>
          ) : (
            <div className={cn("border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/30", previewSize)}>
              <IconPhoto className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Upload Area */}
        <div className="flex-1">
          {value ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Photo uploaded successfully</p>
              {!disabled && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemove}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <IconX className="mr-2 h-4 w-4" />
                  Remove Photo
                </Button>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group">
              <IconUpload className="h-8 w-8 text-muted-foreground mx-auto mb-2 group-hover:text-primary transition-colors" />
              <p className="text-sm font-medium mb-1">{placeholder}</p>
              <p className="text-xs text-muted-foreground mb-3">
                Max size: {maxSize}
              </p>
              {!disabled && (
                <UploadButton
                  endpoint={endpoint}
                  onClientUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                  appearance={{
                    button: "ut-ready:bg-primary ut-uploading:cursor-not-allowed rounded-md ut-button:bg-primary ut-button:text-primary-foreground hover:ut-button:bg-primary/90 ut-readying:bg-primary/50 ut-button:px-4 ut-button:py-2",
                    container: "w-full flex justify-center",
                    allowedContent: "text-xs text-muted-foreground mt-1"
                  }}
                  {...props}
                />
              )}
            </div>
          )}
        </div>
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

export default PhotoUpload;
