import React from 'react';
import { Button } from '../ui/button';
import { IconTrash, IconLoader2 } from '@tabler/icons-react';
import { cn } from '../../lib/utils';

const FormActions = ({
  onCancel,
  onSubmit,
  onDelete,
  cancelText = "Cancel",
  submitText = "Submit",
  deleteText = "Delete",
  isLoading = false,
  isDeleting = false,
  showDelete = false,
  className = "",
  ...props
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-4 gap-3", className)}>
      <div className="flex items-center gap-2 order-2 sm:order-1">
        {showDelete && onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeleting || isLoading}
            size="sm"
            className="w-full sm:w-auto"
          >
            {isDeleting ? (
              <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <IconTrash className="h-4 w-4 mr-2" />
            )}
            {isDeleting ? "Deleting..." : deleteText}
          </Button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 order-1 sm:order-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading || isDeleting}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
        )}
        
        <Button 
          type="submit"
          disabled={isLoading || isDeleting}
          onClick={onSubmit}
          className="w-full sm:w-auto"
          {...props}
        >
          {isLoading ? (
            <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : null}
          {isLoading ? "Processing..." : submitText}
        </Button>
      </div>
    </div>
  );
};

export default FormActions;
