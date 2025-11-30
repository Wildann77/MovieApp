import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function CastSection({ cast }) {
  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground text-xl">
          <Users className="h-6 w-6 text-primary" />
          Cast
          <Badge variant="outline" className="ml-2">
            {cast.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {cast.map((actor) => (
            <Link key={actor._id} to={`/actors/${actor._id}`} className="block">
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="relative">
                  <Avatar className="h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 group-hover:scale-105 transition-transform duration-300">
                    <AvatarImage 
                      src={actor.imageUrl || actor.photo || actor.profileImage || actor.avatar} 
                      alt={actor.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl font-bold bg-primary/20 text-primary">
                      {actor.name?.charAt(0)?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                
                <div className="mt-3 text-center space-y-1">
                  <p className="text-foreground font-semibold text-sm md:text-base leading-tight group-hover:text-primary transition-colors">
                    {actor.name}
                  </p>
                  {actor.character && (
                    <p className="text-muted-foreground text-xs md:text-sm leading-tight">
                      as {actor.character}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
