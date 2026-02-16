# Josur - Architecture Documentation

## Overview

This document describes the architecture and structure of the Josur application, a React + Vite project with Redux Toolkit and RTK Query for state management and API integration.

## Technology Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching and caching
- **React Router** - Client-side routing
- **React Toastify** - Toast notifications
- **Bootstrap 5** - CSS framework
- **i18next** - Internationalization

## Project Structure

```
src/
├── api/                          # RTK Query API layer
│   ├── baseApi.js               # Base API configuration
│   ├── auth/                    # Authentication endpoints
│   ├── user/                    # User endpoints
│   ├── driver/                  # Driver endpoints
│   ├── admin/                   # Admin endpoints
│   └── README.md                # API documentation
│
├── store/                        # Redux store
│   ├── index.js                 # Store configuration
│   ├── slices/                  # Redux slices
│   │   ├── authSlice.js        # Authentication state
│   │   └── uiSlice.js          # UI preferences
│   └── middleware/              # Custom middleware
│       └── errorMiddleware.js   # Global error handling
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.js               # Authentication hook
│   └── useProtectedRoute.js     # Route protection hook
│
├── utils/                        # Utility functions
│   ├── tokenStorage.js          # Token management
│   ├── apiHelpers.js            # API helpers
│   └── constants.js             # App constants
│
├── components/                   # Shared components
│   ├── ProtectedRoute.jsx       # Auth guard
│   ├── PublicRoute.jsx          # Public route guard
│   ├── RoleBasedRoute.jsx       # Role-based guard
│   ├── LoadingSpinner.jsx       # Loading indicator
│   ├── ErrorBoundary.jsx        # Error boundary
│   └── ToastNotification.jsx    # Toast wrapper
│
├── shared/                       # Shared module
│   ├── components/              # Shared UI components
│   └── pages/                   # Public pages
│
├── user/                         # User module
│   ├── components/              # User-specific components
│   └── pages/                   # User pages
│
├── driver/                       # Driver module
│   ├── components/              # Driver-specific components
│   └── pages/                   # Driver pages
│
├── admin/                        # Admin module
│   ├── components/              # Admin-specific components
│   └── pages/                   # Admin pages
│
├── App.jsx                       # Main app with routing
├── main.jsx                      # Entry point
└── index.css                     # Global styles
```

## State Management Strategy

### When to Use RTK Query

Use RTK Query for **server state**:
- Fetching data from APIs
- Creating, updating, deleting resources
- Caching API responses
- Managing loading and error states for API calls

**Example:**
```javascript
const { data, isLoading } = useGetUserOrdersQuery();
```

### When to Use Redux Slices

Use Redux slices for **global client state**:
- Authentication state
- User profile data
- UI preferences (language, theme)
- App-wide settings

**Example:**
```javascript
const user = useSelector(selectCurrentUser);
dispatch(setCredentials({ user, token }));
```

### When to Use Local State

Use local component state for **component-specific UI state**:
- Form inputs
- Modal open/close state
- Accordion expand/collapse
- Temporary UI state

**Example:**
```javascript
const [isOpen, setIsOpen] = useState(false);
```

## Authentication Flow

### 1. Login Process

```
User submits credentials
    ↓
Login API called (RTK Query)
    ↓
Token received from server
    ↓
Token stored in localStorage
    ↓
User data stored in Redux
    ↓
Redirect to dashboard
```

### 2. Token Injection

All API requests automatically include the JWT token:

```javascript
// baseApi.js
prepareHeaders: (headers, { getState }) => {
  const token = getState().auth.token || getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}
```

### 3. Token Refresh

When a request fails with 401:
1. Attempt to refresh token
2. If successful, retry original request
3. If failed, logout user and redirect to login

### 4. Logout Process

```
User clicks logout
    ↓
Logout API called
    ↓
Token removed from localStorage
    ↓
Redux state cleared
    ↓
Redirect to login page
```

## Protected Routes

### Route Types

1. **Public Routes** - Accessible to everyone
   - Home, Contact, Works, Service Provider

2. **Auth Routes** - Only when NOT authenticated
   - Login, Register (redirect if already logged in)

3. **Protected Routes** - Require authentication
   - All user, driver, and admin routes

4. **Role-Based Routes** - Require specific role
   - User routes → `role: 'user'`
   - Driver routes → `role: 'driver'`
   - Admin routes → `role: 'admin'`

### Implementation

```javascript
// User route example
<Route 
  path="/user/orders" 
  element={
    <RoleBasedRoute allowedRoles={[USER_ROLES.USER]}>
      <Orders />
    </RoleBasedRoute>
  } 
/>
```

## Error Handling

### Global Error Middleware

All RTK Query errors are intercepted by `errorMiddleware.js`:

1. **401 Unauthorized** → Logout and redirect to login
2. **403 Forbidden** → Show access denied message
3. **404 Not Found** → Show not found message
4. **500 Server Error** → Show server error message
5. **Network Error** → Show connection error

### Component-Level Error Handling

```javascript
try {
  await createOrder(data).unwrap();
  toast.success('Success!');
} catch (error) {
  // Global middleware already showed error toast
  // Handle specific error cases here if needed
}
```

## Environment Configuration

### Development

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_REDUX_DEVTOOLS=true
```

### Production

```env
VITE_API_BASE_URL=https://api.production.com/api
VITE_ENABLE_REDUX_DEVTOOLS=false
```

## User Roles

The application supports three user roles:

1. **User** (`user`) - Regular customers
2. **Driver** (`driver`) - Delivery drivers
3. **Admin** (`admin`) - System administrators

Role is extracted from JWT token and stored in Redux state.

## API Integration Checklist

When integrating a new API endpoint:

- [ ] Add endpoint to appropriate API slice
- [ ] Export the generated hook
- [ ] Add appropriate cache tags
- [ ] Update constants if needed
- [ ] Use the hook in component
- [ ] Handle loading state
- [ ] Test error scenarios
- [ ] Verify cache invalidation works

## Best Practices

### 1. Component Organization
- Keep components small and focused
- Use composition over inheritance
- Extract reusable logic into custom hooks

### 2. State Management
- Prefer RTK Query for server state
- Use Redux slices sparingly for global state
- Keep local state when possible

### 3. API Calls
- Always handle loading states
- Let global middleware handle common errors
- Use cache tags for automatic updates

### 4. Security
- Never store sensitive data in localStorage
- Always validate user roles on backend
- Use HTTPS in production

### 5. Performance
- Use React.memo for expensive components
- Implement code splitting for routes
- Leverage RTK Query caching

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Ensure all environment variables are set in production:
- `VITE_API_BASE_URL` - Production API URL
- `VITE_ENABLE_REDUX_DEVTOOLS` - Set to `false`

## Troubleshooting

### Redux DevTools not working
- Check `VITE_ENABLE_REDUX_DEVTOOLS` in `.env`
- Ensure Redux DevTools extension is installed

### API calls failing
- Verify API base URL in `.env`
- Check network tab for request details
- Verify token is being sent in headers

### Protected routes not working
- Check user is authenticated
- Verify role matches route requirements
- Check token is valid and not expired

## Further Reading

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [React Router Documentation](https://reactrouter.com/)
