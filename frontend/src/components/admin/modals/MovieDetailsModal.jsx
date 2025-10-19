import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Separator } from "../../ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import {
  IconX,
  IconMovie,
  IconCalendar,
  IconClock,
  IconStar,
  IconUser,
  IconMessageCircle,
  IconEye,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

export default function MovieDetailsModal({ movie, isOpen, onClose, onEdit, onDelete }) {
  if (!movie) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString();
  };

  const formatGenres = (genres) => {
    if (!genres || genres.length === 0) return "No genres";
    return genres.map(genre => genre.name).join(", ");
  };

  const formatCast = (cast) => {
    if (!cast || cast.length === 0) return [];
    return cast.slice(0, 6); // Show only first 6 cast members
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <IconMovie className="h-6 w-6 text-primary" />
            Movie Details: {movie.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Movie Header */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <div className="relative h-80 w-full rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden shadow-lg ring-1 ring-gray-200">
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="flex flex-col items-center justify-center p-4 text-gray-400" 
                  style={{display: movie.poster ? 'none' : 'flex'}}
                >
                  <IconMovie className="h-16 w-16 mb-2" />
                  <span className="text-sm text-center leading-tight">No Image Available</span>
                </div>
              </div>
            </div>

            {/* Movie Info */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">{movie.title}</h2>
                <p className="text-muted-foreground text-lg">{movie.description || "No description available"}</p>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <IconCalendar className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Year</div>
                    <div className="font-semibold">{movie.year}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <IconClock className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-semibold">{movie.duration || "N/A"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <IconStar className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                    <div className="font-semibold">{movie.averageRating?.toFixed(1) || "0.0"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <IconMessageCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                    <div className="font-semibold">{movie.totalReviews || 0}</div>
                  </div>
                </div>
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Genres</div>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre, index) => (
                      <Badge key={index} variant="secondary">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Detailed Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Director */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IconUser className="h-5 w-5 text-primary" />
                  Director
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage 
                      src={movie.director?.photoUrl || movie.director?.photo || movie.director?.imageUrl || movie.director?.profileImage || movie.director?.avatar} 
                      alt={movie.director?.name || "Director"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                      {movie.director?.name?.charAt(0)?.toUpperCase() || "D"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-lg">{movie.director?.name || "Unknown Director"}</div>
                    <div className="text-sm text-muted-foreground">Director</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Writers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IconUser className="h-5 w-5 text-primary" />
                  Writers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {movie.writers && movie.writers.length > 0 ? (
                  <div className="space-y-2">
                    {movie.writers.slice(0, 3).map((writer, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={writer.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(writer.name)}&background=random&size=40`} 
                            alt={writer.name || "Writer"}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-secondary/10 text-secondary-foreground font-medium">
                            {writer.name?.charAt(0)?.toUpperCase() || "W"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{writer.name || "Unknown Writer"}</div>
                        </div>
                      </div>
                    ))}
                    {movie.writers.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{movie.writers.length - 3} more writers
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No writers listed</div>
                )}
              </CardContent>
            </Card>

            {/* User who created the movie */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IconUser className="h-5 w-5 text-primary" />
                  Created by
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage 
                      src={movie.user?.profilePic || movie.user?.avatar || movie.user?.profilePicture || movie.user?.imageUrl} 
                      alt={movie.user?.username || "User"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-green-100 text-green-700 font-semibold text-lg">
                      {movie.user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-lg">{movie.user?.username || "Unknown User"}</div>
                    <div className="text-sm text-muted-foreground">Movie Creator</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cast Section */}
          {movie.cast && movie.cast.length > 0 && (
            <>
              <Separator />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <IconUser className="h-5 w-5 text-primary" />
                    Cast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {formatCast(movie.cast).map((actor, index) => (
                      <div key={index} className="text-center">
                        <Avatar className="h-20 w-20 mx-auto mb-3 border-2 border-border/20">
                          <AvatarImage 
                            src={actor.photoUrl || actor.photo || actor.imageUrl || actor.profileImage || actor.avatar} 
                            alt={actor.name || "Actor"}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                            {actor.name?.charAt(0)?.toUpperCase() || "A"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm font-medium truncate">{actor.name || "Unknown Actor"}</div>
                        <div className="text-xs text-muted-foreground truncate">{actor.character || "Actor"}</div>
                      </div>
                    ))}
                  </div>
                  {movie.cast.length > 6 && (
                    <div className="text-center mt-4 text-sm text-muted-foreground">
                      And {movie.cast.length - 6} more cast members...
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Additional Info */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Movie Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{movie.duration || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trailer:</span>
                  <span className="max-w-[200px] truncate">
                    {movie.trailer ? (
                      <a 
                        href={movie.trailer} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Watch Trailer
                      </a>
                    ) : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gallery Images:</span>
                  <span>{movie.gallery?.length || 0} images</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hero Image:</span>
                  <span>{movie.heroImage ? "Available" : "N/A"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(movie.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{formatDate(movie.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Movie ID:</span>
                  <span className="font-mono text-xs">{movie._id}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Separator />
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={onClose} className="flex items-center gap-2">
              <IconX className="h-4 w-4" />
              Close
            </Button>
            <div className="flex gap-3">
              <Button onClick={() => onEdit(movie)} className="flex items-center gap-2">
                <IconEdit className="h-4 w-4" />
                Edit Movie
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => onDelete(movie)}
                className="flex items-center gap-2"
              >
                <IconTrash className="h-4 w-4" />
                Delete Movie
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
