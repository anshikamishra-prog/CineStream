import React from 'react';
import Modal from '@components/ui/Modal.jsx';
import Spinner from '@components/ui/Spinner.jsx';

/**
 * A reusable confirmation dialog modal.
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const confirmColors = {
    danger:  'bg-red-600 hover:bg-red-700 text-white',
    brand:   'bg-brand-500 hover:bg-brand-600 text-white',
    default: 'bg-white/10 hover:bg-white/20 text-white',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="px-6 py-5">
        <p className="text-sm text-white/60 leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-md bg-white/5 text-white/60 hover:bg-white/10 hover:text-white text-sm font-medium transition-colors disabled:opacity-40"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors disabled:opacity-60 flex items-center gap-2 ${
              confirmColors[variant] || confirmColors.default
            }`}
          >
            {isLoading && <Spinner size="sm" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
