"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Play, Info, Calendar, Clock, Loader2 } from "lucide-react";
import useMovies from "@/hooks/use-movies";
import { Link } from "react-router-dom";
import HeroBannerSkeleton from "./HeroBannerSkeleton";

export default function HeroBanner() {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevMovieIndex, setPrevMovieIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [currentImageLoading, setCurrentImageLoading] = useState(false);
  const contentRef = useRef(null);
  const imageRefs = useRef({});
  
  const { data: moviesData, isLoading, error } = useMovies({
    limit: 6,
    random: true
  });

  const featuredMovies = moviesData?.data || [];

  // Image preloading function
  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      if (imagesLoaded[src]) {
        resolve(src);
        return;
      }

      const img = new Image();
      img.onload = () => {
        setImagesLoaded(prev => ({ ...prev, [src]: true }));
        resolve(src);
      };
      img.onerror = () => {
        setImagesLoaded(prev => ({ ...prev, [src]: false }));
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });
  };

  // Preload all movie images when data is available
  useEffect(() => {
    if (featuredMovies.length > 0) {
      const imagePromises = featuredMovies.map(movie => {
        const imageUrl = movie.heroImage || movie.poster;
        return preloadImage(imageUrl);
      });

      Promise.allSettled(imagePromises).then(() => {
        console.log('All images preloaded');
      });
    }
  }, [featuredMovies]);

  const changeMovie = async (newIndex) => {
    if (newIndex === currentMovieIndex || isTransitioning) return;
    
    const newMovie = featuredMovies[newIndex];
    const newImageUrl = newMovie?.heroImage || newMovie?.poster;
    
    // Check if image is already loaded
    if (!imagesLoaded[newImageUrl]) {
      setCurrentImageLoading(true);
      try {
        await preloadImage(newImageUrl);
      } catch (error) {
        console.warn('Failed to load image:', error);
      } finally {
        setCurrentImageLoading(false);
      }
    }
    
    setIsTransitioning(true);
    
    // Quick transition to new movie
    setTimeout(() => {
      setCurrentMovieIndex(newIndex);
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    
    const interval = setInterval(() => {
      // Generate random index instead of sequential
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * featuredMovies.length);
      } while (randomIndex === currentMovieIndex && featuredMovies.length > 1);
      
      changeMovie(randomIndex);
    }, 8000);

    return () => clearInterval(interval);
  }, [featuredMovies.length, currentMovieIndex]);

  const fallbackMovie = {
    _id: "fallback",
    title: "Oppenheimer",
    year: 2023,
    description: "Drama biografi tentang pencipta bom atom, karya Christopher Nolan.",
    poster: "https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    heroImage: "https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    averageRating: 4.5,
    totalReviews: 1250,
    duration: "180 min",
    genres: [{ name: "Drama" }, { name: "Biography" }],
    director: { name: "Christopher Nolan" }
  };

  const currentMovie = featuredMovies[currentMovieIndex] || fallbackMovie;
  const rating = currentMovie.averageRating || 0;
  const reviewCount = currentMovie.totalReviews || 0;

  if (isLoading) {
    return <HeroBannerSkeleton />;
  }

  return (
    <section className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[65vh] w-full overflow-hidden">
      {/* Dynamic Background Image with Zoom Animation */}
      <div className="absolute inset-0">
        {/* Fallback background for loading/error states */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/50 to-secondary/10" />
        
        {/* Main background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out animate-ken-burns-subtle"
          style={{
            backgroundImage: `url(${currentMovie.heroImage || currentMovie.poster})`,
            opacity: isTransitioning ? 0.6 : (currentImageLoading ? 0.7 : 1),
            transform: isTransitioning ? 'scale(1.02)' : 'scale(1)',
          }}
        />
        
        {/* Image loading overlay */}
        {currentImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin h-4 w-4 sm:h-6 sm:w-6 border-2 border-primary/20 rounded-full">
                <div className="animate-spin h-4 w-4 sm:h-6 sm:w-6 border-2 border-transparent border-t-primary rounded-full"></div>
              </div>
              <p className="text-xs text-foreground/70 font-medium">Loading image...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 transition-opacity duration-500" />
      
      {/* Seamless Bottom Transition - Extended untuk menghilangkan gap */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 bg-gradient-to-b from-transparent via-background/60 to-background transition-opacity duration-500" />
      
      {/* Movie Indicators */}
      {featuredMovies.length > 1 && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex gap-1.5 sm:gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => changeMovie(index)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-500 ease-out touch-manipulation ${
                index === currentMovieIndex 
                  ? 'bg-primary scale-125 shadow-lg shadow-primary/50' 
                  : 'bg-white/50 hover:bg-white/70 hover:scale-110 active:scale-95'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-end">
        <div ref={contentRef} className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-3xl w-full">
          {/* Movie Badge */}
          <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 transition-all duration-300 ease-out transform ${
            isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            <Badge variant="secondary" className="bg-primary/20 text-primary-foreground border-primary/30 font-semibold shadow-sm transition-all duration-500 hover:scale-105 text-xs sm:text-sm">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {rating.toFixed(1)}
            </Badge>
            <Badge variant="outline" className="text-foreground/80 border-border/60 bg-background/80 backdrop-blur-sm font-medium shadow-sm transition-all duration-500 hover:scale-105 text-xs sm:text-sm">
              {reviewCount} reviews
            </Badge>
            <Badge variant="outline" className="text-foreground/80 border-border/60 bg-background/80 backdrop-blur-sm font-medium shadow-sm transition-all duration-500 hover:scale-105 text-xs sm:text-sm">
              <Calendar className="w-3 h-3 mr-1" />
              {currentMovie.year}
            </Badge>
          </div>

          {/* Movie Title */}
          <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 text-foreground leading-tight tracking-tight drop-shadow-lg transition-all duration-300 ease-out transform ${
            isTransitioning ? 'opacity-0 translate-x-8 scale-95' : 'opacity-100 translate-x-0 scale-100'
          }`}>
            {currentMovie.title}
          </h1>

          {/* Movie Info */}
          <div className={`flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 mb-2 sm:mb-3 text-foreground/90 text-xs sm:text-sm md:text-base transition-all duration-300 ease-out transform delay-50 ${
            isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            {currentMovie.duration && (
              <div className="flex items-center gap-1 bg-background/60 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full border border-border/40 transition-all duration-300 hover:scale-105">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">{currentMovie.duration}</span>
              </div>
            )}
            {currentMovie.director?.name && (
              <div className="bg-background/60 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full border border-border/40 transition-all duration-300 hover:scale-105">
                <span className="font-medium">Directed by {currentMovie.director.name}</span>
              </div>
            )}
          </div>

          {/* Genres */}
          <div className={`mb-3 sm:mb-4 transition-all duration-300 ease-out transform delay-100 ${
            isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            <p className="text-xs sm:text-sm font-medium text-foreground/90 mb-1 sm:mb-1.5 drop-shadow-sm">Genres:</p>
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {currentMovie.genres?.map((genre, index) => (
                <Badge key={index} variant="secondary" className="bg-secondary/70 text-secondary-foreground font-medium border border-border/40 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-md text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1">
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className={`mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base text-foreground/85 leading-relaxed max-w-2xl font-normal bg-background/40 backdrop-blur-sm p-2 sm:p-3 rounded-lg border border-border/30 shadow-sm transition-all duration-300 ease-out transform delay-150 ${
            isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            {currentMovie.description || "An amazing cinematic experience awaits you."}
          </p>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-2 sm:gap-3 transition-all duration-300 ease-out transform delay-200 ${
            isTransitioning ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
          }`}>
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 border border-primary/20 group touch-manipulation"
            >
              <Play className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2 transition-transform duration-300 group-hover:scale-110" />
              Watch Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-foreground border-border/60 bg-background/80 backdrop-blur-sm px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105 hover:bg-accent hover:text-accent-foreground hover:shadow-2xl shadow-lg group touch-manipulation"
              asChild
            >
              <Link to={`/movies/${currentMovie._id}`}>
                <Info className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2 transition-transform duration-300 group-hover:scale-110" />
                More Info
              </Link>
            </Button>
          </div>
        </div>
      </div>

    </section>
  );
}