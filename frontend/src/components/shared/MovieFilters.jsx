import React from "react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Filter, Grid, List } from "lucide-react";

const MovieFilters = ({
  selectedGenre = "all",
  selectedYear = "all",
  sortBy = "createdAt",
  sortOrder = "desc",
  viewMode = "grid",
  onGenreChange,
  onYearChange,
  onSortChange,
  onViewModeChange,
  onClearFilters,
  showViewModeToggle = true,
  showSortOptions = true,
  customGenres = [],
  customYears = [],
  className = ""
}) => {
  // Default genres if none provided
  const defaultGenres = [
    "Action", "Comedy", "Drama", "Horror", "Romance", 
    "Thriller", "Sci-Fi", "Fantasy", "Animation", "Adventure",
    "Crime", "Documentary", "Family", "Mystery", "War"
  ];

  // Default years (last 30 years)
  const defaultYears = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 30 }, (_, i) => currentYear - i);
  }, []);

  const genres = customGenres.length > 0 ? customGenres : defaultGenres;
  const years = customYears.length > 0 ? customYears : defaultYears;

  const hasActiveFilters = selectedGenre !== "all" || 
                          selectedYear !== "all" || 
                          sortBy !== "createdAt" || 
                          sortOrder !== "desc";

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Filter Label */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filters:</span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3 items-center flex-1">
          {/* Genre Filter */}
          <div className="relative">
            <Select value={selectedGenre} onValueChange={onGenreChange}>
              <SelectTrigger className="w-[160px] sm:w-[180px] bg-background border border-input hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={5}
                className="min-w-[160px] sm:min-w-[180px] bg-popover border border-border shadow-lg max-h-[300px] overflow-y-auto"
              >
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => {
                  const genreValue = typeof genre === 'string' ? genre : genre.name || genre._id || genre;
                  const genreKey = typeof genre === 'string' ? genre : genre._id || genre.name || genre;
                  return (
                    <SelectItem key={genreKey} value={genreValue}>
                      {genreValue}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Year Filter */}
          <div className="relative">
            <Select value={selectedYear} onValueChange={onYearChange}>
              <SelectTrigger className="w-[100px] sm:w-[120px] bg-background border border-input hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors">
                <SelectValue placeholder="All Years">
                  {selectedYear === "all" ? "All Years" : selectedYear}
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={5}
                className="min-w-[100px] sm:min-w-[120px] bg-popover border border-border shadow-lg max-h-[300px] overflow-y-auto"
              >
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          {showSortOptions && (
            <div className="relative">
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={onSortChange}>
                <SelectTrigger className="w-[160px] sm:w-[180px] bg-background border border-input hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={5}
                  className="min-w-[160px] sm:min-w-[180px] bg-popover border border-border shadow-lg max-h-[300px] overflow-y-auto"
                >
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                  <SelectItem value="title-desc">Title Z-A</SelectItem>
                  <SelectItem value="year-desc">Year (Newest)</SelectItem>
                  <SelectItem value="year-asc">Year (Oldest)</SelectItem>
                  <SelectItem value="averageRating-desc">Highest Rated</SelectItem>
                  <SelectItem value="averageRating-asc">Lowest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters} className="transition-colors">
              Clear Filters
            </Button>
          )}
        </div>

        {/* View Mode Toggle */}
        {showViewModeToggle && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="transition-colors"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="transition-colors"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {(selectedGenre !== "all" || selectedYear !== "all") && (
        <div className="flex flex-wrap gap-2">
          {selectedGenre !== "all" && (
            <Badge variant="secondary" className="gap-1 px-3 py-1 text-sm">
              Genre: {selectedGenre}
              <button 
                onClick={() => onGenreChange("all")} 
                className="ml-1 hover:text-destructive transition-colors"
                aria-label={`Remove ${selectedGenre} genre filter`}
              >
                ×
              </button>
            </Badge>
          )}
          {selectedYear !== "all" && (
            <Badge variant="secondary" className="gap-1 px-3 py-1 text-sm">
              Year: {selectedYear}
              <button 
                onClick={() => onYearChange("all")} 
                className="ml-1 hover:text-destructive transition-colors"
                aria-label={`Remove ${selectedYear} year filter`}
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieFilters;
