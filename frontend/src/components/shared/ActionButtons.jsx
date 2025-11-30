import React from 'react';
import { Button } from '../ui/button';

const ActionButtons = ({
  onCancel,
  onSubmit,
  cancelText = "Cancel",
  submitText = "Submit",
  isLoading = false,
  loadingText = "Loading...",
  submitIcon,
  cancelIcon,
  className = ""
}) => {
  return (
    <div className={`flex justify-end space-x-4 pt-6 border-t-2 border-border ${className}`}>
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="px-8 h-12 border-2 border-border text-foreground hover:bg-muted hover:border-muted-foreground/20 transition-all duration-200 font-semibold rounded-lg"
        >
          {cancelIcon && <span className="mr-2">{cancelIcon}</span>}
          {cancelText}
        </Button>
      )}
      
      {onSubmit && (
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={isLoading}
          className="px-10 h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
        >
          {submitIcon && <span className="mr-2">{submitIcon}</span>}
          {isLoading ? loadingText : submitText}
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
