export interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; initials: string };
}

export function useAuth(): AuthState {
  return {
    isAuthenticated: false,
    user: { name: 'Jane Doe', initials: 'JD' },
  };
}
