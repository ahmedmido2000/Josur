import { baseApi } from '../baseApi';
import { API_ENDPOINTS } from '../../utils/constants';

/**
 * Admin API
 * Admin-specific endpoints using RTK Query
 */

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get Dashboard Statistics
     * GET /admin/dashboard
     */
    getDashboardStats: builder.query({
      query: () => API_ENDPOINTS.ADMIN_DASHBOARD,
      providesTags: ['Admin'],
    }),
    
    /**
     * Get All Users
     * GET /admin/users
     */
    getAllUsers: builder.query({
      query: (params) => ({
        url: API_ENDPOINTS.ADMIN_USERS,
        params,
      }),
      providesTags: ['User'],
    }),
    
    /**
     * Add Truck
     * POST /admin/trucks
     */
    addTruck: builder.mutation({
      query: (truckData) => ({
        url: API_ENDPOINTS.ADMIN_TRUCKS,
        method: 'POST',
        body: truckData,
      }),
      invalidatesTags: ['Admin'],
    }),
    
    /**
     * Get All Trucks
     * GET /admin/trucks
     */
    getAllTrucks: builder.query({
      query: (params) => ({
        url: API_ENDPOINTS.ADMIN_TRUCKS,
        params,
      }),
      providesTags: ['Admin'],
    }),
    
    /**
     * Update Truck
     * PUT /admin/trucks/:id
     */
    updateTruck: builder.mutation({
      query: ({ truckId, truckData }) => ({
        url: `${API_ENDPOINTS.ADMIN_TRUCKS}/${truckId}`,
        method: 'PUT',
        body: truckData,
      }),
      invalidatesTags: ['Admin'],
    }),
    
    /**
     * Delete Truck
     * DELETE /admin/trucks/:id
     */
    deleteTruck: builder.mutation({
      query: (truckId) => ({
        url: `${API_ENDPOINTS.ADMIN_TRUCKS}/${truckId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin'],
    }),
    
    /**
     * Add Driver
     * POST /admin/drivers
     */
    addDriver: builder.mutation({
      query: (driverData) => ({
        url: API_ENDPOINTS.ADMIN_DRIVERS,
        method: 'POST',
        body: driverData,
      }),
      invalidatesTags: ['Admin', 'Driver'],
    }),
    
    /**
     * Get All Drivers
     * GET /admin/drivers
     */
    getAllDrivers: builder.query({
      query: (params) => ({
        url: API_ENDPOINTS.ADMIN_DRIVERS,
        params,
      }),
      providesTags: ['Driver'],
    }),
    
    /**
     * Update Driver
     * PUT /admin/drivers/:id
     */
    updateDriver: builder.mutation({
      query: ({ driverId, driverData }) => ({
        url: `${API_ENDPOINTS.ADMIN_DRIVERS}/${driverId}`,
        method: 'PUT',
        body: driverData,
      }),
      invalidatesTags: ['Driver'],
    }),
    
    /**
     * Delete Driver
     * DELETE /admin/drivers/:id
     */
    deleteDriver: builder.mutation({
      query: (driverId) => ({
        url: `${API_ENDPOINTS.ADMIN_DRIVERS}/${driverId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Driver'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetDashboardStatsQuery,
  useGetAllUsersQuery,
  useAddTruckMutation,
  useGetAllTrucksQuery,
  useUpdateTruckMutation,
  useDeleteTruckMutation,
  useAddDriverMutation,
  useGetAllDriversQuery,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
} = adminApi;
