import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { IconUpload, IconUser } from '@tabler/icons-react';
import { cn } from '../../lib/utils';
import { generateUploadButton } from '@uploadthing/react';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const UploadButton = generateUploadButton({
  url: `${baseURL}/uploadthing`,
});

const AvatarUpload = ({
  value = "",
  onChange,
  endpoint = "imageUploader",
  size = "h-32 w-32",
  className = "",
  accept = "image/*",
  ...props
}) => {
  const handleUploadComplete = (res) => {
    if (res && res[0]) {
      onChange?.(res[0].url);
    }
  };

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)} {...props}>
      <Avatar className={cn("border-4 border-white shadow-lg", size)}>
        <AvatarImage src={value} alt="Avatar" />
        <AvatarFallback>
          <IconUser className="h-16 w-16" />
        </AvatarFallback>
      </Avatar>
      
      <UploadButton
        endpoint={endpoint}
        onClientUploadComplete={handleUploadComplete}
        onUploadError={(error) => console.error('Upload failed:', error)}
        className="w-full"
        {...props}
      />
    </div>
  );
};

export default AvatarUpload;
