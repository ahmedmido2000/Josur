import { toast } from 'react-toastify';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { getErrorMessage } from '../../utils/apiHelpers';
import { HTTP_STATUS } from '../../utils/constants';

/**
 * Error Handling Middleware
 * Intercepts all rejected actions and handles errors globally
 */
export const errorMiddleware = (store) => (next) => (action) => {
  // Check if this is a rejected action from RTK Query
  if (isRejectedWithValue(action)) {
    const error = action.payload;
    const errorMessage = getErrorMessage(error);
    
    // Handle specific error codes
    if (error?.status === HTTP_STATUS.UNAUTHORIZED) {
      // Unauthorized - clear auth and redirect to login
      toast.error('Session expired. Please login again.');
      
      // Dispatch logout action
      store.dispatch({ type: 'auth/logout' });
      
      // Redirect to login page
      window.location.href = '/login';
    } else if (error?.status === HTTP_STATUS.FORBIDDEN) {
      // Forbidden - show error
      toast.error('Access denied. You do not have permission.');
    } else if (error?.status === HTTP_STATUS.NOT_FOUND) {
      // Not found
      toast.error('Resource not found.');
    } else if (error?.status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      // Server error
      toast.error('Server error. Please try again later.');
    } else if (error?.status === 'FETCH_ERROR') {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Generic error
      toast.error(errorMessage);
    }
    
    // Log error for debugging
    console.error('API Error:', {
      endpoint: action.meta?.arg?.endpointName,
      error: error,
      message: errorMessage,
    });
  }
  
  return next(action);
};
