import React from "react";
import { cn } from "../../lib/utils";

const Avatar = ({ 
  src, 
  alt, 
  fallback, 
  size = "md", 
  className,
  ...props 
}) => {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm", 
    lg: "h-10 w-10 text-base",
    xl: "h-12 w-12 text-lg",
    "2xl": "h-16 w-16 text-xl"
  };

  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getGradientColors = (name) => {
    if (!name) return "from-gray-400 to-gray-600";
    
    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600", 
      "from-pink-500 to-pink-600",
      "from-red-500 to-red-600",
      "from-orange-500 to-orange-600",
      "from-yellow-500 to-yellow-600",
      "from-green-500 to-green-600",
      "from-teal-500 to-teal-600",
      "from-cyan-500 to-cyan-600",
      "from-indigo-500 to-indigo-600"
    ];
    
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const showImage = src && !imageError;

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center rounded-full text-white font-medium shadow-sm",
        sizeClasses[size],
        showImage ? "bg-gray-200" : `bg-gradient-to-br ${getGradientColors(alt)}`,
        className
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || "User avatar"}
          className="h-full w-full rounded-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <span className="select-none">
          {fallback || getInitials(alt)}
        </span>
      )}
    </div>
  );
};

export default Avatar;
