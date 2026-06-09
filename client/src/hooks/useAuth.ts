import { useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import type { LoginPayload, RegisterPayload } from '../services/authService';

export interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; initials: string };
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, isAuthenticated, login, register, logout } = context;

  return {
    isAuthenticated,
    user: {
      name: user?.name ?? '',
      initials: user ? getInitials(user.name) : '',
    },
    login,
    register,
    logout,
  };
}
