 import HeroBanner from "@/components/home/HeroBanner";
import MovieSlider from "@/components/movies/MovieSlider";
import TopCastFeaturesCompact from "@/components/movies/TopCastFeaturesCompact";
import { motion } from "framer-motion";

import useMovies from "@/hooks/use-movies";
import usePublicCasts from "@/hooks/use-public-casts";
import Loader from "@/components/kokonutui/loader";

export default function   Home() {
  const {
    data: moviesData,
    isLoading: isMoviesLoading,
    error: moviesError,
  } = useMovies();
  
  const movies = moviesData?.data || [];
  const {
    data: castsData,
    isLoading: isCastsLoading,
    error: castsError,
  } = usePublicCasts({ limit: 12, page: 1 }); // Limit untuk menampilkan cast terbaik di home
  
  const casts = castsData?.data || [];

  if (isMoviesLoading) {
    return (
      <Loader 
        title="Loading Home"
        subtitle="Please wait while we fetch the latest movies and cast"
        size="lg"
        fullScreen={true}
      />
    );
  }

  if (isCastsLoading) {
    return (
      <Loader 
        title="Loading Home"
        subtitle="Please wait while we fetch the latest movies and cast"
        size="lg"
        fullScreen={true}
      />
    );
  }

  if (moviesError || castsError) {
    const errorMessage = moviesError?.message || castsError?.message || "An error occurred";
    return (
      <p className="text-destructive p-6">Error: {errorMessage}</p>
    );
  }

  return (
    <div className="relative bg-background text-foreground min-h-screen overflow-hidden">
      {/* Footer-style Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-2/10 opacity-50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 pb-6 sm:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeroBanner />
        </motion.div>
        
        {/* MovieSlider dengan animasi - mengurangi y movement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <MovieSlider movies={movies} />
        </motion.div>
        
        {/* TopCast dengan animasi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <TopCastFeaturesCompact cast={casts} />
        </motion.div>
      </div>
    </div>
  );
} 
