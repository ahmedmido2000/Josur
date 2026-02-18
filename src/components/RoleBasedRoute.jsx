import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';
import LoadingSpinner from './LoadingSpinner';

/**
 * Role-Based Route Component
 * Wraps routes that require specific user roles
 */
const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, isLoading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner fullscreen />;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  // Check if user has required role
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  if (!rolesArray.includes(role)) {
    // Redirect to appropriate dashboard based on user's actual role
    // role is already mapped from user_type in authSlice
    switch (role) {
      case 'admin':
        return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
      case 'driver':
        return <Navigate to={ROUTES.DRIVER_ORDERS} replace />;
      case 'user':
        return <Navigate to={ROUTES.USER_ORDERS} replace />;
      default:
        // If no valid role, redirect to login
        return <Navigate to={ROUTES.LOGIN} replace />;
    }
  }
  
  // Render protected content
  return children;
};

export default RoleBasedRoute;
