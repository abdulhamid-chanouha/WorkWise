import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { clearStoredAuth, getStoredAuth, setStoredAuth } from './authStorage';
import type { RefreshResponse } from './authService';

export interface AuthHandlers {
  onUnauthorized?: () => void;
  onError?: (message: string) => void;
}

let authHandlers: AuthHandlers = {};
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
}

export function setAuthHandlers(handlers: Partial<AuthHandlers>): void {
  authHandlers = { ...authHandlers, ...handlers };
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

async function requestTokenRefresh(refreshToken: string): Promise<RefreshResponse> {
  const { data } = await axios.post<{ success: boolean; data: RefreshResponse }>(
    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
    { refreshToken }
  );
  return data.data;
}

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = getStoredAuth()?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — attempt silent token refresh before giving up
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      const stored = getStoredAuth();

      // No refresh token available — log out immediately
      if (!stored?.refreshToken) {
        clearStoredAuth();
        authHandlers.onUnauthorized?.();
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const result = await requestTokenRefresh(stored.refreshToken);

        // Update stored tokens
        setStoredAuth({
          user: stored.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });

        processQueue(null, result.accessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearStoredAuth();
        authHandlers.onUnauthorized?.();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 500) {
      authHandlers.onError?.('Something went wrong on our end. Please try again shortly.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
