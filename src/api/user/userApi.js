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
     * GET /api/web/v1/site/user-balance
     */
    getUserBalance: builder.query({
      query: (token) => ({
        url: API_ENDPOINTS.USER_BALANCE,
        params: token ? { 'access-token': token } : {},
      }),
      providesTags: ['Balance'],
    }),
    
    /**
     * Get User Profile
     * POST /api/web/v1/site/profile (Used for both get and update by this backend)
     */
    getUserProfile: builder.query({
      query: (token) => ({
        url: API_ENDPOINTS.USER_PROFILE,
        method: 'POST',
        params: token ? { 'access-token': token } : {},
      }),
      providesTags: ['Profile'],
    }),
    
    /**
     * Update User Profile
     * POST /api/web/v1/site/profile
     */
    updateUserProfile: builder.mutation({
      query: ({ profileData, token }) => ({
        url: API_ENDPOINTS.USER_PROFILE,
        method: 'POST',
        params: token ? { 'access-token': token } : {},
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

    /**
     * Get Normal New Orders
     */
    getNormalNewOrders: builder.query({
      query: ({ token, page = 1 } = {}) => ({
        url: API_ENDPOINTS.MY_NORMAL_NEW_ORDERS,
        params: { ...(token ? { 'access-token': token } : {}), page },
      }),
      providesTags: ['Order'],
    }),

    /**
     * Get Normal Shipping Orders
     */
    getNormalShippingOrders: builder.query({
      query: ({ token, page = 1 } = {}) => ({
        url: API_ENDPOINTS.MY_NORMAL_SHIPPING_ORDERS,
        params: { ...(token ? { 'access-token': token } : {}), page },
      }),
      providesTags: ['Order'],
    }),

    /**
     * Get Normal Complete Orders
     */
    getNormalCompleteOrders: builder.query({
      query: ({ token, page = 1 } = {}) => ({
        url: API_ENDPOINTS.MY_NORMAL_COMPLETE_ORDERS,
        params: { ...(token ? { 'access-token': token } : {}), page },
      }),
      providesTags: ['Order'],
    }),

    /**
     * Get Normal Canceled Orders
     */
    getNormalCanceledOrders: builder.query({
      query: ({ token, page = 1 } = {}) => ({
        url: API_ENDPOINTS.MY_NORMAL_CANCELED_ORDERS,
        params: { ...(token ? { 'access-token': token } : {}), page },
      }),
      providesTags: ['Order'],
    }),

    /**
     * Get Trip New Orders
     */
    getTripNewOrders: builder.query({
      query: ({ token, page = 1 } = {}) => ({
        url: API_ENDPOINTS.MY_TRIP_NEW_ORDERS,
        params: { ...(token ? { 'access-token': token } : {}), page },
      }),
      providesTags: ['Order'],
    }),

    /**
     * Get Trip Shipping Orders
     */
    getTripShippingOrders: builder.query({
      query: ({ token, page = 1 } = {}) => ({
        url: API_ENDPOINTS.MY_TRIP_SHIPPING_ORDERS,
        params: { ...(token ? { 'access-token': token } : {}), page },
      }),
      providesTags: ['Order'],
    }),

    /**
     * Get Trip Complete Orders
     */
    getTripCompleteOrders: builder.query({
      query: ({ token, page = 1 } = {}) => ({
        url: API_ENDPOINTS.MY_TRIP_COMPLETE_ORDERS,
        params: { ...(token ? { 'access-token': token } : {}), page },
      }),
      providesTags: ['Order'],
    }),

    /**
     * Get Trip Canceled Orders
     */
    getTripCanceledOrders: builder.query({
      query: ({ token, page = 1 } = {}) => ({
        url: API_ENDPOINTS.MY_TRIP_CANCELED_ORDERS,
        params: { ...(token ? { 'access-token': token } : {}), page },
      }),
      providesTags: ['Order'],
    }),

    /**
     * Get Contract New Orders
     */
    getContractNewOrders: builder.query({
      query: ({ token, page = 1 } = {}) => ({
        url: API_ENDPOINTS.MY_CONTRACT_NEW_ORDERS,
        params: { ...(token ? { 'access-token': token } : {}), page },
      }),
      providesTags: ['Order'],
    }),

    /**
     * Get Contract Shipping Orders
     */
    getContractShippingOrders: builder.query({
      query: ({ token, page = 1 } = {}) => ({
        url: API_ENDPOINTS.MY_CONTRACT_SHIPPING_ORDERS,
        params: { ...(token ? { 'access-token': token } : {}), page },
      }),
      providesTags: ['Order'],
    }),

    /**
     * Get Contract Complete Orders
     */
    getContractCompleteOrders: builder.query({
      query: ({ token, page = 1 } = {}) => ({
        url: API_ENDPOINTS.MY_CONTRACT_COMPLETE_ORDERS,
        params: { ...(token ? { 'access-token': token } : {}), page },
      }),
      providesTags: ['Order'],
    }),

    /**
     * Get Contract Canceled Orders
     */
    getContractCanceledOrders: builder.query({
      query: ({ token, page = 1 } = {}) => ({
        url: API_ENDPOINTS.MY_CONTRACT_CANCELED_ORDERS,
        params: { ...(token ? { 'access-token': token } : {}), page },
      }),
      providesTags: ['Order'],
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
  useGetNormalNewOrdersQuery,
  useGetNormalShippingOrdersQuery,
  useGetNormalCompleteOrdersQuery,
  useGetNormalCanceledOrdersQuery,
  useGetTripNewOrdersQuery,
  useGetTripShippingOrdersQuery,
  useGetTripCompleteOrdersQuery,
  useGetTripCanceledOrdersQuery,
  useGetContractNewOrdersQuery,
  useGetContractShippingOrdersQuery,
  useGetContractCompleteOrdersQuery,
  useGetContractCanceledOrdersQuery,
} = userApi;
