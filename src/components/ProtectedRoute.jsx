import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';
import LoadingSpinner from './LoadingSpinner';

/**
 * Protected Route Component
 * Wraps routes that require authentication
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner fullscreen />;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  // Render protected content
  return children;
};

export default ProtectedRoute;
