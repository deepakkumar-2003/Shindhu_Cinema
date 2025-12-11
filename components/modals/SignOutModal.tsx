'use client';

import { useState } from 'react';
import { toast } from '@/lib/hooks/useToast';
import './SignOutModal.css';

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<{ success: boolean; error?: string }>;
}

export default function SignOutModal({ isOpen, onClose, onConfirm }: SignOutModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const result = await onConfirm();
      if (result.success) {
        toast.success('Signed out successfully!');
      } else {
        toast.error(result.error || 'Sign out failed');
      }
      onClose();
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Sign out failed. Please try again.');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="signout-modal-overlay" onClick={handleOverlayClick}>
      <div className="signout-modal">
        <div className="signout-modal-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>
        <h2 className="signout-modal-title">Sign Out</h2>
        <p className="signout-modal-message">
          Are you sure you want to sign out of your account?
        </p>
        <div className="signout-modal-actions">
          <button
            className="signout-modal-btn signout-modal-btn-cancel"
            onClick={onClose}
            disabled={isLoading}
          >
            No, Cancel
          </button>
          <button
            className="signout-modal-btn signout-modal-btn-confirm"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="signout-modal-spinner"></span>
            ) : (
              'Yes, Sign Out'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
