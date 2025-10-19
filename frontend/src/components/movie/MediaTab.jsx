import React, { useState } from 'react';
import { Button } from '../ui/button';
import { IconUpload, IconX, IconPhoto, IconLoader2 } from '@tabler/icons-react';
import { toast } from 'sonner';
import ImageUpload from '../shared/ImageUpload';

const MediaTab = ({ posterUrl, setPosterUrl, heroImageUrl, setHeroImageUrl, galleryUrls, setGalleryUrls }) => {
  const [uploadingSlots, setUploadingSlots] = useState(Array(5).fill(false));

  const handleGalleryAdd = (newUrl, slotIndex) => {
    if (newUrl) {
      setGalleryUrls((prev) => {
        const newGallery = [...prev];
        newGallery[slotIndex] = newUrl;
        return newGallery;
      });
      setUploadingSlots(prev => {
        const newSlots = [...prev];
        newSlots[slotIndex] = false;
        return newSlots;
      });
      toast.success("Image added to gallery!");
    }
  };

  const handleGalleryUploadStart = (slotIndex) => {
    setUploadingSlots(prev => {
      const newSlots = [...prev];
      newSlots[slotIndex] = true;
      return newSlots;
    });
  };

  const handleGalleryUploadError = (slotIndex) => {
    setUploadingSlots(prev => {
      const newSlots = [...prev];
      newSlots[slotIndex] = false;
      return newSlots;
    });
  };

  const handleGalleryRemove = (index) => {
    setGalleryUrls((prev) => {
      const newGallery = [...prev];
      newGallery[index] = null;
      return newGallery;
    });
    toast.success("Image removed from gallery");
  };

  return (
    <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-3 sm:p-4 md:p-6 rounded-xl border border-border">
      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
        <span className="p-1.5 sm:p-2 bg-primary/10 rounded-lg text-sm sm:text-base">🎬</span>
        <span className="leading-tight">Media Content</span>
      </h3>
      
      <div className="space-y-6 sm:space-y-8">
        {/* Poster Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-semibold">Movie Poster</h4>
            <span className="text-xs sm:text-sm text-destructive">*</span>
          </div>
          
          <div className="flex justify-center px-1">
            <div className="relative w-full max-w-sm sm:max-w-md">
              <ImageUpload
                imageUrl={posterUrl}
                onImageChange={setPosterUrl}
                endpoint="moviePoster"
                placeholder="Click to upload poster"
                maxWidth="w-full"
                maxHeight="h-56 sm:h-64 md:h-72"
                uploadType="poster"
              />
              {posterUrl && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                    ✓ Poster uploaded
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-semibold">Hero Section Image</h4>
            <span className="text-xs sm:text-sm text-muted-foreground">(Optional)</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed px-1">
            This image will be used in the hero banner section on the homepage. Recommended size: 1920x1080 or similar wide format.
          </p>
          
          <div className="flex justify-center px-1">
            <div className="relative w-full max-w-md sm:max-w-lg">
              <ImageUpload
                imageUrl={heroImageUrl}
                onImageChange={setHeroImageUrl}
                endpoint="movieHeroImage"
                placeholder="Click to upload hero image"
                maxWidth="w-full"
                maxHeight="h-36 sm:h-44 md:h-52"
                uploadType="hero"
              />
              {heroImageUrl && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-chart-2 text-chart-2-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                    ✓ Hero image uploaded
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-semibold">Gallery Images</h4>
            <span className="text-xs sm:text-sm text-muted-foreground">(Optional - up to 5)</span>
          </div>
          
          {/* Gallery Grid */}
          <div className="px-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="aspect-square w-full">
                  {galleryUrls[index] ? (
                    <div className="relative group h-full w-full">
                      <img
                        src={galleryUrls[index]}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border shadow-lg transition-all duration-300 group-hover:scale-105"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 sm:top-2 sm:right-2 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                        onClick={() => handleGalleryRemove(index)}
                      >
                        <IconX className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="h-full w-full">
                      {uploadingSlots[index] ? (
                        <div className="h-full w-full border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center bg-primary/5">
                          <div className="text-center p-2">
                            <IconLoader2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mx-auto mb-1 animate-spin" />
                            <p className="text-xs text-primary font-medium">Uploading...</p>
                          </div>
                        </div>
                      ) : (
                        <ImageUpload
                          imageUrl=""
                          onImageChange={(url) => handleGalleryAdd(url, index)}
                          onUploadStart={() => handleGalleryUploadStart(index)}
                          onUploadError={() => handleGalleryUploadError(index)}
                          endpoint="movieGallery"
                          placeholder="Add Image"
                          maxWidth="w-full"
                          maxHeight="h-full"
                          showRemoveButton={false}
                          uploadType="gallery"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaTab;
