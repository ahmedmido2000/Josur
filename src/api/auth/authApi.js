import { baseApi } from '../baseApi';
import { API_ENDPOINTS } from '../../utils/constants';

/**
 * Auth API
 * Authentication-related endpoints using RTK Query
 */

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Login
     * POST /auth/login
     */
    login: builder.mutation({
      query: (credentials) => ({
        url: API_ENDPOINTS.LOGIN,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    
    /**
     * Register
     * POST /auth/register
     */
    register: builder.mutation({
      query: (userData) => ({
        url: API_ENDPOINTS.REGISTER,
        method: 'POST',
        body: userData,
      }),
    }),
    
    /**
     * Logout
     * POST /auth/logout
     */
    logout: builder.mutation({
      query: () => ({
        url: API_ENDPOINTS.LOGOUT,
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Order', 'Balance', 'Notification', 'Profile'],
    }),
    
    /**
     * Get Current User
     * GET /auth/me
     */
    getCurrentUser: builder.query({
      query: () => API_ENDPOINTS.GET_CURRENT_USER,
      providesTags: ['User'],
    }),
    
    /**
     * Refresh Token
     * POST /auth/refresh
     */
    refreshToken: builder.mutation({
      query: () => ({
        url: API_ENDPOINTS.REFRESH_TOKEN,
        method: 'POST',
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
} = authApi;
