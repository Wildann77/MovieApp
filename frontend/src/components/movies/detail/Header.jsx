"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Star, Calendar, Clock, ExternalLink, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToggleFavorite, useIsFavorite } from "@/hooks/use-favorites";
import { useAuthContext } from "@/context/auth-provider";
import { toast } from "sonner";

export default function MovieHeader({ movie }) {
  const { user } = useAuthContext();
  const isAuthenticated = !!user;
  const { isFavorite } = useIsFavorite(movie._id);
  const toggleFavoriteMutation = useToggleFavorite();

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add favorites");
      return;
    }

    toggleFavoriteMutation.mutate(movie._id, {
      onSuccess: (data) => {
        toast.success(data.isFavorite ? "Added to favorites" : "Removed from favorites");
      },
      onError: (error) => {
        toast.error("Failed to update favorites");
        console.error("Favorite toggle error:", error);
      },
    });
  };

  return (
    <section className="relative w-full">
      {/* Background Image */}
      <div className="w-full h-[700px] relative overflow-hidden">
        <img
          src={movie.heroImage}
          alt={movie.title}
          className="w-full h-full object-cover opacity-25 dark:opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-chart-1/5 to-chart-2/5" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-end">
            {/* Movie Info */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                {/* Title dengan efek shadow dan gradient */}
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-foreground leading-[0.9] tracking-tight drop-shadow-2xl">
                    {movie.title}
                  </h1>
                  <div className="h-1 w-16 sm:w-20 lg:w-24 bg-gradient-to-r from-primary to-primary/60 rounded-full" />
                </div>
                
                {/* Movie Meta Info dengan styling yang lebih menarik */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 lg:gap-4 text-foreground/90">
                  <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 bg-background/80 backdrop-blur-sm px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full border border-border/50">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary flex-shrink-0" />
                    <span className="font-semibold text-xs sm:text-sm lg:text-base">{movie.year}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 bg-background/80 backdrop-blur-sm px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full border border-border/50">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary flex-shrink-0" />
                    <span className="font-semibold text-xs sm:text-sm lg:text-base">{movie.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 bg-background/80 backdrop-blur-sm px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full border border-border/50">
                    <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    <span className="font-bold text-xs sm:text-sm lg:text-base text-yellow-400">{movie.averageRating || "N/A"}</span>
                  </div>
                </div>

                {/* Genres dengan styling yang lebih menarik */}
                {movie.genres?.length > 0 && (
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {movie.genres.map((genre, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 sm:py-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                      >
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons dengan styling yang lebih menarik */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 lg:gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto flex items-center justify-center"
                  onClick={() => window.open(movie.trailer, "_blank")}
                >
                  <Play className="mr-1.5 sm:mr-2 lg:mr-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0" />
                  <span>Watch Trailer</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className={`border-2 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 hover:scale-105 w-full sm:w-auto flex items-center justify-center ${
                    isFavorite 
                      ? "border-red-500 bg-red-500 hover:bg-red-600 text-white" 
                      : "border-primary/50 hover:border-primary hover:bg-primary/10"
                  }`}
                  onClick={handleFavoriteClick}
                  disabled={toggleFavoriteMutation.isPending}
                >
                  <Heart className={`mr-1.5 sm:mr-2 lg:mr-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0 ${isFavorite && "fill-current"}`} />
                  <span className="hidden sm:inline">{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>
                  <span className="sm:hidden">{isFavorite ? "Remove" : "Add"}</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary/50 hover:border-primary hover:bg-primary/10 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 hover:scale-105 w-full sm:w-auto flex items-center justify-center"
                  onClick={() => window.open(movie.trailer, "_blank")}
                >
                  <ExternalLink className="mr-1.5 sm:mr-2 lg:mr-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0" />
                  <span>More Info</span>
                </Button>
              </div>
            </div>

            {/* Movie Poster Card */}
            <div className="flex justify-center lg:justify-end order-first lg:order-last">
              <Card className="w-48 sm:w-56 md:w-64 lg:w-72 h-[20rem] sm:h-[24rem] md:h-[26rem] lg:h-[28rem] overflow-hidden shadow-2xl border-0 bg-transparent group hover:scale-105 transition-all duration-300">
                <CardContent className="p-0 h-full w-full relative">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover bg-gradient-to-br from-muted/20 to-muted/40"
                    loading="lazy"
                    style={{ objectPosition: 'center' }}
                  />
                  {/* Overlay untuk efek hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Favorite button overlay */}
                  <button
                    onClick={handleFavoriteClick}
                    disabled={toggleFavoriteMutation.isPending}
                    className={`absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                      isFavorite 
                        ? "bg-red-500 hover:bg-red-600 text-white" 
                        : "bg-background/80 hover:bg-background text-foreground border border-border/50"
                    }`}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite && "fill-current"}`} />
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
