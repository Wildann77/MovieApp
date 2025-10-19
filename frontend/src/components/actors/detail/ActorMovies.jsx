import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Film } from "lucide-react";
import { useMoviesByActor } from "@/hooks/use-movies-by-actor";
import MediaCard from "@/components/media-card";

export default function ActorMovies({ actorId }) {
  // Get movies by actor using the new hook
  const { data: moviesData, isLoading, isError } = useMoviesByActor(actorId, { limit: 50 });
  
  // Ensure actorMovies is always an array
  const actorMovies = Array.isArray(moviesData?.movies) ? moviesData.movies : [];

  if (isLoading) {
    return (
      <Card id="actor-movies" className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground text-xl">
            <Film className="h-6 w-6 text-primary" />
            Movies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full bg-muted-foreground/20" />
                <Skeleton className="h-6 w-3/4 bg-muted-foreground/20" />
                <Skeleton className="h-4 w-1/2 bg-muted-foreground/20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card id="actor-movies" className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground text-xl">
            <Film className="h-6 w-6 text-primary" />
            Movies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Film className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              Failed to load movies. Please try again later.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (actorMovies.length === 0) {
    return (
      <Card id="actor-movies" className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground text-xl">
            <Film className="h-6 w-6 text-primary" />
            Movies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Film className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              No movies found for this actor.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="actor-movies" className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground text-xl">
          <Film className="h-6 w-6 text-primary" />
          Movies ({actorMovies.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {actorMovies.map((movie) => (
            <div key={movie._id} className="flex justify-center group">
              <div className="transform transition-all duration-300 hover:scale-105 hover:z-10">
                <MediaCard
                  posterSrc={movie.poster}
                  title={movie.title}
                  year={movie.year}
                  rating={movie.averageRating || movie.rating || "N/A"}
                  movieId={movie._id}
                  onAdd={() => console.log('Add to watchlist:', movie.title)}
                  onTrailer={() => movie.trailer ? window.open(movie.trailer, '_blank') : null}
                  className="w-full max-w-[160px] shadow-md hover:shadow-xl transition-shadow duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
