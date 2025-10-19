"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  PenTool, 
  Film, 
  Users, 
  Calendar, 
  Clock, 
  Star,
  Award,
  Globe,
  DollarSign,
  TrendingUp,
  Eye,
  Heart
} from "lucide-react";

export default function MovieMeta({ movie }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Movie Info Card */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
            <Film className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Movie Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="font-semibold text-foreground text-sm sm:text-base">Year</span>
              </div>
              <span className="font-bold text-base sm:text-lg text-foreground">{movie.year}</span>
            </div>
            
            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 sm:gap-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="font-semibold text-foreground text-sm sm:text-base">Duration</span>
              </div>
              <span className="font-bold text-base sm:text-lg text-foreground">{movie.duration}</span>
            </div>
            
            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 sm:gap-3">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-foreground text-sm sm:text-base">Rating</span>
              </div>
              <span className="font-bold text-base sm:text-lg text-yellow-400">{movie.averageRating || "N/A"}</span>
            </div>

            {/* Additional movie data jika tersedia */}
            {movie.language && (
              <div className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="font-semibold text-foreground text-sm sm:text-base">Language</span>
                </div>
                <span className="font-bold text-base sm:text-lg text-foreground">{movie.language}</span>
              </div>
            )}

            {movie.budget && (
              <div className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="font-semibold text-foreground text-sm sm:text-base">Budget</span>
                </div>
                <span className="font-bold text-base sm:text-lg text-foreground">${movie.budget.toLocaleString()}</span>
              </div>
            )}

            {movie.revenue && (
              <div className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="font-semibold text-foreground text-sm sm:text-base">Revenue</span>
                </div>
                <span className="font-bold text-base sm:text-lg text-foreground">${movie.revenue.toLocaleString()}</span>
              </div>
            )}

            {movie.viewCount && (
              <div className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="font-semibold text-foreground text-sm sm:text-base">Views</span>
                </div>
                <span className="font-bold text-base sm:text-lg text-foreground">{movie.viewCount.toLocaleString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Director Card */}
      {movie.director && (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Director
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-lg">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                <AvatarImage 
                  src={movie.director.photo || movie.director.imageUrl || movie.director.profileImage || movie.director.avatar} 
                  alt={movie.director.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-lg sm:text-xl font-bold bg-primary/20 text-primary">
                  {movie.director.name?.charAt(0)?.toUpperCase() || "D"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-foreground font-semibold text-base sm:text-lg">{movie.director.name}</p>
                {movie.director.bio && (
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1 sm:mt-2 leading-relaxed">{movie.director.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Writers Card */}
      {movie.writers?.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
              <PenTool className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Writers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              {movie.writers.map((writer, index) => (
                <div key={index} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarImage 
                      src={writer.photo || writer.imageUrl} 
                      alt={writer.name}
                    />
                    <AvatarFallback className="text-xs sm:text-sm font-semibold bg-primary/20 text-primary">
                      {writer.name?.charAt(0) || "W"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-foreground font-semibold text-sm sm:text-base">{writer.name}</p>
                    {writer.bio && (
                      <p className="text-muted-foreground text-xs sm:text-sm mt-1 leading-relaxed">{writer.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Genres Card */}
      {movie.genres?.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
              <Film className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Genres
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}

    </div>
  );
}
