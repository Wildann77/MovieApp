import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import MovieEditForm from "../../dashboard/forms/movie/MovieEditForm";

export default function MovieEditModal({ movie, isOpen, onClose, onSuccess }) {
  if (!movie) return null;

  const handleSuccess = (updatedMovie) => {
    if (onSuccess) {
      onSuccess(updatedMovie);
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] h-[95vh] sm:w-[90vw] sm:h-[90vh] md:w-[85vw] md:h-[85vh] lg:w-[80vw] lg:h-[80vh] xl:max-w-6xl xl:max-h-[95vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 sm:px-6 py-4 sm:py-6 border-b border-border/50 flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl font-semibold leading-tight">
            Edit Movie: {movie.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          <MovieEditForm
            movieId={movie._id}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            isAdmin={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
