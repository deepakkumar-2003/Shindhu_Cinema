'use client';

import { useEffect } from 'react';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'No',
}: ConfirmationModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="confirmation-modal-overlay" onClick={onClose}>
      <div className="confirmation-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-modal-header">
          <h2 className="confirmation-modal-title">{title}</h2>
        </div>
        <div className="confirmation-modal-body">
          <p className="confirmation-modal-message">{message}</p>
        </div>
        <div className="confirmation-modal-footer">
          <button
            onClick={onClose}
            className="confirmation-modal-btn confirmation-modal-btn-cancel"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="confirmation-modal-btn confirmation-modal-btn-confirm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
