import React, { useState } from "react";
import { useAdminMovies, useDeleteAnyMovie } from "../../../hooks/useAdminMovies";
import { useMasterData } from "../../../hooks/use-master-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { toast } from "sonner";
import MovieDetailsModal from "../modals/MovieDetailsModal";
import MovieEditModal from "../modals/MovieEditModal";
import MovieCreateModal from "../modals/MovieCreateModal";
import { MovieLoadingTable } from "./shared";
import {
  IconSearch,
  IconFilter,
  IconDotsVertical,
  IconTrash,
  IconEdit,
  IconMovie,
  IconCalendar,
  IconStar,
  IconUser,
  IconEye,
  IconMessageCircle,
  IconX,
  IconRefresh,
  IconClearAll,
  IconPlus,
} from "@tabler/icons-react";

export default function MovieManagement() {
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [directorFilter, setDirectorFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const params = {
    search,
    year: yearFilter === "all" ? undefined : yearFilter,
    director: directorFilter === "all" ? undefined : directorFilter,
    page,
    limit: 10,
  };

  const { data: responseData, isLoading, error, refetch } = useAdminMovies(params);
  
  // Extract data and pagination from response
  const data = responseData?.data || [];
  const pagination = responseData?.pagination || {};
  const stats = responseData || {}; // For statistics cards
  const deleteMovie = useDeleteAnyMovie();
  const { data: masterData } = useMasterData();

  const handleDeleteMovie = async (movieId) => {
    try {
      await deleteMovie.mutateAsync(movieId);
      setShowDeleteDialog(false);
      setSelectedMovie(null);
      toast.success("Movie deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to delete movie:", error);
      toast.error("Failed to delete movie");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setYearFilter("all");
    setDirectorFilter("all");
    setPage(1);
  };

  const hasActiveFilters = search || yearFilter !== "all" || directorFilter !== "all";

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString();
  };

  const getUniqueYears = () => {
    if (!data || !Array.isArray(data)) return [];
    const years = data.map(movie => movie.year).filter(Boolean);
    return [...new Set(years)].sort((a, b) => b - a);
  };

  if (error) {
    return (
      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Movie Management</h2>
          <p className="text-muted-foreground mt-2">Manage movies in the system</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <div className="mb-4">
                Failed to load movies. Error: {error.message || "Unknown error"}
              </div>
              <Button onClick={() => refetch()} variant="outline">
                <IconRefresh className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Movie Management</h2>
          <p className="text-muted-foreground mt-2">Manage movies in the system</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <IconPlus className="h-4 w-4" />
          Create Movie
        </Button>
      </div>

      {/* Movie Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
            <IconMovie className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMovies || 0}</div>
            <p className="text-xs text-muted-foreground">
              All movies in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <IconStar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageRating?.toFixed(1) || "0.0"}</div>
            <p className="text-xs text-muted-foreground">
              Out of 5 stars
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <IconMessageCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReviews || 0}</div>
            <p className="text-xs text-muted-foreground">
              User reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <IconCalendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.newMoviesThisMonth || 0}</div>
            <p className="text-xs text-muted-foreground">
              New movies added
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Movies</label>
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, director..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {getUniqueYears().map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Director</label>
              <Select value={directorFilter} onValueChange={setDirectorFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Directors</SelectItem>
                  {Array.isArray(masterData?.directors) ? masterData.directors.map((director) => (
                    <SelectItem key={director._id} value={director._id}>
                      {director.name}
                    </SelectItem>
                  )) : null}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <div className="flex gap-2">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  disabled={!hasActiveFilters}
                  className="flex-1"
                >
                  <IconClearAll className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                <Button
                  onClick={() => refetch()}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <IconRefresh className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Movies</CardTitle>
          <CardDescription>
            Manage movies in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <MovieLoadingTable />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Movie</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Director</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(data) && data.length ? (
                    data.map((movie) => (
                      <TableRow key={movie._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-20 w-14 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                              {movie.poster ? (
                                <img 
                                  src={movie.poster} 
                                  alt={movie.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <IconMovie className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{movie.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {movie.genre?.name || "No genre"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{movie.year}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {movie.director?.name || "Unknown"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <IconUser className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {movie.user?.username || "Unknown"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <IconStar className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">
                              {movie.averageRating?.toFixed(1) || "0.0"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({movie.reviewCount || 0})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <IconCalendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {formatDate(movie.createdAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <IconDotsVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedMovie(movie);
                                  setShowDetailsModal(true);
                                }}
                              >
                                <IconEye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedMovie(movie);
                                  setShowEditModal(true);
                                }}
                              >
                                <IconEdit className="mr-2 h-4 w-4" />
                                Edit Movie
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedMovie(movie);
                                  setShowDeleteDialog(true);
                                }}
                              >
                                <IconTrash className="mr-2 h-4 w-4" />
                                Delete Movie
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center py-8">
                          <IconMovie className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No movies found.</p>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your search or filters.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination && Object.keys(pagination).length > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
                {pagination.totalItems} movies
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={pagination.currentPage <= 1}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium">
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Movie</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedMovie?.title}"? This action cannot be undone and will also delete all associated reviews.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteMovie(selectedMovie?._id)}
              disabled={deleteMovie.isPending}
            >
              {deleteMovie.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Movie Details Modal */}
      {showDetailsModal && selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedMovie(null);
          }}
        />
      )}

      {/* Movie Edit Modal */}
      {showEditModal && selectedMovie && (
        <MovieEditModal
          movie={selectedMovie}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedMovie(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedMovie(null);
            refetch();
          }}
        />
      )}

      {/* Movie Create Modal */}
      {showCreateModal && (
        <MovieCreateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}