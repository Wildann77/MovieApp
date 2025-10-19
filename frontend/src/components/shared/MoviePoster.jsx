import React from "react";
import { cn } from "../../lib/utils";
import { IconMovie } from "@tabler/icons-react";

const MoviePoster = ({ 
  src, 
  alt, 
  size = "md", 
  className,
  ...props 
}) => {
  const sizeClasses = {
    sm: "h-16 w-12",
    md: "h-20 w-14", 
    lg: "h-24 w-18",
    xl: "h-32 w-22",
    "2xl": "h-40 w-28"
  };

  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const showImage = src && !imageError;

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400 shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-105 group",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {showImage ? (
        <>
          <img
            src={src}
            alt={alt || "Movie poster"}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
            onError={handleImageError}
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-2">
          <IconMovie className="h-6 w-6 mb-1" />
          <span className="text-xs text-center leading-tight">No Image</span>
        </div>
      )}
    </div>
  );
};

export default MoviePoster;
