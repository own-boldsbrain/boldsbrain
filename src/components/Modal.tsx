/**
 * Accessible Modal/Dialog component
 * MUST: Focus trap, return to trigger, Escape key, overscroll-behavior
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { useEscapeKey } from '../hooks/useFocus';
import { modalVariants, fadeVariants } from '../utils/animation';

export interface ModalProps {
  /** Control open state */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title - MUST for accessibility */
  title: string;
  /** Modal content */
  children: React.ReactNode;
  /** Optional description */
  description?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether to show close button */
  showCloseButton?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  // MUST: Handle Escape key
  useEscapeKey(onClose, open);

  // MUST: Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              {/* Overlay */}
              <Dialog.Overlay asChild>
                <motion.div
                  {...fadeVariants}
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={onClose}
                />
              </Dialog.Overlay>

              {/* Content */}
              <Dialog.Content asChild>
                <motion.div
                  {...modalVariants}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
                  style={{
                    maxHeight: 'calc(100vh - var(--safe-area-inset-top) - var(--safe-area-inset-bottom) - 2rem)',
                  }}
                >
                  <div
                    className={`
                      bg-white rounded-lg shadow-xl
                      w-full ${sizeClasses[size]}
                      flex flex-col
                      max-h-full
                    `}
                    // MUST: overscroll-behavior contain
                    data-modal="true"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between p-6 border-b">
                      <div className="flex-1">
                        <Dialog.Title className="text-xl font-semibold text-gray-900">
                          {title}
                        </Dialog.Title>
                        {description && (
                          <Dialog.Description className="mt-1 text-sm text-gray-500">
                            {description}
                          </Dialog.Description>
                        )}
                      </div>
                      
                      {showCloseButton && (
                        <Dialog.Close asChild>
                          <button
                            onClick={onClose}
                            className="
                              ml-4 text-gray-400 hover:text-gray-600
                              min-w-[24px] min-h-[24px] p-1
                              rounded
                              focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600
                            "
                            aria-label="Fechar diálogo"
                          >
                            <svg
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </Dialog.Close>
                      )}
                    </div>

                    {/* Body - scrollable */}
                    <div className="flex-1 overflow-y-auto p-6">
                      {children}
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * Confirm dialog for destructive actions
 * MUST: Confirm destructive actions
 */
export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm" showCloseButton={false}>
      <p className="text-sm text-gray-600">{description}</p>
      
      <div className="flex gap-3 mt-6 justify-end">
        <button
          onClick={onClose}
          className="
            px-4 py-2 min-h-[44px] min-w-[44px] md:min-h-[32px] md:min-w-[32px]
            text-sm font-medium text-gray-700
            bg-white border border-gray-300 rounded-lg
            hover:bg-gray-50
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600
          "
        >
          {cancelLabel}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`
            px-4 py-2 min-h-[44px] min-w-[44px] md:min-h-[32px] md:min-w-[32px]
            text-sm font-medium text-white rounded-lg
            focus-visible:outline focus-visible:outline-2
            ${destructive 
              ? 'bg-red-600 hover:bg-red-700 focus-visible:outline-red-600'
              : 'bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-600'
            }
          `}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
