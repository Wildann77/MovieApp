import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useMovies from "../../hooks/use-movies";
import MediaCard from "../../components/media-card";
import { Button } from "../../components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { MovieFilters } from "../../components/shared";
import Loader from "../../components/kokonutui/loader";

export const AllMovies = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  
  const itemsPerPage = 24; // Increased for better grid layout

  // Initialize filters from URL parameters
  useEffect(() => {
    const genreParam = searchParams.get('genre');
    const yearParam = searchParams.get('year');
    
    if (genreParam) {
      setSelectedGenre(genreParam);
    }
    if (yearParam) {
      setSelectedYear(yearParam);
    }
  }, [searchParams]);

  // Build query parameters
  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      sortBy,
      sortOrder,
    };

    if (selectedGenre && selectedGenre !== "all") {
      params.genre = selectedGenre;
    }
    if (selectedYear && selectedYear !== "all") {
      params.year = selectedYear;
    }

    return params;
  }, [currentPage, selectedGenre, selectedYear, sortBy, sortOrder, itemsPerPage]);

  const { data: moviesData, isLoading, error, refetch } = useMovies(queryParams);

  const handleAddToWatchlist = (movieId) => {
    console.log("Add to watchlist:", movieId);
    // TODO: Implement add to watchlist functionality
  };

  const handleWatchTrailer = (movieId) => {
    console.log("Watch trailer:", movieId);
    // TODO: Implement trailer functionality
  };

  const handleMovieInfo = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  const handleGenreChange = (value) => {
    console.log("Genre changed to:", value);
    setSelectedGenre(value);
    setCurrentPage(1);
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      newSearchParams.set('genre', value);
    } else {
      newSearchParams.delete('genre');
    }
    setSearchParams(newSearchParams);
  };

  const handleYearChange = (value) => {
    console.log("Year changed to:", value);
    setSelectedYear(value);
    setCurrentPage(1);
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      newSearchParams.set('year', value);
    } else {
      newSearchParams.delete('year');
    }
    setSearchParams(newSearchParams);
  };

  const handleSortChange = (value) => {
    console.log("Sort changed to:", value);
    const [field, order] = value.split("-");
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedGenre("all");
    setSelectedYear("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
    
    // Clear URL parameters
    setSearchParams({});
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate year options (last 30 years)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 30 }, (_, i) => currentYear - i);
  }, []);

  const movies = moviesData?.data || [];
  const pagination = moviesData?.pagination || {};
  const totalPages = pagination.totalPages || Math.ceil((pagination.totalItems || 0) / itemsPerPage);
  
  // Debug logging
  console.log("AllMovies Debug:", {
    moviesCount: movies.length,
    pagination,
    totalPages,
    currentPage,
    itemsPerPage
  });

  if (isLoading && currentPage === 1) {
    return (
      <Loader 
        title="Loading Movies"
        subtitle="Please wait while we fetch the movie collection"
        size="lg"
        fullScreen={true}
      />
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-background overflow-hidden pt-20">
        {/* Background Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-2/10 opacity-50"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">Error loading movies</p>
              <Button onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background pt-20">
      {/* Background Layer (boleh overflow-hidden) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-2/10 opacity-50"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl"></div>
      </div>
  
      {/* Content Layer */}
      <div className="relative z-10 container mx-auto px-4 py-8 pb-16 overflow-visible">
  
        {/* Header */}
        <div className="mb-8 animate-in fade-in-0 slide-in-from-top-4 duration-700">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Movie Collection
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover and explore our extensive collection of movies
          </p>
          {pagination.totalItems && (
            <p className="text-sm text-muted-foreground mt-2">
              Showing {movies.length} of {pagination.totalItems} movies
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8 animate-in fade-in-0 slide-in-from-top-4 duration-700 delay-150">
          <MovieFilters
            selectedGenre={selectedGenre}
            selectedYear={selectedYear}
            sortBy={sortBy}
            sortOrder={sortOrder}
            viewMode={viewMode}
            onGenreChange={handleGenreChange}
            onYearChange={handleYearChange}
            onSortChange={handleSortChange}
            onViewModeChange={setViewMode}
            onClearFilters={clearFilters}
            customYears={yearOptions}
          />
        </div>

        {/* Loading Overlay for pagination */}
        {isLoading && currentPage > 1 && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-30 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Movies Grid */}
        <div className={cn(
          "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300",
          viewMode === "grid" 
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            : "space-y-4"
        )}>
          {movies.map((movie, index) => (
            <div
              key={movie._id}
              className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
              style={{
                animationDelay: `${300 + (index * 50)}ms`,
                animationFillMode: 'both'
              }}
            >
              <MediaCard
                movieId={movie._id}
                posterSrc={movie.poster}
                title={movie.title}
                year={movie.year}
                rating={movie.rating || movie.imdbRating || movie.averageRating || "N/A"}
                onAdd={() => handleAddToWatchlist(movie._id)}
                onTrailer={() => handleWatchTrailer(movie._id)}
                className={cn(
                  "w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[180px] mx-auto transition-transform hover:scale-105",
                  viewMode === "list" && "max-w-none h-auto"
                )}
              />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {movies.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-64 animate-in fade-in-0 slide-in-from-top-4 duration-700">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No movies found</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-12 space-x-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    disabled={isLoading}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Pagination Info */}
        {totalPages > 1 && (
          <div className="text-center mt-4 text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-700">
            Page {currentPage} of {totalPages} • {pagination.totalItems} total movies
          </div>
        )}
      </div>
    </div>
  );
};
