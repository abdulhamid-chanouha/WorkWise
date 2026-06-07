import axios from 'axios';
import type { AxiosError } from 'axios';
import { clearStoredAuth, getStoredAuth } from './authStorage';

export interface AuthHandlers {
  /** Called when a request comes back 401 — token has already been cleared by this point. */
  onUnauthorized?: () => void;
  /** Called when a request comes back 500, with a user-facing message to surface. */
  onError?: (message: string) => void;
}

let authHandlers: AuthHandlers = {};

/**
 * Lets providers (AuthProvider, ToastProvider) register callbacks for the
 * interceptors below without the API layer importing React/context directly.
 * Each provider registers its own slice on mount and clears it on unmount.
 */
export function setAuthHandlers(handlers: Partial<AuthHandlers>): void {
  authHandlers = { ...authHandlers, ...handlers };
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredAuth()?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      clearStoredAuth();
      authHandlers.onUnauthorized?.();
    }

    if (status === 500) {
      authHandlers.onError?.('Something went wrong on our end. Please try again shortly.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
