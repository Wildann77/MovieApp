import React, { useState, useMemo, useCallback, useRef } from "react";
import { MovieDataTable } from "./movie-data-table";
import useUserMovies from "@/hooks/useUserMovies";
import { useGenres } from "@/hooks/use-genres";
import { useDirectors } from "@/hooks/use-directors";
import { useOptimizedSearch } from "@/hooks/useOptimizedSearch";
import { 
  IconMovie, 
  IconPlus, 
  IconSearch, 
  IconFilter, 
  IconSortAscending,
  IconCalendar,
  IconTag,
  IconVideo,
  IconClearAll,
  IconRefresh,
  IconLoader2
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../ui/select";
import { useAuthContext } from "@/context/auth-provider";
import Loader from "@/components/kokonutui/loader";

export default function MoviesList({ onEditMovie }) {
  const { user } = useAuthContext();
  
  // Use optimized search hook for smooth search experience
  const { 
    searchInput, 
    debouncedSearch, 
    isTyping, 
    handleSearchChange, 
    clearSearch 
  } = useOptimizedSearch(300); // 300ms debounce for ultra smooth typing
  
  const [searchParams, setSearchParams] = useState({
    search: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    genre: "",
    year: "",
    director: ""
  });

  // ZERO LAG memoized searchParams - absolutely minimal
  const memoizedSearchParams = useMemo(() => searchParams, [
    searchParams.search,
    searchParams.page,
    searchParams.limit,
    searchParams.sortBy,
    searchParams.sortOrder,
    searchParams.genre,
    searchParams.year,
    searchParams.director
  ]);

  // ZERO LAG search params update - absolutely minimal
  React.useEffect(() => {
    setSearchParams(prev => {
      if (prev.search !== debouncedSearch) {
        return { ...prev, search: debouncedSearch, page: 1 };
      }
      return prev;
    });
  }, [debouncedSearch]);

  const { data, isLoading, error, isFetching } = useUserMovies(memoizedSearchParams);
  
  // Debug logging to verify user filtering
  React.useEffect(() => {
    if (user?._id) {
      console.log("🎬 MoviesList - Current user:", user._id, user.username);
      console.log("🎬 MoviesList - Search params:", memoizedSearchParams);
      console.log("🎬 MoviesList - Movies data:", data);
      console.log("🎬 MoviesList - Movies count:", data?.data?.length || 0);
      console.log("🎬 MoviesList - Pagination:", data?.pagination);
      
      // Log each movie's user ID to verify filtering
      if (data?.data && Array.isArray(data.data)) {
        console.log("🎬 MoviesList - Movie owners:", data.data.map(movie => ({
          title: movie.title,
          ownerId: movie.user?._id,
          ownerName: movie.user?.username
        })));
      }
    }
  }, [user, memoizedSearchParams, data]);
  
  // Fetch genres and directors for filter dropdowns with longer cache
  // Only fetch if we don't have data yet or if user is authenticated
  const { data: genresData, isLoading: genresLoading } = useGenres({ 
    limit: 100 
  });
  const { data: directorsData, isLoading: directorsLoading } = useDirectors({ 
    limit: 100 
  });

  // Generate year options (last 50 years)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 50 }, (_, i) => currentYear - i);
  }, []);

  // Get unique genres and directors for filters
  const genres = genresData?.data || [];
  const directors = directorsData?.data || [];

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="flex-1 space-y-3 md:space-y-4 p-2 sm:p-3 md:p-6 lg:p-8 pt-2 sm:pt-4 md:pt-6">
        <div className="space-y-3 md:space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold">Authentication Required</h2>
          <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive font-medium text-sm sm:text-base">You need to be logged in to view your movies</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Please log in to access your movie collection.
            </p>
            <div className="mt-3 sm:mt-4">
              <Button 
                onClick={() => window.location.href = '/login'}
                className="w-full sm:w-auto h-10 sm:h-auto touch-manipulation"
              >
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Optimized handlers with useCallback
  const handlePageChange = useCallback((page) => {
    setSearchParams(prev => ({
      ...prev,
      page
    }));
  }, []);

  const handleSortChange = useCallback(({ sortBy, sortOrder }) => {
    setSearchParams(prev => ({
      ...prev,
      sortBy,
      sortOrder,
      page: 1 // Reset to first page when sorting
    }));
  }, []);

  const handleFilterChange = useCallback((filterType, value) => {
    console.log(`Filter changed: ${filterType} = "${value}"`);
    setSearchParams(prev => ({
      ...prev,
      [filterType]: value,
      page: 1 // Reset to first page when filtering
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    clearSearch(); // Clear search input (this will trigger debounced search update)
    setSearchParams(prev => ({
      ...prev,
      search: "", // This will be updated by useEffect when debouncedSearch changes
      genre: "",
      year: "",
      director: "",
      page: 1
    }));
  }, [clearSearch]);

  const refreshData = useCallback(() => {
    setSearchParams(prev => ({ ...prev }));
  }, []);

  // ZERO LAG input change handler - absolutely instant
  const memoizedHandleSearchChange = useCallback((e) => {
    // Direct value extraction for maximum speed
    handleSearchChange(e.target.value);
  }, [handleSearchChange]);

  // Check if any filters are active (memoized for performance)
  const hasActiveFilters = useMemo(() => {
    return searchParams.search || searchParams.genre || searchParams.year || searchParams.director;
  }, [searchParams.search, searchParams.genre, searchParams.year, searchParams.director]);

  // Memoize filter count for performance
  const activeFilterCount = useMemo(() => {
    return Object.values(searchParams).filter(value => 
      value && typeof value === 'string' && value !== ''
    ).length;
  }, [searchParams]);

  // Only show loading for initial load, not for subsequent fetches
  const isInitialLoading = isLoading && !data;

  if (isInitialLoading) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
        <Loader 
          title="Loading Your Movies"
          subtitle="Please wait while we fetch your movie collection"
          size="lg"
          fullScreen={true}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-3 md:space-y-4 p-2 sm:p-3 md:p-6 lg:p-8 pt-2 sm:pt-4 md:pt-6">
        <div className="space-y-3 md:space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold">Error Loading Movies</h2>
          <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive font-medium text-sm sm:text-base">Failed to load your movies</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Error: {error.message || "Unknown error occurred"}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Status: {error.status || "Unknown"}
            </p>
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto h-10 sm:h-auto touch-manipulation"
              >
                Retry
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/login'}
                className="w-full sm:w-auto h-10 sm:h-auto touch-manipulation"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-3 md:space-y-4 p-2 sm:p-3 md:p-6 lg:p-8 pt-2 sm:pt-4 md:pt-6 min-h-0 overflow-hidden">
      <div className="flex flex-col space-y-3 md:space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">My Movies</h2>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
            Manage and edit your movie collection
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
              {data?.pagination?.totalItems || 0} movies
            </Badge>
            <Button 
              onClick={() => window.location.href = '#create-movie'}
              className="bg-primary hover:bg-primary/90 w-auto px-3 sm:px-4 py-2 h-9 sm:h-10 touch-manipulation text-xs sm:text-sm"
            >
              <IconPlus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Add Movie</span>
              <span className="xs:hidden">Add</span>
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Filters Section */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex flex-col space-y-3 sm:space-y-4">
            <div className="flex flex-col space-y-3 sm:space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                  <IconFilter className="h-4 w-4 sm:h-5 sm:w-5" />
                  Filters & Search
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  Filter your movies by genre, year, director, or search by title
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {hasActiveFilters && (
                  <Badge variant="secondary" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
                    {activeFilterCount} active filters
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
                  disabled={isFetching}
                  className="flex items-center gap-1 sm:gap-2 touch-manipulation h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
                >
                  <IconRefresh className={`h-3 w-3 sm:h-4 sm:w-4 ${isFetching ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                  <span className="sm:hidden">↻</span>
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 sm:gap-2 touch-manipulation h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
                  >
                    <IconClearAll className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Clear All</span>
                    <span className="sm:hidden">Clear</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                <IconSearch className="h-3 w-3 sm:h-4 sm:w-4" />
                Search Movies
              </label>
              <div className="relative">
                <Input
                  placeholder="Search by title..."
                  value={searchInput}
                  onChange={memoizedHandleSearchChange}
                  autoComplete="off"
                  spellCheck="false"
                  className="h-9 sm:h-10 text-sm"
                />
              </div>
              {/* Completely eliminated feedback to remove all lag */}
            </div>

            {/* Genre Filter */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                <IconTag className="h-3 w-3 sm:h-4 sm:w-4" />
                Genre
              </label>
              <Select
                key={`genre-${searchParams.genre || "all"}`}
                value={searchParams.genre || "all"}
                onValueChange={(value) => handleFilterChange('genre', value === "all" ? "" : value)}
              >
                <SelectTrigger className="w-full h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="All genres" />
                </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all" className="text-sm">All genres</SelectItem>
                   {genresLoading ? (
                     <SelectItem value="loading" disabled className="text-sm">
                       <IconLoader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-2 inline" />
                       Loading genres...
                     </SelectItem>
                   ) : (
                     genres.map((genre) => (
                       <SelectItem key={genre._id} value={genre.name} className="text-sm">
                         {genre.name}
                       </SelectItem>
                     ))
                   )}
                 </SelectContent>
              </Select>
            </div>

            {/* Year Filter */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                <IconCalendar className="h-3 w-3 sm:h-4 sm:w-4" />
                Year
              </label>
              <Select
                key={`year-${searchParams.year || "all"}`}
                value={searchParams.year || "all"}
                onValueChange={(value) => handleFilterChange('year', value === "all" ? "" : value)}
              >
                <SelectTrigger className="w-full h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="All years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-sm">All years</SelectItem>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()} className="text-sm">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Director Filter */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                <IconVideo className="h-3 w-3 sm:h-4 sm:w-4" />
                Director
              </label>
              <Select
                key={`director-${searchParams.director || "all"}`}
                value={searchParams.director || "all"}
                onValueChange={(value) => handleFilterChange('director', value === "all" ? "" : value)}
              >
                <SelectTrigger className="w-full h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="All directors" />
                </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all" className="text-sm">All directors</SelectItem>
                   {directorsLoading ? (
                     <SelectItem value="loading" disabled className="text-sm">
                       <IconLoader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-2 inline" />
                       Loading directors...
                     </SelectItem>
                   ) : (
                     directors.map((director) => (
                       <SelectItem key={director._id} value={director.name} className="text-sm">
                         {director.name}
                       </SelectItem>
                     ))
                   )}
                 </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Movies</CardTitle>
            <IconMovie className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold">{data?.pagination?.totalItems || 0}</div>
            <p className="text-xs text-muted-foreground">
              Movies in collection
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">This Page</CardTitle>
            <IconFilter className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold">{data?.data?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Movies on page
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Current Page</CardTitle>
            <IconSortAscending className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold">{data?.pagination?.currentPage || 1}</div>
            <p className="text-xs text-muted-foreground">
              of {data?.pagination?.totalPages || 1} pages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Sort By</CardTitle>
            <IconSearch className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-lg sm:text-2xl font-bold capitalize">{searchParams.sortBy}</div>
            <p className="text-xs text-muted-foreground">
              {searchParams.sortOrder} order
            </p>
          </CardContent>
        </Card>
      </div>

       {/* Movies Table */}
       <Card>
         <CardHeader className="p-3 sm:p-6">
           <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
             <div className="space-y-1">
               <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                 Movie Collection
                 {isFetching && <IconLoader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-muted-foreground" />}
               </CardTitle>
               <CardDescription className="text-xs sm:text-sm">
                 View, edit, and manage your movie collection. Click on the actions menu to edit or delete movies.
               </CardDescription>
             </div>
             {isFetching && (
               <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm w-fit">
                 <IconLoader2 className="h-3 w-3 animate-spin mr-1" />
                 Updating...
               </Badge>
             )}
           </div>
         </CardHeader>
         <CardContent className="p-0 sm:p-6">
           <div className="overflow-x-auto">
             <MovieDataTable
               data={data?.data || []}
               pagination={data?.pagination}
               onPageChange={handlePageChange}
               onSortChange={handleSortChange}
               onEditMovie={onEditMovie}
             />
           </div>
         </CardContent>
       </Card>

         {/* Empty State */}
         {(!data?.data || data.data.length === 0) && !isInitialLoading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 sm:py-16 p-4 sm:p-6">
              <div className="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-muted">
                <IconMovie className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold">No movies yet</h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground text-center max-w-sm px-2">
                You haven't created any movies yet. Start building your movie collection by adding your first movie.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-2 w-full max-w-sm">
                <Button 
                  onClick={() => window.location.href = '#create-movie'}
                  className="w-full sm:w-auto h-10 sm:h-auto touch-manipulation"
                >
                  <IconPlus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Create Your First Movie</span>
                  <span className="sm:hidden">Create First Movie</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/movies'}
                  className="w-full sm:w-auto h-10 sm:h-auto touch-manipulation"
                >
                  <span className="hidden sm:inline">Browse All Movies</span>
                  <span className="sm:hidden">Browse Movies</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
