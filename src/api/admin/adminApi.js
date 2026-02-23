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
     * Add Driver (Signup Driver)
     * POST /api/web/v1/site/signup-driver
     */
    addDriver: builder.mutation({
      query: (driverData) => ({
        url: API_ENDPOINTS.SIGNUP_DRIVER,
        method: 'POST',
        body: driverData,
        // FormData is handled automatically by fetch if body is FormData
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

    /**
     * Get Company Drivers
     * GET /api/web/v1/site/company-driver
     */
    getCompanyDrivers: builder.query({
      query: () => ({
        url: API_ENDPOINTS.ADMIN_COMPANY_DRIVERS,
        params: { 'access-token': localStorage.getItem('josur_auth_token') },
      }),
      providesTags: ['Driver'],
    }),

    /**
     * Get Sub Trucks by ID
     * GET /api/web/v1/site/sub-truck?id={truckId}
     */
    getSubTrucks: builder.query({
      query: (truckId) => ({
        url: API_ENDPOINTS.SUB_TRUCK,
        params: { 
          id: truckId,
          'access-token': localStorage.getItem('josur_auth_token')
        },
      }),
      transformResponse: (response) => {
        return response.status === 1 ? response.data[0] : [];
      },
    }),

    /**
     * Add Vehicle (Add Truck)
     * POST /api/web/v1/site/add-vehicle
     */
    addVehicle: builder.mutation({
      query: (vehicleData) => ({
        url: API_ENDPOINTS.ADMIN_ADD_VEHICLE,
        method: 'POST',
        params: { 'access-token': localStorage.getItem('josur_auth_token') },
        body: vehicleData,
      }),
      invalidatesTags: ['Admin'],
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
  useGetCompanyDriversQuery,
  useGetSubTrucksQuery,
  useAddVehicleMutation,
} = adminApi;
