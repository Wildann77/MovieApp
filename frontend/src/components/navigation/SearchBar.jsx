import React, { useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, Film, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearch } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPortal } from 'react-dom';

export const SearchBar = ({ isScrolled, isMobile = false }) => {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });
  const [isFocused, setIsFocused] = React.useState(false);
  
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    isSearchOpen,
    handleSearchSubmit,
    clearSearch,
    closeSearch,
  } = useSearch();

  // Update dropdown position when search opens
  useEffect(() => {
    let ticking = false;
    
    const updatePosition = () => {
      if (isSearchOpen && searchRef.current) {
        const rect = searchRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        setDropdownPosition({
          top: rect.bottom + (isMobile ? 4 : 8),
          left: isMobile ? Math.max(16, rect.left) : rect.left,
          width: isMobile ? Math.min(viewportWidth - 32, rect.width) : rect.width
        });
      }
      ticking = false;
    };

    const throttledUpdatePosition = () => {
      if (!ticking) {
        requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    if (isSearchOpen) {
      updatePosition();
      
      // Update position on scroll and resize with throttling
      window.addEventListener('scroll', throttledUpdatePosition, { passive: true });
      window.addEventListener('resize', throttledUpdatePosition, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', throttledUpdatePosition);
        window.removeEventListener('resize', throttledUpdatePosition);
      };
    }
  }, [isSearchOpen, searchQuery, isScrolled, isMobile]);

  // Additional effect to handle navbar state changes
  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      // Small delay to ensure navbar transition is complete
      const timeoutId = setTimeout(() => {
        const rect = searchRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        setDropdownPosition({
          top: rect.bottom + (isMobile ? 4 : 8),
          left: isMobile ? Math.max(16, rect.left) : rect.left,
          width: isMobile ? Math.min(viewportWidth - 32, rect.width) : rect.width
        });
      }, 300); // Match navbar transition duration

      return () => clearTimeout(timeoutId);
    }
  }, [isScrolled, isSearchOpen, isMobile]);

  // Close dropdown when clicking outside - REMOVED to prevent conflict with useSearch hook


  const SearchDropdown = () => {
    if (!isSearchOpen || !searchQuery || isSearching) return null;

    const { movies, actors } = searchResults;
    const hasResults = movies.length > 0 || actors.length > 0;

    return createPortal(
      <div 
        data-search-dropdown
        className={cn(
          "fixed z-50 overflow-y-auto rounded-lg border bg-background/95 backdrop-blur-md shadow-lg pointer-events-auto transition-all duration-200",
          isMobile 
            ? "max-h-80 rounded-xl border-border/30 shadow-2xl" 
            : "max-h-96 border-border/50"
        )}
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          minWidth: isMobile ? '280px' : '320px',
          maxWidth: isMobile ? 'calc(100vw - 32px)' : '400px'
        }}
      >
        {isSearching ? (
          <div className="flex items-center justify-center p-4">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Searching...</span>
            </div>
          </div>
        ) : hasResults ? (
          <div className={cn("p-2", isMobile && "p-1")}>
            {/* Movies Section */}
            {movies.length > 0 && (
              <>
                <div className={cn(
                  "px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide",
                  isMobile && "px-2 py-1.5"
                )}>
                  Movies
                </div>
                {movies.map((movie) => (
                  <div
                    key={movie._id}
                    data-search-result="true"
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Close search first
                      closeSearch();
                      clearSearch();
                      // Use window.location for immediate navigation
                      window.location.href = `/movies/${movie._id}`;
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Close search first
                      closeSearch();
                      clearSearch();
                      // Use window.location for immediate navigation
                      window.location.href = `/movies/${movie._id}`;
                    }}
                    className={cn(
                      "flex w-full items-center space-x-3 rounded-md text-left hover:bg-muted transition-colors cursor-pointer",
                      isMobile ? "p-2.5 space-x-2.5 active:bg-muted/80" : "p-3"
                    )}
                  >
                    <div className="flex-shrink-0">
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className={cn(
                            "rounded object-cover",
                            isMobile ? "h-10 w-7" : "h-12 w-8"
                          )}
                        />
                      ) : (
                        <div className={cn(
                          "flex items-center justify-center rounded bg-muted",
                          isMobile ? "h-10 w-7" : "h-12 w-8"
                        )}>
                          <Film className={cn(
                            "text-muted-foreground",
                            isMobile ? "h-3 w-3" : "h-4 w-4"
                          )} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "truncate font-medium",
                        isMobile ? "text-sm" : "text-sm"
                      )}>{movie.title}</p>
                      <p className={cn(
                        "truncate text-muted-foreground",
                        isMobile ? "text-xs" : "text-xs"
                      )}>
                        {movie.year} • {movie.genres?.map(genre => genre.name).join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Actors Section */}
            {actors.length > 0 && (
              <>
                {movies.length > 0 && <div className="border-t border-border/50 my-2" />}
                <div className={cn(
                  "px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide",
                  isMobile && "px-2 py-1.5"
                )}>
                  Actors
                </div>
                {actors.map((actor) => (
                  <div
                    key={actor._id}
                    data-search-result="true"
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Close search first
                      closeSearch();
                      clearSearch();
                      // Use window.location for immediate navigation
                      window.location.href = `/actors/${actor._id}`;
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Close search first
                      closeSearch();
                      clearSearch();
                      // Use window.location for immediate navigation
                      window.location.href = `/actors/${actor._id}`;
                    }}
                    className={cn(
                      "flex w-full items-center space-x-3 rounded-md text-left hover:bg-muted transition-colors cursor-pointer",
                      isMobile ? "p-2.5 space-x-2.5 active:bg-muted/80" : "p-3"
                    )}
                  >
                    <div className="flex-shrink-0">
                      {actor.photo ? (
                        <img
                          src={actor.photo}
                          alt={actor.name}
                          className={cn(
                            "rounded-full object-cover",
                            isMobile ? "h-10 w-10" : "h-12 w-12"
                          )}
                        />
                      ) : (
                        <div className={cn(
                          "flex items-center justify-center rounded-full bg-muted",
                          isMobile ? "h-10 w-10" : "h-12 w-12"
                        )}>
                          <User className={cn(
                            "text-muted-foreground",
                            isMobile ? "h-3 w-3" : "h-4 w-4"
                          )} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "truncate font-medium",
                        isMobile ? "text-sm" : "text-sm"
                      )}>{actor.name}</p>
                      <p className={cn(
                        "truncate text-muted-foreground",
                        isMobile ? "text-xs" : "text-xs"
                      )}>
                        Actor
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        ) : searchQuery.length >= 2 ? (
          <div className={cn(
            "text-center text-muted-foreground",
            isMobile ? "p-3" : "p-4"
          )}>
            <Film className={cn(
              "mx-auto mb-2",
              isMobile ? "h-6 w-6" : "h-8 w-8"
            )} />
            <p className={cn(
              isMobile ? "text-sm" : "text-base"
            )}>No results found for "{searchQuery}"</p>
          </div>
        ) : null}
      </div>,
      document.body
    );
  };

  return (
    <div ref={searchRef} className="w-full" data-search-input>
      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <div className="relative w-full">
          <Search className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors",
            isMobile ? "h-4 w-4" : "h-4 w-4",
            isFocused && "text-primary"
          )} />
          <Input
            type="text"
            placeholder={isMobile ? "Search..." : "Search movies..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full pl-10 pr-10 transition-all duration-200",
              isMobile 
                ? "h-11 text-base bg-background/70 backdrop-blur-sm border-border/40 rounded-xl focus:bg-background/90 focus:border-primary/50" 
                : cn(
                    "bg-background/50 backdrop-blur-sm border-border/50",
                    isScrolled ? "h-9" : "h-10"
                  ),
              isFocused && "ring-2 ring-primary/20"
            )}
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className={cn(
                "absolute right-1 top-1/2 -translate-y-1/2 p-0 hover:bg-muted transition-colors",
                isMobile ? "h-8 w-8" : "h-7 w-7"
              )}
            >
              <X className={cn(
                isMobile ? "h-3.5 w-3.5" : "h-3 w-3"
              )} />
            </Button>
          )}
        </div>
      </form>

      {/* Portal-based Search Dropdown */}
      <SearchDropdown />
    </div>
  );
};
