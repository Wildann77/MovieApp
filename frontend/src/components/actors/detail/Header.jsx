"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Calendar, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ActorHeader({ actor }) {
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
    <section className="relative w-full overflow-hidden">
      {/* Background Glow Effects - Same as Footer */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-2/10 opacity-50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-chart-1/5 rounded-full blur-3xl"></div>
      
      {/* Background Image */}
      <div className="w-full h-[700px] relative overflow-hidden" style={{
        boxShadow: "inset 0 -100px 100px -50px hsl(var(--background))",
      }}>
        <img
          src={actor.photoUrl || actor.photo}
          alt={actor.name}
          className="w-full h-full object-cover opacity-20 dark:opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-chart-1/5 to-chart-2/5" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-end z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-end">
            {/* Actor Info */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                {/* Name dengan efek shadow dan gradient */}
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-foreground leading-[0.9] tracking-tight drop-shadow-2xl">
                    {actor.name}
                  </h1>
                  <div className="h-1 w-16 sm:w-20 lg:w-24 bg-gradient-to-r from-primary to-primary/60 rounded-full" />
                </div>
                
                {/* Actor Meta Info dengan styling yang lebih menarik */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 lg:gap-4 text-foreground/90">
                  {actor.dateOfBirth && (
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 bg-background/80 backdrop-blur-sm px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full border border-border/50">
                      <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary flex-shrink-0" />
                      <span className="font-semibold text-xs sm:text-sm lg:text-base">
                        {formatDate(actor.dateOfBirth)}
                        {calculateAge(actor.dateOfBirth) && (
                          <span className="text-muted-foreground ml-1 sm:ml-2 text-xs sm:text-sm lg:text-base">
                            ({calculateAge(actor.dateOfBirth)} years old)
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                  {actor.nationality && (
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 bg-background/80 backdrop-blur-sm px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full border border-border/50">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary flex-shrink-0" />
                      <span className="font-semibold text-xs sm:text-sm lg:text-base">{actor.nationality}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 bg-background/80 backdrop-blur-sm px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full border border-border/50">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary flex-shrink-0" />
                    <span className="font-semibold text-xs sm:text-sm lg:text-base">Actor</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons dengan styling yang lebih menarik */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 lg:gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto flex items-center justify-center"
                  onClick={() => {
                    // Scroll to movies section
                    const moviesSection = document.getElementById('actor-movies');
                    if (moviesSection) {
                      moviesSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <User className="mr-1.5 sm:mr-2 lg:mr-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0" />
                  <span>View Movies</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary/50 hover:border-primary hover:bg-primary/10 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 hover:scale-105 w-full sm:w-auto flex items-center justify-center"
                  onClick={() => {
                    // Open external link if available
                    if (actor.externalLink) {
                      window.open(actor.externalLink, "_blank");
                    }
                  }}
                >
                  <ExternalLink className="mr-1.5 sm:mr-2 lg:mr-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0" />
                  <span>More Info</span>
                </Button>
              </div>
            </div>

            {/* Actor Photo Card */}
            <div className="flex justify-center lg:justify-end order-first lg:order-last">
              <Card className="w-48 sm:w-56 md:w-64 lg:w-72 h-[20rem] sm:h-[24rem] md:h-[26rem] lg:h-[28rem] overflow-hidden shadow-2xl border-0 bg-transparent group hover:scale-105 transition-all duration-300">
                <CardContent className="p-0 h-full w-full relative">
                  <img
                    src={actor.photoUrl || actor.photo}
                    alt={actor.name}
                    className="w-full h-full object-cover bg-gradient-to-br from-muted/20 to-muted/40"
                    loading="lazy"
                    style={{ objectPosition: 'center' }}
                  />
                  {/* Overlay untuk efek hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
