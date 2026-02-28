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
     * POST /api/web/v1/site/signup
     */
    register: builder.mutation({
      query: (userData) => ({
        url: API_ENDPOINTS.REGISTER,
        method: 'POST',
        body: userData,
      }),
    }),
    
    /**
     * Activate Account
     * POST /api/web/v1/site/activate
     */
    activate: builder.mutation({
      query: (activationData) => ({
        url: API_ENDPOINTS.ACTIVATE,
        method: 'POST',
        body: activationData,
      }),
    }),
    
    /**
     * Get Lists (Countries and Cities)
     * GET /api/web/v1/site/lists
     */
    getLists: builder.query({
      query: () => API_ENDPOINTS.LISTS,
      transformResponse: (response) => {
        return response.status === 1 ? response.data[0] : null;
      },
    }),

    /**
     * Password Reset
     * POST /api/web/v1/site/password-reset
     */
    passwordReset: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.PASSWORD_RESET,
        method: 'POST',
        body: data,
      }),
    }),
    
    /**
     * Reset Password (with token + new password)
     * POST /api/web/v1/site/reset-password
     */
    resetPassword: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.RESET_PASSWORD,
        method: 'POST',
        body: data,
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
  useActivateMutation,
  useGetListsQuery,
  usePasswordResetMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
} = authApi;
