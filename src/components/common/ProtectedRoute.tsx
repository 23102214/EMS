import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50" id="loading-spinner-container">
        <div className="relative w-16 h-16" id="spinner-graphic">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
        </div>
        <p className="mt-4 text-sm font-medium text-neutral-500 font-sans tracking-wide">Loading secure session credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the original route
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If user's role is not authorized, redirect to parent Dashboard path
    return <Navigate to="/" replace />;
  }

  return children;
}
