import React from 'react';
import { Input } from '../ui/input';
import FormField from '../shared/FormField';

const BasicInfoTab = ({ register, errors }) => {
  return (
    <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-3 sm:p-4 md:p-6 rounded-xl border border-border">
      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
        <span className="p-1.5 sm:p-2 bg-primary/10 rounded-lg text-sm sm:text-base">📝</span>
        <span className="leading-tight">Basic Information</span>
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Title */}
        <FormField
          label="Movie Title"
          error={errors.title?.message}
          required
        >
          <Input
            id="title"
            {...register("title")}
            placeholder="Enter movie title"
            className="h-10 sm:h-11 border-2 border-input focus:border-primary focus:ring-primary rounded-lg text-sm sm:text-base font-medium transition-all duration-200"
          />
        </FormField>

        {/* Year */}
        <FormField
          label="Release Year"
          error={errors.year?.message}
          required
        >
          <Input
            id="year"
            type="number"
            {...register("year", { valueAsNumber: true })}
            placeholder="2024"
            className="h-10 sm:h-11 border-2 border-input focus:border-primary focus:ring-primary rounded-lg text-sm sm:text-base font-medium transition-all duration-200"
          />
        </FormField>

        {/* Duration */}
        <FormField
          label="Duration"
          error={errors.duration?.message}
          required
        >
          <Input
            id="duration"
            {...register("duration")}
            placeholder="2h 30m"
            className="h-10 sm:h-11 border-2 border-input focus:border-primary focus:ring-primary rounded-lg text-sm sm:text-base font-medium transition-all duration-200"
          />
        </FormField>

        {/* Trailer */}
        <FormField
          label="Trailer URL"
          error={errors.trailer?.message}
        >
          <Input
            id="trailer"
            {...register("trailer")}
            placeholder="https://youtube.com/watch?v=..."
            className="h-10 sm:h-11 border-2 border-input focus:border-primary focus:ring-primary rounded-lg text-sm sm:text-base font-medium transition-all duration-200"
          />
        </FormField>
      </div>

      {/* Description */}
      <FormField
        label="Description"
        error={errors.description?.message}
        required
        className="mt-4 sm:mt-6"
      >
        <textarea
          id="description"
          {...register("description")}
          className="w-full min-h-[120px] sm:min-h-[140px] p-3 sm:p-4 border-2 border-input rounded-lg resize-none focus:border-primary focus:ring-primary text-sm sm:text-base transition-all duration-200"
          placeholder="Enter movie description..."
        />
      </FormField>
    </div>
  );
};

export default BasicInfoTab;
