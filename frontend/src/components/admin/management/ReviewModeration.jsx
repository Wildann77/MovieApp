import React, { useState } from "react";
import { useAdminReviews, useDeleteAnyReview } from "../../../hooks/useAdminReviews";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { toast } from "sonner";
import { ReviewRating, ReportedBadge, ReviewLoadingTable } from "./shared";
import {
  IconSearch,
  IconFilter,
  IconDotsVertical,
  IconTrash,
  IconMessageCircle,
  IconStar,
  IconUser,
  IconMovie,
  IconCalendar,
  IconAlertTriangle,
  IconX,
  IconRefresh,
  IconClearAll,
} from "@tabler/icons-react";

export default function ReviewModeration() {
  const [search, setSearch] = useState("");
  const [reportedFilter, setReportedFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewReviewDialog, setShowViewReviewDialog] = useState(false);

  const params = {
    search,
    reported: reportedFilter === "all" ? undefined : reportedFilter,
    rating: ratingFilter === "all" ? undefined : ratingFilter,
    page,
    limit: 10,
  };

  const { data: responseData, isLoading, error, refetch } = useAdminReviews(params);

  // Extract data and pagination from response
  const data = responseData?.data || [];
  const pagination = responseData?.pagination || {};
  const stats = responseData || {}; // For statistics cards
  const deleteReview = useDeleteAnyReview();

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview.mutateAsync(reviewId);
      setShowDeleteDialog(false);
      setSelectedReview(null);
      toast.success("Review deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setReportedFilter("all");
    setRatingFilter("all");
    setPage(1);
  };

  const hasActiveFilters = search || reportedFilter !== "all" || ratingFilter !== "all";

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleString();
  };

  const truncateComment = (comment, maxLength = 100) => {
    if (!comment) return "No comment";
    if (comment.length <= maxLength) return comment;
    return comment.substring(0, maxLength) + "...";
  };

  if (error) {
    return (
      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Review Moderation</h2>
          <p className="text-muted-foreground mt-2">Moderate user reviews and reports</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <div className="mb-4">
                Failed to load reviews. Error: {error.message || "Unknown error"}
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Review Moderation</h2>
        <p className="text-muted-foreground mt-2">Moderate user reviews and reports</p>
      </div>

      {/* Review Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <IconMessageCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalReviews || 0}</div>
            <p className="text-xs text-muted-foreground">
              All user reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reported Reviews</CardTitle>
            <IconAlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.reportedReviews || 0}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
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
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <IconCalendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.thisMonthReviews || 0}</div>
            <p className="text-xs text-muted-foreground">
              New reviews
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
              <label className="text-sm font-medium">Search Reviews</label>
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by comment or movie..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reported Status</label>
              <Select value={reportedFilter} onValueChange={setReportedFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="true">Reported Only</SelectItem>
                  <SelectItem value="false">Not Reported</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
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

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>
            Manage and moderate user reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ReviewLoadingTable />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Review</TableHead>
                    <TableHead>Movie</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(data) && data.length ? (
                    data.map((review) => (
                      <TableRow key={review._id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {truncateComment(review.comment)}
                            </p>
                            <ReportedBadge isReported={review.isReported} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <IconMovie className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {review.movie?.title || "Unknown Movie"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={review.user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.username || 'User')}&background=random&color=fff&size=24`}
                                alt={review.user?.username || "Unknown User"}
                              />
                              <AvatarFallback>
                                <IconUser className="h-3 w-3" />
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {review.user?.username || "Unknown User"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <ReviewRating rating={review.rating} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <IconCalendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={review.isReported ? "destructive" : "default"}>
                            {review.isReported ? "Reported" : "Active"}
                          </Badge>
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
                                  setSelectedReview(review);
                                  setShowViewReviewDialog(true);
                                }}
                              >
                                <IconMessageCircle className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedReview(review);
                                  setShowDeleteDialog(true);
                                }}
                              >
                                <IconTrash className="mr-2 h-4 w-4" />
                                Delete Review
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
                          <IconMessageCircle className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No reviews found.</p>
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
                {pagination.totalItems} reviews
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
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
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
              onClick={() => handleDeleteReview(selectedReview?._id)}
              disabled={deleteReview.isPending}
            >
              {deleteReview.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Review Dialog */}
      <Dialog open={showViewReviewDialog} onOpenChange={setShowViewReviewDialog}>
        <DialogContent className="max-w-2xl review-detail-dialog">
          <DialogHeader className="review-detail-header">
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Full details of the selected review
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 review-detail-avatar">
                  <AvatarImage
                    src={selectedReview.user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedReview.user?.username || 'User')}&background=random&color=fff&size=48`}
                    alt={selectedReview.user?.username || "Unknown User"}
                  />
                  <AvatarFallback>
                    <IconUser className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="review-user-info">
                  <h3 className="font-semibold text-lg">{selectedReview.user?.username || "Unknown User"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedReview.createdAt)}
                  </p>
                </div>
              </div>

              <div className="review-content-section">
                <h4 className="font-medium mb-3 text-base">Movie</h4>
                <p className="review-movie-title text-base">{selectedReview.movie?.title || "Unknown Movie"}</p>
              </div>

              <div className="review-content-section">
                <h4 className="font-medium mb-3 text-base">Rating</h4>
                <div className="review-rating-display">
                  <ReviewRating rating={selectedReview.rating} />
                </div>
              </div>

              <div className="review-content-section">
                <h4 className="font-medium mb-3 text-base">Comment</h4>
                <p className="review-comment-text">
                  {selectedReview.comment || "No comment provided"}
                </p>
              </div>

              {selectedReview.isReported && (
                <div className="review-report-section">
                  <div className="space-y-4">
                    <div className="review-report-header">
                      <IconAlertTriangle className="h-5 w-5 review-report-icon" />
                      <span className="text-base font-semibold">
                        This review has been reported
                      </span>
                    </div>
                    {selectedReview.reportReason && (
                      <div className="ml-6">
                        <p className="text-sm font-semibold text-destructive mb-2">Report Reason:</p>
                        <div className="report-reason-box">
                          <p className="text-sm">
                            {selectedReview.reportReason}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedReview.reportedBy && selectedReview.reportedBy.length > 0 && (
                      <div className="ml-6">
                        <p className="text-sm font-semibold text-destructive mb-3">Reported by:</p>
                        <div className="space-y-3">
                          {selectedReview.reportedBy.map((report, index) => (
                            <div key={index} className="report-reporter-box">
                              <div className="report-reporter-info">
                                <p className="report-reporter-name">
                                  {report.user?.username || "Unknown User"}
                                </p>
                                <p className="report-reporter-date">
                                  {new Date(report.reportedAt).toLocaleString()}
                                </p>
                                {report.reason && (
                                  <p className="report-reporter-reason">{report.reason}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="border-t border-border pt-4">
            <Button onClick={() => setShowViewReviewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}