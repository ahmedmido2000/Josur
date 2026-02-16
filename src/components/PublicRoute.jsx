import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES, USER_ROLES } from '../utils/constants';

/**
 * Public Route Component
 * Wraps routes that should only be accessible when NOT authenticated (login, register)
 * Redirects authenticated users to their appropriate dashboard
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  
  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    switch (role) {
      case USER_ROLES.ADMIN:
        return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
      case USER_ROLES.DRIVER:
        return <Navigate to={ROUTES.DRIVER_ORDERS} replace />;
      case USER_ROLES.USER:
        return <Navigate to={ROUTES.USER_ORDERS} replace />;
      default:
        return <Navigate to={ROUTES.HOME} replace />;
    }
  }
  
  // Render public content
  return children;
};

export default PublicRoute;
