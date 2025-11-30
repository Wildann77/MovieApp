import { useState, useCallback } from 'react';

const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showConfirm = useCallback((config) => {
    setDialogConfig({
      title: config.title || 'Confirm Action',
      message: config.message || 'Are you sure you want to proceed?',
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel',
      onConfirm: config.onConfirm || (() => {}),
      onCancel: config.onCancel || (() => {}),
    });
    setIsOpen(true);
  }, []);

  const hideConfirm = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    dialogConfig.onConfirm();
    hideConfirm();
  }, [dialogConfig, hideConfirm]);

  const handleCancel = useCallback(() => {
    dialogConfig.onCancel();
    hideConfirm();
  }, [dialogConfig, hideConfirm]);

  return {
    isOpen,
    dialogConfig,
    showConfirm,
    hideConfirm,
    handleConfirm,
    handleCancel,
  };
};

export default useConfirmDialog;
