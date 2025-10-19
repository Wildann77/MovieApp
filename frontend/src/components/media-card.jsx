// MediaCard.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Star, Play, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useToggleFavorite, useIsFavorite } from "@/hooks/use-favorites";
import { useAuthContext } from "@/context/auth-provider";
import { toast } from "sonner";

export default function MediaCard({
  posterSrc,
  title,
  year,
  rating = "N/A",
  movieId,
  onAdd,
  onTrailer,
  onWatchlist, // Add support for onWatchlist prop
  className,
}) {
  const { user } = useAuthContext();
  const isAuthenticated = !!user;
  const { isFavorite } = useIsFavorite(movieId);
  const toggleFavoriteMutation = useToggleFavorite();

  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Prevent navigation when clicking favorite button
    
    if (!isAuthenticated) {
      toast.error("Please login to add favorites");
      return;
    }

    if (!movieId) {
      toast.error("Movie ID is required");
      return;
    }

    toggleFavoriteMutation.mutate(movieId, {
      onSuccess: (data) => {
        toast.success(data.isFavorite ? "Added to favorites" : "Removed from favorites");
      },
      onError: (error) => {
        toast.error("Failed to update favorites");
        console.error("Favorite toggle error:", error);
      },
    });
  };
  // Handle missing or invalid data gracefully
  const displayTitle = title || "Untitled";
  const displayTitleWithYear = year ? `${displayTitle} (${year})` : displayTitle;
  const displayRating = rating && rating !== "N/A" ? rating : "N/A";
  const displayPoster = posterSrc || "/placeholder.svg";

  return (
    <Link to={movieId ? `/movies/${movieId}` : "#"} className="block group">
      <Card
        className={cn(
          "movie-card-hover movie-card-container flex flex-col bg-card text-card-foreground border border-border/50 overflow-hidden rounded-xl shadow-md p-0 w-full h-[400px] sm:h-[420px] group-hover:border-primary/30 group-hover:bg-card/95",
          className
        )}
        aria-label={`Kartu untuk ${displayTitleWithYear}`}
      >
      {/* Poster container with relative positioning */}
      <div className="movie-poster-container relative overflow-hidden rounded-t-xl group-hover:rounded-t-xl h-[240px] sm:h-[260px]">
        <img
          src={displayPoster}
          alt={`Poster ${displayTitleWithYear}`}
          className="movie-image-hover w-full h-full object-cover group-hover:scale-110 group-hover:brightness-110"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/placeholder.svg";
          }}
        />
        
        {/* Elegant Overlay */}
        <div className="overlay-fade absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100" />
        
        {/* Play Button - always visible but subtle */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <div className="bg-white/20 backdrop-blur-md rounded-full p-3 hover:bg-white/30 transition-all duration-300 hover:scale-110">
            <Play className="h-6 w-6 text-white fill-white ml-0.5" />
          </div>
        </div>
        
        {/* Add button overlay - only show if onAdd is provided */}
        {onAdd && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAdd(e);
            }}
            aria-label="Tambah"
            className="absolute left-3 top-3 inline-flex items-center justify-center h-8 w-8 rounded-full bg-black/60 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/80 hover:scale-110 opacity-0 group-hover:opacity-100 shadow-lg"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
        
        {/* Rating Badge - elegant */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            <Star className="h-3 w-3 fill-current" />
            <span>{displayRating}</span>
          </div>
        </div>
        
        {/* Bottom gradient for text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col bg-gradient-to-br from-card via-card to-card/95 h-[160px] sm:h-[160px]">
        {/* Title */}
        <h3 className="font-bold text-sm sm:text-sm text-foreground line-clamp-2 leading-snug mb-2 sm:mb-3 h-[40px] flex items-start group-hover:text-primary transition-colors duration-500 ease-out">
          {displayTitleWithYear}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 sm:gap-1.5 text-sm sm:text-xs mb-3 sm:mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
          <Star className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-yellow-500 fill-yellow-500" />
          <span className="font-semibold text-foreground">{displayRating}</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 sm:gap-2 mt-auto">
          <Button
            onClick={handleFavoriteClick}
            size="sm"
            variant={isFavorite ? "default" : "secondary"}
            className={cn(
              "btn-elegant-hover flex-1 rounded-full text-sm sm:text-xs h-9 sm:h-9 font-medium",
              isFavorite && "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg",
              !isFavorite && "bg-secondary/50 hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-md"
            )}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            disabled={toggleFavoriteMutation.isPending}
          >
            <Heart className={cn("mr-1.5 sm:mr-1.5 h-4 w-4 sm:h-3.5 sm:w-3.5 transition-all duration-300", isFavorite && "fill-current", !isFavorite && "group-hover:text-red-400")} />
            <span className="hidden sm:inline">{isFavorite ? "Favorit" : "Favorit"}</span>
            <span className="sm:hidden">♥</span>
          </Button>

          {onTrailer && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTrailer(e);
              }}
              size="sm"
              variant="ghost"
              className="btn-elegant-hover rounded-full px-2 h-9 w-9 sm:h-9 sm:w-9 bg-secondary/50 hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-md hover:scale-105"
              aria-label="Putar Trailer"
            >
              <Play className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}
