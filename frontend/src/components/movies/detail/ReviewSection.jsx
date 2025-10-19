import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Star, User, Calendar, Flag, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useReportReview } from "../../../hooks/use-report-review";

const ReportReviewDialog = ({ isOpen, onClose, review, onSubmit }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(review._id, reason.trim());
      setReason("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Report Review
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for reporting this review. This helps us understand the issue better.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={review?.user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(review?.user?.username || 'User')}&background=random&color=fff&size=32`} 
                  alt={review?.user?.username || "Unknown User"} 
                />
                <AvatarFallback className="h-8 w-8 text-xs bg-muted">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{review?.user?.username || "Unknown User"}</div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < review?.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{review?.comment}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Reason for reporting:</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please describe why you're reporting this review..."
              className="mt-2"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleSubmit}
            disabled={!reason.trim()}
          >
            <Flag className="h-4 w-4 mr-2" />
            Report Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function ReviewSection({ reviews }) {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const reportReviewMutation = useReportReview();

  const handleReportReview = (reviewId, reason) => {
    reportReviewMutation.mutate({ reviewId, reason });
  };

  const openReportDialog = (review) => {
    setSelectedReview(review);
    setReportDialogOpen(true);
  };
  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground text-xl">
          <MessageSquare className="h-6 w-6 text-primary" />
          Reviews
          <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-primary/20">
            {reviews.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No reviews yet</h3>
            <p className="text-muted-foreground">
              Be the first to share your thoughts about this movie!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, idx) => (
              <Card key={idx} className="bg-muted/30 border-border/30 hover:bg-muted/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                       <Avatar className="h-12 w-12">
                         <AvatarImage 
                           src={review.user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.username || 'User')}&background=random&color=fff&size=48`} 
                           alt={review.user?.username || "Anonymous User"}
                         />
                         <AvatarFallback className="text-sm font-semibold bg-primary/20 text-primary">
                           {(review.user?.username || "Anonymous User").charAt(0)}
                         </AvatarFallback>
                       </Avatar>
                       <div>
                         <p className="text-base font-semibold text-foreground">
                           {review.user?.username || "Anonymous User"}
                         </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-yellow-400">
                            {review.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                     <div className="flex items-center gap-2">
                       {review.createdAt && (
                         <div className="flex items-center gap-1 text-muted-foreground text-sm">
                           <Calendar className="h-4 w-4" />
                           <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                         </div>
                       )}
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => openReportDialog(review)}
                         className="text-muted-foreground hover:text-destructive"
                       >
                         <Flag className="h-4 w-4" />
                       </Button>
                     </div>
                  </div>
                  <p className="text-foreground leading-relaxed">
                    {review.comment}
                  </p>
                  {review.isReported && (
                    <Badge variant="destructive" className="mt-3">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Reported
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>

    <ReportReviewDialog
      isOpen={reportDialogOpen}
      onClose={() => setReportDialogOpen(false)}
      review={selectedReview}
      onSubmit={handleReportReview}
    />
  </>
  );
}
