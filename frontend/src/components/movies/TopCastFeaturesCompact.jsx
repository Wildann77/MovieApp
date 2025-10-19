"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Star, Users, Award, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function TopCastFeaturesCompact({ cast }) {
  // Don't render if no cast data
  if (!cast || cast.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const stats = [
    { icon: Users, label: "Cast", value: cast.length },
    { icon: Star, label: "Rating", value: "4.8" },
    { icon: Award, label: "Awards", value: "12+" },
    { icon: Heart, label: "Fans", value: "98%" },
  ];

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {/* Transparent background - inherits from parent Home page */}
      {/* No background effects here - let it blend with home page background */}
      
      {/* Content */}
      <div className="relative z-10 px-3 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 sm:py-8 lg:py-12 xl:py-16 space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-10">
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2 lg:space-y-3">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 xl:gap-5">
          <div className="p-1.5 sm:p-2 lg:p-3 xl:p-4 bg-primary/10 rounded-lg lg:rounded-xl">
            <Users className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Top Cast
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base xl:text-lg mt-1 lg:mt-2">
              Meet the talented actors and actresses
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 xl:gap-8"
      >
        {stats.map((stat, index) => (
          <Card key={index} className="group hover:shadow-lg lg:hover:shadow-xl transition-all duration-300 hover:scale-105 lg:hover:scale-110 border-0 shadow-sm lg:shadow-md">
            <CardContent className="p-2 sm:p-3 lg:p-4 xl:p-5 text-center space-y-1 lg:space-y-2">
              <div className="flex justify-center">
                <div className="flex h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 xl:h-10 xl:w-10 items-center justify-center rounded-md lg:rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                </div>
              </div>
              <div className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-primary">{stat.value}</div>
              <div className="text-[10px] sm:text-xs lg:text-sm xl:text-base text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Cast Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6"
      >
        {cast.slice(0, 16).map((actor, index) => (
          <motion.div
            key={actor._id}
            variants={itemVariants}
            transition={{ delay: index * 0.03 }}
          >
            <Link to={`/actors/${actor._id}`} className="block">
              <Card className="group hover:shadow-xl lg:hover:shadow-2xl transition-all duration-300 hover:scale-105 lg:hover:scale-110 border-0 shadow-sm lg:shadow-md overflow-hidden cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Avatar className="h-full w-full rounded-none lg:rounded-sm">
                      <AvatarImage 
                        src={actor.photo || actor.photoUrl || actor.imageUrl || actor.profileImage || actor.avatar} 
                        alt={actor.name}
                        className="object-cover group-hover:scale-110 lg:group-hover:scale-115 transition-transform duration-300"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-[10px] sm:text-xs lg:text-sm rounded-none lg:rounded-sm">
                        {actor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Name Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-1 sm:p-1.5 lg:p-2 xl:p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h4 className="font-semibold text-white text-[10px] sm:text-xs lg:text-sm xl:text-base truncate">
                        {actor.name}
                      </h4>
                      <p className="text-white/80 text-[8px] sm:text-xs lg:text-sm">
                        {actor.nationality || actor.bio?.slice(0, 10) || 'Actor'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Card Footer */}
                  <div className="p-1 sm:p-2 lg:p-3 xl:p-4 space-y-0.5 sm:space-y-1 lg:space-y-1.5">
                    <h4 className="font-medium text-[10px] sm:text-xs lg:text-sm xl:text-base truncate group-hover:text-primary transition-colors">
                      {actor.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <p className="text-[8px] sm:text-xs lg:text-sm text-muted-foreground truncate flex-1">
                        {actor.nationality || actor.bio?.slice(0, 10) || 'Actor'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* View More Button */}
      {cast.length > 16 && (
        <motion.div variants={itemVariants} className="text-center">
          <Card className="inline-flex items-center gap-1.5 sm:gap-2 lg:gap-3 xl:gap-4 px-3 sm:px-4 lg:px-6 xl:px-8 py-1.5 sm:py-2 lg:py-3 xl:py-4 cursor-pointer hover:shadow-lg lg:hover:shadow-xl transition-all duration-300 hover:scale-105 lg:hover:scale-110 border-dashed border-2 hover:border-primary/50 lg:hover:border-primary/70">
            <Users className="h-3 w-3 sm:h-3 sm:w-3 lg:h-4 lg:w-4 xl:h-5 xl:w-5 text-muted-foreground" />
            <span className="text-[10px] sm:text-xs lg:text-sm xl:text-base font-medium">
              View all {cast.length} cast
            </span>
          </Card>
        </motion.div>
      )}
      </div>
    </motion.section>
  );
}
