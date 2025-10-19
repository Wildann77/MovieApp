import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useImageUpload = (initialUrl = '') => {
  const [imageUrl, setImageUrl] = useState(initialUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const queryClient = useQueryClient();

  const handleUploadStart = useCallback(() => {
    setIsUploading(true);
    setUploadError(null);
  }, []);

  const handleUploadComplete = useCallback((res) => {
    setIsUploading(false);
    setUploadError(null);
    
    if (res && res[0]) {
      const newUrl = res[0].url;
      setImageUrl(newUrl);
      
      // ✅ Cache uploaded image
      queryClient.setQueryData(['uploaded-image', newUrl], {
        url: newUrl,
        uploadedAt: Date.now(),
        size: res[0].size,
        type: res[0].type,
      });
      
      toast.success('Image uploaded successfully!');
    } else {
      setUploadError('No image data received');
      toast.error('Upload failed: No image data received');
    }
  }, [queryClient]);

  const handleUploadError = useCallback((error) => {
    setIsUploading(false);
    const errorMessage = error.message || error.error || 'Upload failed';
    setUploadError(errorMessage);
    toast.error(`Upload failed: ${errorMessage}`);
  }, []);

  const handleRemove = useCallback(() => {
    setImageUrl('');
    setUploadError(null);
    
    // ✅ Remove from cache if exists
    if (imageUrl) {
      queryClient.removeQueries({ queryKey: ['uploaded-image', imageUrl] });
    }
  }, [imageUrl, queryClient]);

  const resetImage = useCallback(() => {
    setImageUrl(initialUrl);
    setUploadError(null);
    setIsUploading(false);
  }, [initialUrl]);

  const retryUpload = useCallback(() => {
    setUploadError(null);
    setIsUploading(false);
  }, []);

  return {
    imageUrl,
    setImageUrl,
    isUploading,
    uploadError,
    handleUploadStart,
    handleUploadComplete,
    handleUploadError,
    handleRemove,
    resetImage,
    retryUpload,
  };
};
