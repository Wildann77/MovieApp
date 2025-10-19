import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconX, IconPlus, IconEdit } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import useMovieForm from '@/hooks/forms/useMovieForm';
import BasicInfoTab from '@/components/movie/BasicInfoTab';
import MediaTab from '@/components/movie/MediaTab';
import DetailsTab from '@/components/movie/DetailsTab';
import Loader from '@/components/kokonutui/loader';

const MovieFormLayout = ({ 
  mode = 'create', 
  movieId = null, 
  onSuccess, 
  onCancel,
  className = "",
  isAdmin = false,
  ...props 
}) => {
  const {
    // Form state
    form,
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    
    // Media state
    posterUrl,
    setPosterUrl,
    heroImageUrl,
    setHeroImageUrl,
    galleryUrls,
    setGalleryUrls,
    
    // Search state
    searchQueries,
    debouncedSearchQueries,
    handleSearchChange,
    clearAllSearches,
    
    // Data
    actors,
    directors,
    writers,
    genres,
    
    // Loading states
    actorsLoading,
    directorsLoading,
    writersLoading,
    genresLoading,
    actorsError,
    directorsError,
    writersError,
    genresError,
    
    // Fetching states for better UX
    actorsFetching,
    directorsFetching,
    writersFetching,
    genresFetching,
    
    // Handlers
    handleSingleSelect,
    handleMultiSelect,
    handleReset,
    onSubmit,
    
    // State
    isLoading,
    
    // Movie data (for edit mode)
    movieData,
    movieLoading,
    movieError,
  } = useMovieForm({ mode, movieId, onSuccess, onCancel, isAdmin });

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  const handleFormReset = () => {
    handleReset();
  };

  const handleCancel = () => {
    handleFormReset();
    onCancel?.();
  };

  // Loading state for edit mode
  if (mode === 'edit' && movieLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
        <div className="w-full max-w-sm sm:max-w-md">
          <Loader 
            title="Loading Movie Data"
            subtitle="Please wait while we fetch the movie information for editing"
            size="lg"
            fullScreen={false}
          />
        </div>
      </div>
    );
  }

  // Error state for edit mode
  if (mode === 'edit' && movieError) {
    return (
      <div className="px-2 sm:px-0">
        <Card className="shadow-sm">
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold">Error Loading Movie</h2>
              <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive font-medium text-sm sm:text-base">Failed to load movie data</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 break-words">
                  Error: {movieError.message || "Unknown error occurred"}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground break-all">
                  Movie ID: {movieId}
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="w-full sm:w-auto text-sm"
                  >
                    Retry
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    className="w-full sm:w-auto text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No movie data for edit mode
  if (mode === 'edit') {
    const actualMovieData = movieData;
    if (!actualMovieData || !actualMovieData._id) {
      return (
        <div className="px-2 sm:px-0">
          <Card className="shadow-sm">
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold">Movie Not Found</h2>
                <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive font-medium text-sm sm:text-base">Movie not found</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                    The movie you're trying to edit could not be found.
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground break-all">
                    Movie ID: {movieId}
                  </p>
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                      className="w-full sm:w-auto text-sm"
                    >
                      Go Back
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return (
    <div className={cn("w-full max-w-none", className)} {...props}>
      <div className="flex flex-col gap-4 sm:gap-6 px-2 sm:px-4 lg:px-0">
        <Card className="shadow-sm border-0 sm:border">
          <CardHeader className="pb-4 sm:pb-6 px-3 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex-shrink-0">
                  {mode === 'create' ? (
                    <IconPlus className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  ) : (
                    <IconEdit className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base sm:text-lg font-semibold leading-tight">
                    {mode === 'create' ? 'Create New Movie' : 'Edit Movie'}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {mode === 'create' 
                      ? 'Add a new movie to your database' 
                      : 'Update movie information and details'
                    }
                  </CardDescription>
                </div>
              </div>
              
              {mode === 'edit' && (
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="text-xs sm:text-sm px-3 sm:px-4"
                  >
                    <IconX className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Cancel</span>
                    <span className="xs:hidden">×</span>
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="px-3 sm:px-6 pb-6">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 sm:space-y-8">
              {/* Basic Info Tab */}
              <div className="w-full">
                <BasicInfoTab
                  register={register}
                  errors={errors}
                />
              </div>

              {/* Media Tab */}
              <div className="w-full">
                <MediaTab
                  posterUrl={posterUrl}
                  setPosterUrl={setPosterUrl}
                  heroImageUrl={heroImageUrl}
                  setHeroImageUrl={setHeroImageUrl}
                  galleryUrls={galleryUrls}
                  setGalleryUrls={setGalleryUrls}
                />
              </div>

              {/* Details Tab */}
              <div className="w-full">
                <DetailsTab
                  register={register}
                  errors={errors}
                  control={control}
                  searchQueries={searchQueries}
                  handleSearchChange={handleSearchChange}
                  clearAllSearches={clearAllSearches}
                  actors={actors}
                  directors={directors}
                  writers={writers}
                  genres={genres}
                  actorsLoading={actorsLoading}
                  directorsLoading={directorsLoading}
                  writersLoading={writersLoading}
                  genresLoading={genresLoading}
                  actorsError={actorsError}
                  directorsError={directorsError}
                  writersError={writersError}
                  genresError={genresError}
                  actorsFetching={actorsFetching}
                  directorsFetching={directorsFetching}
                  writersFetching={writersFetching}
                  genresFetching={genresFetching}
                  handleSingleSelect={handleSingleSelect}
                  handleMultiSelect={handleMultiSelect}
                />
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-6 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFormReset}
                  disabled={isLoading}
                  className="w-full sm:w-auto order-2 sm:order-1 text-sm h-10 sm:h-9"
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto sm:min-w-[120px] order-1 sm:order-2 text-sm font-medium h-10 sm:h-9"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span className="hidden sm:inline">
                        {mode === 'create' ? 'Creating...' : 'Updating...'}
                      </span>
                      <span className="sm:hidden">
                        {mode === 'create' ? 'Creating' : 'Updating'}
                      </span>
                    </div>
                  ) : (
                    <span>
                      {mode === 'create' ? 'Create Movie' : 'Update Movie'}
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MovieFormLayout;
