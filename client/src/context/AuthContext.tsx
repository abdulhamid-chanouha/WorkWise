import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import * as authService from '../services/authService';
import type { LoginPayload, RegisterPayload, User } from '../services/authService';
import { clearStoredAuth, getStoredAuth, setStoredAuth } from '../services/authStorage';
import { setAuthHandlers } from '../services/apiClient';
import { AuthContext } from './auth-context';
import type { AuthContextValue } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Restored synchronously from storage — no backend validation endpoint
  // exists yet, so presence of a persisted session is treated as "authenticated".
  // TODO: once SCRUM-54 ships, validate the persisted token against
  // /auth/refresh here instead of trusting local storage outright.
  const [user, setUser] = useState<User | null>(() => getStoredAuth()?.user ?? null);

  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authService.login(payload);
    setStoredAuth(response);
    setUser(response.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await authService.register(payload);
    setStoredAuth(response);
    setUser(response.user);
  }, []);

  // Let the API client force a logout on 401 (token already cleared by the
  // interceptor itself — we just need to drop the in-memory user so
  // ProtectedRoute redirects to /login).
  useEffect(() => {
    setAuthHandlers({ onUnauthorized: logout });
    return () => setAuthHandlers({ onUnauthorized: undefined });
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
    }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
