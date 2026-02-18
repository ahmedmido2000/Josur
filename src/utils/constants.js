/**
 * Application Constants
 */

// User Roles (legacy - for route definitions)
export const USER_ROLES = {
  USER: 'user',
  DRIVER: 'driver',
  ADMIN: 'admin',
};

// User Types (from backend - actual values)
export const USER_TYPES = {
  CLIENT: 3,     // عميل
  DRIVER: 4,     // سائق
  OWNER: 5,      // المالك/الأدمن
};

// Map user_type to role string
export const getUserRoleFromType = (userType) => {
  switch (userType) {
    case USER_TYPES.CLIENT:
      return USER_ROLES.USER;
    case USER_TYPES.DRIVER:
      return USER_ROLES.DRIVER;
    case USER_TYPES.OWNER:
      return USER_ROLES.ADMIN;
    default:
      return null;
  }
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'josur_auth_token',
  USER_DATA: 'josur_user_data',
  LANGUAGE: 'josur_language',
};

// Route Paths
export const ROUTES = {
  // Public Routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/create-account',
  ACTIVATE_ACCOUNT: '/activate-account',
  FORGOT_PASSWORD: '/forgot-password',
  CONTACT: '/contact',
  SERVICE_PROVIDER: '/service-provider',
  WORKS: '/works',

  // User Routes
  USER_ORDERS: '/user/orders',
  USER_BALANCE: '/user/balance',
  USER_PROFILE: '/user/profile',
  USER_PROVIDER_ACCOUNT: '/user/provider-account',
  USER_BASIC_UPLOAD: '/user/basic-upload',
  USER_TRIP_UPLOAD: '/user/trip-upload',
  USER_CONTRACT_UPLOAD: '/user/contract-upload',
  USER_NOTIFICATIONS: '/user/notifications',
  USER_TRACKING: '/user/tracking',

  // Driver Routes
  DRIVER_ORDERS: '/driver/orders',
  DRIVER_BALANCE: '/driver/balance',
  DRIVER_PROFILE: '/driver/profile',
  DRIVER_NOTIFICATIONS: '/driver/notifications',
  DRIVER_MISSION_IN_ROAD: '/driver/mission-in-road',
  DRIVER_MISSION_STARTED: '/driver/mission-started',
  DRIVER_MISSION_ARRIVED: '/driver/mission-arrived',
  DRIVER_ORDER_DETAILS: '/driver/order-details',

  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ADD_TRUCK: '/admin/add-truck',
  ADMIN_ADD_DRIVER: '/admin/add-driver',
};

// API Endpoints (relative to base URL)
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/web/v1/site/login',
  REGISTER: '/api/web/v1/site/signup',
  ACTIVATE: '/api/web/v1/site/activate',
  LISTS: '/api/web/v1/site/lists',
  PASSWORD_RESET: '/api/web/v1/site/password-reset',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  GET_CURRENT_USER: '/auth/me',

  // User
  USER_ORDERS: '/user/orders',
  USER_BALANCE: '/user/balance',
  USER_PROFILE: '/user/profile',
  USER_DOCUMENTS: '/user/documents',

  // Driver
  DRIVER_ORDERS: '/driver/orders',
  DRIVER_BALANCE: '/driver/balance',
  DRIVER_PROFILE: '/driver/profile',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_TRUCKS: '/admin/trucks',
  ADMIN_DRIVERS: '/admin/drivers',
  ADMIN_USERS: '/admin/users',

  // Site
  SITE_HOME: '/api/web/v1/site/home-web',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Toast Configuration
export const TOAST_CONFIG = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};
