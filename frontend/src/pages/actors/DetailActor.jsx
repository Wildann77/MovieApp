import { useParams } from "react-router-dom";
import { useActor } from "@/hooks/use-actors";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, User, Loader2 } from "lucide-react";
import Loader from "@/components/kokonutui/loader";

// Import komponen detail actor
import ActorHeader from "@/components/actors/detail/Header";
import ActorBio from "@/components/actors/detail/Bio";
import ActorInfo from "@/components/actors/detail/ActorInfo";
import ActorMovies from "@/components/actors/detail/ActorMovies";

export default function ActorDetailPage() {
  const params = useParams();
  const { data: actor, isLoading, isError } = useActor(params?.id);

  if (isLoading) {
    return (
      <Loader 
        title="Loading Actor Details"
        subtitle="Please wait while we fetch the actor information"
        size="lg"
        fullScreen={true}
      />
    );
  }

  if (isError || !actor) {
    return (
      <div className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center p-4">
        {/* Background Glow Effects - Same as Footer */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-2/10 opacity-50"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl"></div>
        
        <Card className="relative z-10 w-full max-w-lg shadow-xl border-border/50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Actor Not Found</h2>
              <p className="text-muted-foreground text-lg">
                Gagal mengambil data aktor. Silakan coba lagi nanti.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Actor ID: {params?.id}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Glow Effects - Same as Footer */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-2/10 opacity-50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section dengan Actor Header */}
        <ActorHeader actor={actor} />

        {/* Main Content Area - Improved responsive layout */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-3 space-y-6 sm:space-y-8">
              {/* Actor Bio */}
              <ActorBio bio={actor.bio} />
              
              {/* Actor Movies */}
              <div id="actor-movies">
                <ActorMovies actorId={actor._id} />
              </div>
            </div>
            
            {/* Right Column - Actor Info - Sticky on larger screens */}
            <div className="xl:col-span-1">
              <div className="sticky top-6 space-y-6">
                <ActorInfo actor={actor} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
