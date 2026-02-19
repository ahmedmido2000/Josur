import { baseApi } from '../baseApi';
import { API_ENDPOINTS } from '../../utils/constants';

/**
 * User API
 * User-specific endpoints using RTK Query
 */

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get User Orders
     * GET /user/orders
     */
    getUserOrders: builder.query({
      query: (params) => ({
        url: API_ENDPOINTS.USER_ORDERS,
        params,
      }),
      providesTags: ['Order'],
    }),
    
    /**
     * Get User Balance
     * GET /user/balance
     */
    getUserBalance: builder.query({
      query: () => API_ENDPOINTS.USER_BALANCE,
      providesTags: ['Balance'],
    }),
    
    /**
     * Get User Profile
     * GET /user/profile
     */
    getUserProfile: builder.query({
      query: () => API_ENDPOINTS.USER_PROFILE,
      providesTags: ['Profile'],
    }),
    
    /**
     * Update User Profile
     * POST /api/web/v1/site/profile
     */
    updateUserProfile: builder.mutation({
      query: (profileData) => ({
        url: API_ENDPOINTS.USER_PROFILE,
        method: 'POST',
        body: profileData,
      }),
      invalidatesTags: ['Profile', 'User'],
    }),
    
    /**
     * Upload Document
     * POST /user/documents
     */
    uploadDocument: builder.mutation({
      query: (formData) => ({
        url: API_ENDPOINTS.USER_DOCUMENTS,
        method: 'POST',
        body: formData,
        // Don't set Content-Type header for FormData
        formData: true,
      }),
      invalidatesTags: ['Profile'],
    }),
    
    /**
     * Create Order
     * POST /user/orders
     */
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: API_ENDPOINTS.USER_ORDERS,
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order', 'Balance'],
    }),
    
    /**
     * Get Order Details
     * GET /user/orders/:id
     */
    getOrderDetails: builder.query({
      query: (orderId) => `${API_ENDPOINTS.USER_ORDERS}/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetUserOrdersQuery,
  useGetUserBalanceQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadDocumentMutation,
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
} = userApi;
