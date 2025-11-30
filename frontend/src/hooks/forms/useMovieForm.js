import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useStore } from '../../store/store';
import { useCreateMovie } from '../useCreateMovie';
import { useUpdateMovie } from '../useUpdateMovie';
import { useSingleMovie } from '../use-single-movie';
import { useActors } from '@/hooks/use-actors';
import { useDirectors } from '@/hooks/use-directors';
import { useWriters } from '@/hooks/use-writers';
import { useGenres } from '@/hooks/use-genres';
import { useGlobalMasterData } from '@/hooks/use-global-master-data';
import { useFormSearchSelect } from '../useFormSearchSelect';
import { useSearchSelect } from '../useSearchSelect';
import { toast } from 'sonner';

// Validation schema
const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 5, "Invalid year"),
  duration: z.string().min(1, "Duration is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  trailer: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  director: z.string().min(1, "Director is required"),
  writers: z.array(z.string()).min(1, "At least one writer is required"),
  cast: z.array(z.string()).min(1, "At least one cast member is required"),
  genres: z.array(z.string()).min(1, "At least one genre is required"),
});

const useMovieForm = ({ mode = 'create', movieId = null, onSuccess, onCancel, isAdmin = false }) => {
  const [posterUrl, setPosterUrl] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState(Array(5).fill(null));
  const accessToken = useStore.use.accessToken();

  // Fetch movie data for edit mode
  const { 
    data: movieData, 
    isLoading: movieLoading, 
    error: movieError 
  } = useSingleMovie(movieId, { enabled: mode === 'edit' && !!movieId });

  // Use optimized hook for search queries with debouncing (all modes)
  const { 
    searchQueries, 
    debouncedSearchQueries,
    handleSearchChange, 
    clearAllSearches 
  } = useFormSearchSelect({
    director: "",
    writers: "",
    cast: "",
    genres: ""
  });

  // Use debounced search queries for API requests
  const currentSearchQueries = debouncedSearchQueries;
  const currentHandleSearchChange = handleSearchChange;

  // React Query hooks with search parameters
  const { mutate: createMovie, isPending: isCreating } = useCreateMovie(accessToken);
  const { mutate: updateMovie, isPending: isUpdating } = useUpdateMovie();
  
  // Helper function to determine if search should be enabled
  const shouldSearch = (query) => {
    const enabled = query && query.length >= 3;
    // Debug logging
    if (query && query !== '') {
      console.log(`🔍 Search query: "${query}", enabled: ${enabled}, length: ${query.length}`);
    }
    return enabled;
  };

  // Use global master data for dashboard mode, individual hooks for other modes
  const { data: globalMasterData, isLoading: globalMasterDataLoading, error: globalMasterDataError } = useGlobalMasterData();
  
  const { data: actorsData, isLoading: actorsLoading, error: actorsError, isFetching: actorsFetching } = useActors({ 
    search: currentSearchQueries.cast, 
    limit: 50 
  }, {
    enabled: shouldSearch(currentSearchQueries.cast) && !isAdmin
  });
  const { data: directorsData, isLoading: directorsLoading, error: directorsError, isFetching: directorsFetching } = useDirectors({ 
    search: currentSearchQueries.director, 
    limit: 50 
  }, {
    enabled: shouldSearch(currentSearchQueries.director) && !isAdmin
  });
  const { data: writersData, isLoading: writersLoading, error: writersError, isFetching: writersFetching } = useWriters({ 
    search: currentSearchQueries.writers, 
    limit: 50 
  }, {
    enabled: shouldSearch(currentSearchQueries.writers) && !isAdmin
  });
  const { data: genresData, isLoading: genresLoading, error: genresError, isFetching: genresFetching } = useGenres({ 
    search: currentSearchQueries.genres, 
    limit: 50 
  }, {
    enabled: shouldSearch(currentSearchQueries.genres) && !isAdmin
  });

  // Helper function to filter global data based on search queries
  const filterGlobalData = (data, searchQuery) => {
    if (!searchQuery || searchQuery.length < 3) return data || [];
    const query = searchQuery.toLowerCase();
    return (data || []).filter(item => 
      item.name && item.name.toLowerCase().includes(query)
    );
  };

  // Extract data from response objects - use global data for admin/dashboard mode with search filtering
  const actors = isAdmin ? filterGlobalData(globalMasterData?.actors, currentSearchQueries.cast) : (actorsData?.data || []);
  const directors = isAdmin ? filterGlobalData(globalMasterData?.directors, currentSearchQueries.director) : (directorsData?.data || []);
  const writers = isAdmin ? filterGlobalData(globalMasterData?.writers, currentSearchQueries.writers) : (writersData?.data || []);
  const genres = isAdmin ? filterGlobalData(globalMasterData?.genres, currentSearchQueries.genres) : (genresData?.data || []);

  // React Hook Form
  const form = useForm({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      director: "",
      writers: [],
      cast: [],
      genres: [],
    },
  });

  const { register, handleSubmit, formState: { errors }, reset, control, setValue } = form;

  // Populate form when movie data is loaded (edit mode)
  useEffect(() => {
    if (mode === 'edit' && movieData) {
      // Handle different data structures
      const movie = movieData;
      
      if (movie && movie._id) {
        reset({
          title: movie.title || "",
          year: movie.year || new Date().getFullYear(),
          duration: movie.duration || "",
          description: movie.description || "",
          trailer: movie.trailer || "",
          director: movie.director?._id || "",
          writers: movie.writers?.map(w => w._id) || [],
          cast: movie.cast?.map(c => c._id) || [],
          genres: movie.genres?.map(g => g._id) || [],
        });
        
        setPosterUrl(movie.poster || "");
        setHeroImageUrl(movie.heroImage || "");
        // Ensure gallery has 5 slots, fill with existing data
        const existingGallery = movie.gallery || [];
        const galleryWithSlots = Array(5).fill(null).map((_, index) => existingGallery[index] || null);
        setGalleryUrls(galleryWithSlots);
      }
    }
  }, [mode, movieData, reset]);

  // Optimized helper functions for selections with useCallback
  const handleSingleSelect = useCallback((field, itemId) => {
    setValue(field, itemId);
    // Clear search after selection
    currentHandleSearchChange(field, "");
  }, [setValue, currentHandleSearchChange]);

  const handleMultiSelect = useCallback((field, itemId, selectedValues) => {
    const currentValues = selectedValues || [];
    const newValues = currentValues.includes(itemId)
      ? currentValues.filter(v => v !== itemId)
      : [...currentValues, itemId];
    setValue(field, newValues);
    // Clear search after selection
    currentHandleSearchChange(field, "");
  }, [setValue, currentHandleSearchChange]);

  const onSubmit = useCallback((data) => {
    if (!posterUrl) {
      toast.error("Poster is required");
      return;
    }

    // Ensure arrays are properly formatted
    const movieData = {
      ...data,
      poster: posterUrl,
      heroImage: heroImageUrl || null,
      gallery: galleryUrls.filter(url => url !== null && url !== undefined && url !== ""),
      // Ensure these are arrays
      writers: Array.isArray(data.writers) ? data.writers : [],
      cast: Array.isArray(data.cast) ? data.cast : [],
      genres: Array.isArray(data.genres) ? data.genres : [],
    };

    if (mode === 'edit' && movieId) {
      // Always use regular update movie hook - isAdmin only affects master data access, not movie updates
      updateMovie(
        { movieId, movieData },
        {
          onSuccess: () => {
            toast.success("Movie updated successfully!");
            onSuccess?.();
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update movie");
          },
        }
      );
    } else {
      // Always use regular create movie hook - isAdmin only affects master data access, not movie creation
      createMovie(movieData, {
        onSuccess: () => {
          handleReset();
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to create movie");
        },
      });
    }
  }, [mode, movieId, posterUrl, heroImageUrl, galleryUrls, createMovie, updateMovie, onSuccess]);

  const handleReset = useCallback(() => {
    reset({
      director: "",
      writers: [],
      cast: [],
      genres: [],
    });
    setPosterUrl("");
    setHeroImageUrl("");
    setGalleryUrls(Array(5).fill(null));
    clearAllSearches();
  }, [reset, clearAllSearches]);

  const isLoading = isCreating || isUpdating;

  return {
    // Form state
    form,
    register,
    handleSubmit,
    errors,
    reset,
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
    searchQueries: searchQueries, // Immediate values for input fields
    debouncedSearchQueries: currentSearchQueries, // Debounced values for API requests
    handleSearchChange: currentHandleSearchChange,
    clearAllSearches,
    
    // Data
    actors,
    directors,
    writers,
    genres,
    
    // Loading states
    actorsLoading: isAdmin ? globalMasterDataLoading : actorsLoading,
    directorsLoading: isAdmin ? globalMasterDataLoading : directorsLoading,
    writersLoading: isAdmin ? globalMasterDataLoading : writersLoading,
    genresLoading: isAdmin ? globalMasterDataLoading : genresLoading,
    actorsError: isAdmin ? globalMasterDataError : actorsError,
    directorsError: isAdmin ? globalMasterDataError : directorsError,
    writersError: isAdmin ? globalMasterDataError : writersError,
    genresError: isAdmin ? globalMasterDataError : genresError,
    
    // Fetching states for better UX
    actorsFetching: isAdmin ? globalMasterDataLoading : actorsFetching,
    directorsFetching: isAdmin ? globalMasterDataLoading : directorsFetching,
    writersFetching: isAdmin ? globalMasterDataLoading : writersFetching,
    genresFetching: isAdmin ? globalMasterDataLoading : genresFetching,
    
    // Search status helpers - for admin mode, we don't show searching since it's client-side filtering
    isSearching: isAdmin ? false : (actorsFetching || directorsFetching || writersFetching || genresFetching),
    
    // Handlers
    handleSingleSelect,
    handleMultiSelect,
    handleReset,
    onSubmit,
    
    // State
    isLoading,
    mode,
    
    // Movie data (for edit mode)
    movieData,
    movieLoading,
    movieError,
  };
};

export default useMovieForm;
