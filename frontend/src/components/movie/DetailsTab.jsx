import React from 'react';
import { Controller } from 'react-hook-form';
import { Button } from '../ui/button';
import { IconMovie, IconPlus } from '@tabler/icons-react';
import SearchSelect from '../shared/SearchSelect';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorState from '../shared/ErrorState';
import Loader from '../kokonutui/loader';

const DetailsTab = ({
  control,
  errors,
  searchQueries,
  handleSearchChange,
  handleSingleSelect,
  handleMultiSelect,
  actors = [],
  directors = [],
  writers = [],
  genres = [],
  actorsLoading,
  directorsLoading,
  writersLoading,
  genresLoading,
  actorsError,
  directorsError,
  writersError,
  genresError,
  actorsFetching,
  directorsFetching,
  writersFetching,
  genresFetching
}) => {
  const isLoading = actorsLoading || directorsLoading || writersLoading || genresLoading;
  const hasError = actorsError || directorsError || writersError || genresError;
  const hasNoData = !isLoading && !hasError && 
    actors.length === 0 && directors.length === 0 && writers.length === 0 && genres.length === 0;

  if (isLoading) {
    return (
      <Loader 
        title="Loading Cast & Crew"
        subtitle="Please wait while we fetch the cast and crew data"
        size="md"
      />
    );
  }

  if (hasError) {
    return (
      <ErrorState
        title="Error Loading Data"
        message="Error loading cast & crew data. Please refresh the page or check your connection."
      />
    );
  }

  if (hasNoData) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground mb-4">No cast & crew data available.</p>
        <p className="text-sm text-muted-foreground mb-4">
          Please add some actors, directors, writers, and genres first.
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          <Button type="button" variant="outline" size="sm">Add Actors</Button>
          <Button type="button" variant="outline" size="sm">Add Directors</Button>
          <Button type="button" variant="outline" size="sm">Add Writers</Button>
          <Button type="button" variant="outline" size="sm">Add Genres</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-3 sm:p-4 md:p-6 rounded-xl border border-border">
      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
        <span className="p-1.5 sm:p-2 bg-primary/10 rounded-lg text-sm sm:text-base">👥</span>
        <span className="leading-tight">Cast & Crew Details</span>
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Director */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Director *
          </div>
          
          <Controller
            name="director"
            control={control}
            render={({ field }) => {
              const selectedDirector = field.value ? directors.find(d => d._id === field.value) : null;
              return (
                <div className="w-full">
                  <SearchSelect
                    searchValue={searchQueries.director}
                    onSearchChange={(value) => handleSearchChange("director", value)}
                    options={directors}
                    selectedItems={selectedDirector}
                    onSelect={(id) => handleSingleSelect("director", id, field.onChange)}
                    onRemove={() => field.onChange("")}
                    placeholder="Search directors..."
                    icon={IconMovie}
                    multiSelect={false}
                    isLoading={directorsLoading}
                    isFetching={directorsFetching}
                  />
                </div>
              );
            }}
          />

          {errors.director && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span>⚠️</span> {errors.director.message}
            </p>
          )}
        </div>

        {/* Genres */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Genres *
          </div>
          
          <Controller
            name="genres"
            control={control}
            render={({ field }) => {
              const selectedGenres = field.value ? genres.filter(g => field.value.includes(g._id)) : [];
              return (
                <div className="w-full">
                  <SearchSelect
                    searchValue={searchQueries.genres}
                    onSearchChange={(value) => handleSearchChange("genres", value)}
                    options={genres}
                    selectedItems={selectedGenres}
                    onSelect={(id) => handleMultiSelect("genres", id, field.value, field.onChange)}
                    onRemove={(id) => handleMultiSelect("genres", id, field.value, field.onChange)}
                    placeholder="Search genres..."
                    icon={IconPlus}
                    multiSelect={true}
                    isLoading={genresLoading}
                    isFetching={genresFetching}
                  />
                </div>
              );
            }}
          />

          {errors.genres && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span>⚠️</span> {errors.genres.message}
            </p>
          )}
        </div>
      </div>

      {/* Writers */}
      <div className="space-y-3 mt-6">
        <div className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          Writers *
        </div>
        
        <Controller
          name="writers"
          control={control}
          render={({ field }) => {
            const selectedWriters = field.value ? writers.filter(w => field.value.includes(w._id)) : [];
            return (
              <div className="w-full">
                <SearchSelect
                  searchValue={searchQueries.writers}
                  onSearchChange={(value) => handleSearchChange("writers", value)}
                  options={writers}
                  selectedItems={selectedWriters}
                  onSelect={(id) => handleMultiSelect("writers", id, field.value, field.onChange)}
                  onRemove={(id) => handleMultiSelect("writers", id, field.value, field.onChange)}
                  placeholder="Search writers..."
                  icon={IconPlus}
                  multiSelect={true}
                  isLoading={writersLoading}
                  isFetching={writersFetching}
                />
              </div>
            );
          }}
        />

        {errors.writers && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <span>⚠️</span> {errors.writers.message}
          </p>
        )}
      </div>

      {/* Cast */}
      <div className="space-y-3 mt-6">
        <div className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          Cast *
        </div>
        
        <Controller
          name="cast"
          control={control}
          render={({ field }) => {
            const selectedActors = field.value ? actors.filter(a => field.value.includes(a._id)) : [];
            return (
              <div className="w-full">
                <SearchSelect
                  searchValue={searchQueries.cast}
                  onSearchChange={(value) => handleSearchChange("cast", value)}
                  options={actors}
                  selectedItems={selectedActors}
                  onSelect={(id) => handleMultiSelect("cast", id, field.value, field.onChange)}
                  onRemove={(id) => handleMultiSelect("cast", id, field.value, field.onChange)}
                  placeholder="Search actors..."
                  icon={IconPlus}
                  multiSelect={true}
                  isLoading={actorsLoading}
                  isFetching={actorsFetching}
                />
              </div>
            );
          }}
        />

        {errors.cast && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <span>⚠️</span> {errors.cast.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default DetailsTab;
