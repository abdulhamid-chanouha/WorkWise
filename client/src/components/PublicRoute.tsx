import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from './ui';

export default function PublicRoute() {
  const { isAuthenticated, isInitializing } = useAuth();
  if (isInitializing) return <div className="empty-panel min-h-screen"><Spinner size="lg" /></div>;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
