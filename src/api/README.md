# RTK Query API Guide

This guide explains how to use and extend the RTK Query API layer in this project.

## Overview

RTK Query is configured with:
- **Base URL**: From environment variable `VITE_API_BASE_URL`
- **Automatic token injection**: JWT tokens are automatically added to all requests
- **Cache management**: Automatic caching with tag-based invalidation
- **Error handling**: Global error handling via middleware

## Creating New API Endpoints

### 1. Add to Existing API Slice

To add a new endpoint to an existing API slice (e.g., `userApi.js`):

```javascript
// src/api/user/userApi.js
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Existing endpoints...
    
    // New Query Endpoint
    getUserSettings: builder.query({
      query: () => '/user/settings',
      providesTags: ['User'],
    }),
    
    // New Mutation Endpoint
    updateUserSettings: builder.mutation({
      query: (settings) => ({
        url: '/user/settings',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export the hooks
export const {
  useGetUserSettingsQuery,
  useUpdateUserSettingsMutation,
} = userApi;
```

### 2. Create New API Slice

To create a new API module:

```javascript
// src/api/notifications/notificationApi.js
import { baseApi } from '../baseApi';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (params) => ({
        url: '/notifications',
        params,
      }),
      providesTags: ['Notification'],
    }),
    
    markAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} = notificationApi;
```

## Using API Hooks in Components

### Query Example (GET request)

```javascript
import { useGetUserOrdersQuery } from '../api/user/userApi';

function OrdersPage() {
  const { data, isLoading, isError, error, refetch } = useGetUserOrdersQuery();
  
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>Orders</h1>
      <button onClick={refetch}>Refresh</button>
      {data?.orders?.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
```

### Mutation Example (POST/PUT/DELETE request)

```javascript
import { useCreateOrderMutation } from '../api/user/userApi';
import { toast } from 'react-toastify';

function CreateOrderForm() {
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  
  const handleSubmit = async (formData) => {
    try {
      const result = await createOrder(formData).unwrap();
      toast.success('Order created successfully!');
      // Handle success
    } catch (error) {
      // Error is already handled by global middleware
      console.error('Failed to create order:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Order'}
      </button>
    </form>
  );
}
```

## Cache Management

### Cache Tags

Tags are used to manage cache invalidation:

- **providesTags**: Marks data with tags (used in queries)
- **invalidatesTags**: Invalidates cached data with matching tags (used in mutations)

Available tags:
- `User` - User authentication and profile data
- `Order` - Order data
- `Driver` - Driver data
- `Admin` - Admin dashboard data
- `Balance` - Balance information
- `Notification` - Notifications
- `Profile` - User/Driver profile data

### Manual Cache Invalidation

```javascript
import { useDispatch } from 'react-redux';
import { baseApi } from '../api/baseApi';

function MyComponent() {
  const dispatch = useDispatch();
  
  const handleRefresh = () => {
    // Invalidate specific tags
    dispatch(baseApi.util.invalidateTags(['Order', 'Balance']));
  };
  
  return <button onClick={handleRefresh}>Refresh Data</button>;
}
```

## Query Parameters

```javascript
// With query parameters
const { data } = useGetUserOrdersQuery({ 
  status: 'pending', 
  page: 1, 
  limit: 10 
});
```

## Conditional Queries

```javascript
// Skip query if condition is not met
const { data } = useGetUserProfileQuery(undefined, {
  skip: !isAuthenticated,
});
```

## Polling

```javascript
// Refetch every 30 seconds
const { data } = useGetUserOrdersQuery(undefined, {
  pollingInterval: 30000,
});
```

## File Uploads

```javascript
import { prepareFormData } from '../utils/apiHelpers';

const [uploadDocument] = useUploadDocumentMutation();

const handleFileUpload = async (file) => {
  const formData = prepareFormData({
    document: file,
    type: 'contract',
  });
  
  await uploadDocument(formData).unwrap();
};
```

## Best Practices

1. **Use hooks in components**: Always use the generated hooks (`useXxxQuery`, `useXxxMutation`)
2. **Handle loading states**: Show loading indicators during API calls
3. **Error handling**: Let global middleware handle errors, but catch specific cases if needed
4. **Cache invalidation**: Use appropriate tags to keep data fresh
5. **Optimistic updates**: Use `onQueryStarted` for optimistic UI updates
6. **Avoid over-fetching**: Use `skip` option to prevent unnecessary requests

## Troubleshooting

### Token not being sent
- Check that token is stored in Redux state or localStorage
- Verify `prepareHeaders` in `baseApi.js` is working

### Cache not updating
- Ensure mutation has `invalidatesTags` matching query's `providesTags`
- Check tag names are spelled correctly

### CORS errors
- Verify API base URL in `.env` file
- Check backend CORS configuration
