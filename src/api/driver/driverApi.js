import { baseApi } from '../baseApi';
import { API_ENDPOINTS } from '../../utils/constants';

/**
 * Driver API
 * Driver-specific endpoints using RTK Query
 */

export const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get Driver Orders
     * GET /driver/orders
     */
    getDriverOrders: builder.query({
      query: (params) => ({
        url: API_ENDPOINTS.DRIVER_ORDERS,
        params,
      }),
      providesTags: ['Order'],
    }),
    
    /**
     * Get Driver Balance
     * GET /driver/balance
     */
    getDriverBalance: builder.query({
      query: () => API_ENDPOINTS.DRIVER_BALANCE,
      providesTags: ['Balance'],
    }),
    
    /**
     * Get Driver Profile
     * GET /driver/profile
     */
    getDriverProfile: builder.query({
      query: () => API_ENDPOINTS.DRIVER_PROFILE,
      providesTags: ['Profile'],
    }),
    
    /**
     * Update Driver Profile
     * PUT /driver/profile
     */
    updateDriverProfile: builder.mutation({
      query: (profileData) => ({
        url: API_ENDPOINTS.DRIVER_PROFILE,
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['Profile', 'User'],
    }),
    
    /**
     * Update Order Status
     * PUT /driver/orders/:id/status
     */
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `${API_ENDPOINTS.DRIVER_ORDERS}/${orderId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
    
    /**
     * Accept Order
     * POST /driver/orders/:id/accept
     */
    acceptOrder: builder.mutation({
      query: (orderId) => ({
        url: `${API_ENDPOINTS.DRIVER_ORDERS}/${orderId}/accept`,
        method: 'POST',
      }),
      invalidatesTags: ['Order'],
    }),
    
    /**
     * Get Order Details
     * GET /driver/orders/:id
     */
    getDriverOrderDetails: builder.query({
      query: (orderId) => `${API_ENDPOINTS.DRIVER_ORDERS}/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetDriverOrdersQuery,
  useGetDriverBalanceQuery,
  useGetDriverProfileQuery,
  useUpdateDriverProfileMutation,
  useUpdateOrderStatusMutation,
  useAcceptOrderMutation,
  useGetDriverOrderDetailsQuery,
} = driverApi;
