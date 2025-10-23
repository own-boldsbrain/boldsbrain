/**
 * Toast context for managing notifications
 */

import { createContext } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

export interface ToastContextValue {
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  dismissToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
