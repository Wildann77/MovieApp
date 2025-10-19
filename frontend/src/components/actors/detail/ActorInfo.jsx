"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Calendar, 
  MapPin, 
  Globe,
  Star,
  Film
} from "lucide-react";

export default function ActorInfo({ actor }) {
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Actor Info Card */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Actor Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {actor.dateOfBirth && (
              <div className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="font-semibold text-foreground text-sm sm:text-base">Birth Date</span>
                </div>
                <span className="font-bold text-base sm:text-lg text-foreground">{formatDate(actor.dateOfBirth)}</span>
              </div>
            )}
            
            {actor.dateOfBirth && calculateAge(actor.dateOfBirth) && (
              <div className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="font-semibold text-foreground text-sm sm:text-base">Age</span>
                </div>
                <span className="font-bold text-base sm:text-lg text-foreground">{calculateAge(actor.dateOfBirth)} years</span>
              </div>
            )}

            {actor.nationality && (
              <div className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="font-semibold text-foreground text-sm sm:text-base">Nationality</span>
                </div>
                <span className="font-bold text-base sm:text-lg text-foreground">{actor.nationality}</span>
              </div>
            )}

            <div className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 sm:gap-3">
                <Film className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="font-semibold text-foreground text-sm sm:text-base">Profession</span>
              </div>
              <span className="font-bold text-base sm:text-lg text-foreground">Actor</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actor Photo Card */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Profile Photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Avatar className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48">
              <AvatarImage 
                src={actor.photoUrl || actor.photo} 
                alt={actor.name}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl sm:text-3xl md:text-4xl font-bold bg-primary/20 text-primary">
                {actor.name?.charAt(0)?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
