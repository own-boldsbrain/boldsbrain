/**
 * Accessible Toast notification component
 * MUST: Use aria-live for screen reader announcements
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toastVariants } from '../utils/animation';
import { ToastContext, type Toast } from './ToastContext';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: Toast['type'] = 'info', duration = 5000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss
      if (duration > 0) {
        setTimeout(() => {
          setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
        }, duration);
      }
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <>
      {/* MUST: aria-live region for announcements */}
      <div
        id="aria-live-announcer"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      <div
        className="fixed top-0 right-0 z-50 p-4 pointer-events-none"
        style={{
          top: 'var(--safe-area-inset-top)',
          right: 'var(--safe-area-inset-right)',
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onDismiss={() => onDismiss(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  // MUST: Use aria-live polite by default, assertive only for critical errors
  const ariaLive = toast.type === 'error' ? 'assertive' : 'polite';

  const typeStyles = {
    info: 'bg-blue-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-white',
    error: 'bg-red-600 text-white',
  };

  const typeIcons = {
    info: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <motion.div
      {...toastVariants}
      className={`
        pointer-events-auto
        mb-2 rounded-lg shadow-lg
        ${typeStyles[toast.type]}
        min-w-[280px] max-w-md
      `}
      role="alert"
      aria-live={ariaLive}
      aria-atomic="true"
    >
      <div className="flex items-start gap-3 p-4">
        <div className="flex-shrink-0" aria-hidden="true">
          {typeIcons[toast.type]}
        </div>
        <div className="flex-1 text-sm font-medium">{toast.message}</div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 hover:opacity-80 transition-opacity min-w-[24px] min-h-[24px]"
          aria-label="Fechar notificação"
        >
          <svg
            className="h-5 w-5"
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
      </div>
    </motion.div>
  );
}
