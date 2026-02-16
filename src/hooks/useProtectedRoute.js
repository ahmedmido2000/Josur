import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { ROUTES } from '../utils/constants';

/**
 * Custom Protected Route Hook
 * Handles route protection logic
 */
export const useProtectedRoute = (allowedRoles = null) => {
  const navigate = useNavigate();
  const { isAuthenticated, role, isLoading } = useAuth();
  
  useEffect(() => {
    // Don't check while loading
    if (isLoading) return;
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }
    
    // Check if user has required role
    if (allowedRoles) {
      const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      
      if (!rolesArray.includes(role)) {
        // Redirect to appropriate dashboard based on role
        switch (role) {
          case 'admin':
            navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
            break;
          case 'driver':
            navigate(ROUTES.DRIVER_ORDERS, { replace: true });
            break;
          case 'user':
            navigate(ROUTES.USER_ORDERS, { replace: true });
            break;
          default:
            navigate(ROUTES.HOME, { replace: true });
        }
      }
    }
  }, [isAuthenticated, role, allowedRoles, navigate, isLoading]);
  
  return { isAuthenticated, role, isLoading };
};
