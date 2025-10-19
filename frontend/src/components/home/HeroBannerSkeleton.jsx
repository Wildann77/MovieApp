import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Play, Info, Calendar, Clock } from "lucide-react";

export default function HeroBannerSkeleton() {
  return (
    <section className="relative h-[75vh] w-full overflow-hidden">
      {/* Background skeleton */}
      <div className="absolute inset-0">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      {/* Movie indicators skeleton */}
      <div className="absolute top-6 right-6 z-20 flex gap-2">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <Skeleton key={index} className="w-2 h-2 rounded-full" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="relative z-10 h-full flex items-end">
        <div className="p-10 max-w-3xl">
          {/* Movie badges skeleton */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          {/* Movie title skeleton */}
          <div className="mb-4">
            <Skeleton className="h-12 w-80 mb-2 rounded-lg" />
            <Skeleton className="h-8 w-64 rounded-lg" />
          </div>

          {/* Movie info skeleton */}
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-48 rounded-full" />
          </div>

          {/* Genres skeleton */}
          <div className="mb-6">
            <Skeleton className="h-4 w-16 mb-2" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>

          {/* Description skeleton */}
          <div className="mb-8">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Action buttons skeleton */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-12 w-32 rounded-lg" />
            <Skeleton className="h-12 w-28 rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
