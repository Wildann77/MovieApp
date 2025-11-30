import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Quote, User } from "lucide-react";

export default function ActorBio({ bio }) {
  if (!bio) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Biography
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-6 sm:py-8">
            <User className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50 mx-auto mb-3 sm:mb-4" />
            <p className="text-muted-foreground text-base sm:text-lg px-4">
              No biography available for this actor.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-foreground text-lg sm:text-xl">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          Biography
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative">
          <Quote className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 h-6 w-6 sm:h-8 sm:w-8 text-primary/20" />
          <p className="text-foreground leading-relaxed text-base sm:text-lg pl-4 sm:pl-6">
            {bio}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
