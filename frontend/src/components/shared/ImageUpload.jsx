import React from 'react';
import { Button } from '../ui/button';
import { IconUpload, IconX } from '@tabler/icons-react';
import { generateUploadButton } from '@uploadthing/react';
import { toast } from 'sonner';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const UploadButton = generateUploadButton({
  url: `${baseURL}/uploadthing`,
});

const ImageUpload = ({
  imageUrl,
  onImageChange,
  endpoint,
  placeholder = "Upload image",
  maxWidth = "w-64",
  maxHeight = "h-80",
  showRemoveButton = true,
  className = "",
  onUploadStart,
  onUploadError,
  uploadType = "poster" // "poster" or "gallery"
}) => {
  const handleUploadComplete = (res) => {
    if (res && res[0]) {
      onImageChange(res[0].url);
      toast.success("Image uploaded successfully!");
    }
  };

  const handleUploadError = (error) => {
    if (onUploadError) onUploadError();
    toast.error(`Upload failed: ${error.message}`);
  };

  const handleUploadStart = () => {
    if (onUploadStart) onUploadStart();
  };

  const handleRemove = () => {
    onImageChange("");
  };

  // Different layouts for poster vs gallery uploads
  const isPosterUpload = uploadType === "poster";
  
  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      {imageUrl ? (
        <div className="space-y-3 sm:space-y-4">
          <div className="relative inline-block group w-full">
            <img
              src={imageUrl}
              alt="Uploaded"
              className={`w-full ${maxHeight} object-cover rounded-lg border shadow-lg transition-transform duration-300 group-hover:scale-105`}
            />
            {showRemoveButton && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 shadow-lg hover:scale-110 transition-transform"
                onClick={handleRemove}
              >
                <IconX className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
          {showRemoveButton && isPosterUpload && (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:border-destructive/30 transition-all duration-200 text-xs sm:text-sm"
              >
                Remove Image
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className={isPosterUpload ? "w-full" : "w-full h-full"}>
          <div className={`border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-300 group cursor-pointer ${
            isPosterUpload ? "p-4 sm:p-6 md:p-8" : "p-2 sm:p-3 md:p-4 h-full flex items-center justify-center"
          }`}>
            <div className="text-center w-full">
              <IconUpload className={`${isPosterUpload ? "h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" : "h-6 w-6 sm:h-8 sm:w-8"} text-muted-foreground mx-auto mb-2 sm:mb-3 group-hover:text-primary transition-colors`} />
              <p className={`${isPosterUpload ? "text-sm sm:text-base" : "text-xs sm:text-sm"} font-medium text-foreground mb-1 sm:mb-2`}>
                {placeholder}
              </p>
              <p className={`${isPosterUpload ? "text-xs sm:text-sm" : "text-xs"} text-muted-foreground mb-1 sm:mb-2`}>
                {isPosterUpload ? "Click to browse or drag and drop" : "Click to upload"}
              </p>
              {isPosterUpload && (
                <p className="text-xs text-muted-foreground mb-2 sm:mb-4">
                  Recommended: 400x600px or similar aspect ratio
                </p>
              )}
              {!isPosterUpload && (
                <p className="text-xs text-muted-foreground mb-2 sm:mb-4">
                  Any image format
                </p>
              )}
              <UploadButton
                endpoint={endpoint}
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                onUploadBegin={handleUploadStart}
                appearance={{
                  button: `ut-ready:bg-primary ut-uploading:cursor-not-allowed rounded-md ut-button:bg-primary ut-button:text-primary-foreground hover:ut-button:bg-primary/90 ut-readying:bg-primary/50 ${isPosterUpload ? "ut-button:px-4 ut-button:py-2 sm:ut-button:px-6 sm:ut-button:py-3" : "ut-button:px-3 ut-button:py-1 sm:ut-button:px-4 sm:ut-button:py-2"}`,
                  container: "w-full flex justify-center",
                  allowedContent: "text-xs text-muted-foreground mt-1 sm:mt-2"
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

