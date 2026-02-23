import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../utils/tokenStorage';
import i18n from '../i18n';

/**
 * Base API Configuration
 * RTK Query base API with automatic token injection and error handling
 */

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://alrajihy.com/demo/jsor',
  
  // Prepare headers for each request
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state or localStorage
    const token = getState().auth.token || getToken();
    
    // Add authorization header if token exists
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Add content type
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    
    // Add accept header
    headers.set('Accept', 'application/json');
    
    // Add language header
    const currentLanguage = i18n.language || 'ar';
    headers.set('Accept-Language', currentLanguage);
    
    return headers;
  },
  
  // Credentials for CORS
  credentials: 'include',
});

/**
 * Base query with re-authentication
 * Automatically refreshes token if request fails with 401
 */
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // If request fails with 401, try to refresh token
  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    );
    
    if (refreshResult.data) {
      // Store new token
      api.dispatch({ 
        type: 'auth/refreshToken', 
        payload: { token: refreshResult.data.token } 
      });
      
      // Retry original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, logout user
      api.dispatch({ type: 'auth/logout' });
    }
  }
  
  return result;
};

/**
 * Base API
 * All API slices will inject endpoints into this base API
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  
  // Tag types for cache invalidation
  tagTypes: ['User', 'Order', 'Driver', 'Admin', 'Balance', 'Notification', 'Profile', 'Vehicle'],
  
  // Endpoints will be injected by individual API slices
  endpoints: () => ({}),
});
