import { createContext } from 'react';
import type { ToastVariant } from '../components/ui/Toast';

export interface ToastContextValue {
  show: (variant: ToastVariant, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
