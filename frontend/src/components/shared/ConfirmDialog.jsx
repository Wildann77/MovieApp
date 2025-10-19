import React from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { IconAlertTriangle } from '@tabler/icons-react';

const ConfirmDialog = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  icon: Icon = IconAlertTriangle,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          iconColor: 'text-destructive',
          confirmVariant: 'destructive',
          iconBg: 'bg-destructive/10'
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-600',
          confirmVariant: 'default',
          iconBg: 'bg-yellow-100'
        };
      default:
        return {
          iconColor: 'text-primary',
          confirmVariant: 'default',
          iconBg: 'bg-primary/10'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Dialog open={isOpen} onOpenChange={onCancel} {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${styles.iconBg}`}>
              <Icon className={`h-6 w-6 ${styles.iconColor}`} />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {message}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant={styles.confirmVariant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
