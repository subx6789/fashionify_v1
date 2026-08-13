import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const ProtectedRoute = ({ children, adminOnly, requireUser, guestOnly }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  // Handle guest-only routes (/login, /register) for authenticated users
  if (guestOnly) {
    if (user) {
      if (user.role === 'ADMIN') {
        return <Navigate to="/admin" replace />;
      }
      return <Navigate to="/" replace />;
    }
    return children;
  }

  // Handle unauthenticated guests
  if (!user) {
    if (adminOnly || requireUser) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  // If page is for Admins only, non-admins go to home page
  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // If user is Admin and tries to access customer store pages, redirect to Admin Dashboard
  if (!adminOnly && user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;