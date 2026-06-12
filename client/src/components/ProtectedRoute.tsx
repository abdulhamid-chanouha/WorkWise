import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from './ui';

export default function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth();
  if (isInitializing) return <div className="empty-panel min-h-screen"><Spinner size="lg" /></div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
