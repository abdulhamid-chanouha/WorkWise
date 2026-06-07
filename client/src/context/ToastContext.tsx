import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ToastContainer } from '../components/ui/Toast';
import type { ToastItem } from '../components/ui/Toast';
import { setAuthHandlers } from '../services/apiClient';
import { ToastContext } from './toast-context';
import type { ToastContextValue } from './toast-context';

const TOAST_DURATION_MS = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idCounter = useRef(0);
  const timeouts = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

    const timeout = timeouts.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeouts.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (variant: ToastItem['variant'], message: string) => {
      const id = `toast-${++idCounter.current}`;
      setToasts((prev) => [...prev, { id, variant, message }]);
      timeouts.current.set(
        id,
        setTimeout(() => dismiss(id), TOAST_DURATION_MS)
      );
    },
    [dismiss]
  );

  // Clear any pending auto-dismiss timers on unmount.
  useEffect(() => {
    const pending = timeouts.current;
    return () => {
      pending.forEach((timeout) => clearTimeout(timeout));
      pending.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (message) => show('success', message),
      error: (message) => show('error', message),
      info: (message) => show('info', message),
    }),
    [show]
  );

  // Register this provider's error handler with the API client so the response
  // interceptor can surface a toast on 500s, then deregister on unmount.
  useEffect(() => {
    setAuthHandlers({ onError: value.error });
    return () => setAuthHandlers({ onError: undefined });
  }, [value.error]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
