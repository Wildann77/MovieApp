import React from "react";
import { useAdminStats } from "../../../hooks/useAdminStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  IconUsers,
  IconMovie,
  IconMessageCircle,
  IconTrendingUp,
  IconCalendar,
  IconStar,
  IconVideo,
  IconUserEdit,
  IconTag,
} from "@tabler/icons-react";

const StatCard = ({ title, value, description, icon: Icon, trend, color = "blue" }) => (
  <Card className="hover:shadow-md transition-shadow duration-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
      <CardTitle className="text-xs sm:text-sm font-medium leading-tight">{title}</CardTitle>
      <Icon className={`h-3 w-3 sm:h-4 sm:w-4 text-${color}-600 flex-shrink-0`} />
    </CardHeader>
    <CardContent className="pt-0">
      <div className="text-xl sm:text-2xl font-bold mb-1">{value}</div>
      <p className="text-xs text-muted-foreground leading-tight">{description}</p>
      {trend && (
        <div className="flex items-center mt-2 sm:mt-3">
          <IconTrendingUp className="h-3 w-3 text-green-600 mr-1 flex-shrink-0" />
          <span className="text-xs text-green-600 leading-tight">{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const LoadingCard = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
      <Skeleton className="h-3 w-20 sm:h-4 sm:w-24" />
      <Skeleton className="h-3 w-3 sm:h-4 sm:w-4" />
    </CardHeader>
    <CardContent className="pt-0">
      <Skeleton className="h-6 w-12 sm:h-8 sm:w-16 mb-1" />
      <Skeleton className="h-3 w-24 sm:w-32" />
    </CardContent>
  </Card>
);

export default function SystemStats() {
  const { data: stats, isLoading, error, refetch } = useAdminStats();

  // Debug logging
  console.log("📊 SystemStats render - isLoading:", isLoading, "error:", error, "stats:", stats);

  if (error) {
    return (
      <div className="px-2 sm:px-4 lg:px-6">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">System Statistics</h2>
          <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">Overview of system metrics and analytics</p>
        </div>
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center text-red-600">
              <div className="mb-4 text-sm sm:text-base">
                Failed to load statistics. Error: {error.message || "Unknown error"}
              </div>
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                className="w-full sm:w-auto min-h-[44px] touch-manipulation"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 lg:px-6">
      <div className="mb-4 sm:mb-6 flex flex-col space-y-3 sm:space-y-0">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">System Statistics</h2>
          <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">Overview of system metrics and analytics</p>
        </div>
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          size="sm" 
          className="w-full sm:w-auto self-start sm:self-center touch-manipulation min-h-[44px]"
        >
          Refresh Data
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
        {isLoading ? (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </>
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={stats?.overview?.totalUsers || 0}
              description="Registered users"
              icon={IconUsers}
              trend={`+${stats?.recentActivity?.recentUsers || 0} this month`}
              color="blue"
            />
            <StatCard
              title="Active Users"
              value={stats?.overview?.activeUsers || 0}
              description="Currently active"
              icon={IconUsers}
              color="green"
            />
            <StatCard
              title="Total Movies"
              value={stats?.overview?.totalMovies || 0}
              description="Movies in database"
              icon={IconMovie}
              trend={`+${stats?.recentActivity?.recentMovies || 0} this month`}
              color="purple"
            />
            <StatCard
              title="Total Reviews"
              value={stats?.overview?.totalReviews || 0}
              description="User reviews"
              icon={IconMessageCircle}
              trend={`+${stats?.recentActivity?.recentReviews || 0} this month`}
              color="orange"
            />
          </>
        )}
      </div>

      {/* Master Data Overview Cards */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Master Data Overview</h3>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </>
          ) : (
            <>
              <StatCard
                title="Total Actors"
                value={stats?.overview?.totalActors || 0}
                description="Actors in database"
                icon={IconUsers}
                color="blue"
              />
              <StatCard
                title="Total Directors"
                value={stats?.overview?.totalDirectors || 0}
                description="Directors in database"
                icon={IconVideo}
                color="green"
              />
              <StatCard
                title="Total Writers"
                value={stats?.overview?.totalWriters || 0}
                description="Writers in database"
                icon={IconUserEdit}
                color="purple"
              />
              <StatCard
                title="Total Genres"
                value={stats?.overview?.totalGenres || 0}
                description="Genres in database"
                icon={IconTag}
                color="orange"
              />
            </>
          )}
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        {/* Top Genres Chart */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <IconStar className="h-4 w-4 sm:h-5 sm:w-5" />
              Top Genres
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Most popular movie genres</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : stats?.analytics?.topGenres?.length > 0 ? (
              <div className="space-y-3">
                {stats.analytics.topGenres.map((genre, index) => (
                  <div key={genre._id || index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{genre.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{genre.count} movies</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No genre data available</p>
            )}
          </CardContent>
        </Card>

        {/* Top Directors Chart */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <IconMovie className="h-4 w-4 sm:h-5 sm:w-5" />
              Top Directors
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Most prolific directors</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : stats?.analytics?.topDirectors?.length > 0 ? (
              <div className="space-y-3">
                {stats.analytics.topDirectors.map((director, index) => (
                  <div key={director._id || index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{director.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{director.count} movies</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No director data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mt-4 sm:mt-6">
        {/* Genres Bar Chart */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <IconStar className="h-4 w-4 sm:h-5 sm:w-5" />
              Genres Distribution
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Movie count by genre</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-48 sm:h-64 w-full" />
            ) : stats?.analytics?.topGenres?.length > 0 ? (
              <div className="overflow-x-auto">
                <ChartContainer config={{}} className="min-w-[300px]">
                  <BarChart 
                    data={stats.analytics.topGenres} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10, fill: 'currentColor' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: 'currentColor' }} 
                      width={40}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--primary))" 
                      radius={[2, 2, 0, 0]} 
                      maxBarSize={60}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="h-48 sm:h-64 flex flex-col items-center justify-center text-muted-foreground px-4">
                <div className="text-base sm:text-lg font-medium mb-2 text-center">No genre data available</div>
                <div className="text-xs sm:text-sm text-center">Make sure you have movies with genres in your database</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Directors Bar Chart */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <IconVideo className="h-4 w-4 sm:h-5 sm:w-5" />
              Directors Distribution
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Movie count by director</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-48 sm:h-64 w-full" />
            ) : stats?.analytics?.topDirectors?.length > 0 ? (
              <div className="overflow-x-auto">
                <ChartContainer config={{}} className="min-w-[300px]">
                  <BarChart 
                    data={stats.analytics.topDirectors} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10, fill: 'currentColor' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: 'currentColor' }} 
                      width={40}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--secondary))" 
                      radius={[2, 2, 0, 0]} 
                      maxBarSize={60}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="h-48 sm:h-64 flex flex-col items-center justify-center text-muted-foreground px-4">
                <div className="text-base sm:text-lg font-medium mb-2 text-center">No director data available</div>
                <div className="text-xs sm:text-sm text-center">Make sure you have movies with directors in your database</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Actors Chart */}
      <div className="mt-4 sm:mt-6">
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <IconUsers className="h-4 w-4 sm:h-5 sm:w-5" />
              Top Actors
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Most featured actors in movies</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : stats?.analytics?.topActors?.length > 0 ? (
              <div className="space-y-3">
                {stats.analytics.topActors.map((actor, index) => (
                  <div key={actor._id || index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{actor.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{actor.count} movies</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No actor data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rating Statistics */}
      <div className="mt-4 sm:mt-6">
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <IconStar className="h-4 w-4 sm:h-5 sm:w-5" />
              Rating Statistics
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Overall system rating metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
                <Skeleton className="h-16 sm:h-20 w-full" />
                <Skeleton className="h-16 sm:h-20 w-full" />
                <Skeleton className="h-16 sm:h-20 w-full" />
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="text-center p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                    {stats?.analytics?.averageRating?.toFixed(1) || "0.0"}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Average Rating</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">
                    {stats?.analytics?.totalRatings || 0}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Total Ratings</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                    {stats?.overview?.adminUsers || 0}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Admin Users</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

