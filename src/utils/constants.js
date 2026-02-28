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
  RESET_PASSWORD: '/reset-password',
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
  SIGNUP_DRIVER: '/api/web/v1/site/signup-driver',
  PASSWORD_RESET: '/api/web/v1/site/password-reset',
  RESET_PASSWORD: '/api/web/v1/site/reset-password',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  GET_CURRENT_USER: '/auth/me',

  DRIVER_ORDERS: '/api/web/v1/site/driver-order',
  DRIVER_NEW_ORDERS: '/api/web/v1/site/driver-new-order',
  DRIVER_SHIPPING_ORDERS: '/api/web/v1/site/driver-shipping-order',
  DRIVER_COMPLETE_ORDERS: '/api/web/v1/site/driver-complete-order',
  CREATE_OFFER: '/api/web/v1/site/create-offer',
  RATE_CUSTOMER: '/api/web/v1/site/rate-customer',
  START_ORDER: '/api/web/v1/site/start-order',
  UPLOAD_IMAGE_BEFORE: '/api/web/v1/site/upload-image-before',
  UPLOAD_IMAGE_AFTER: '/api/web/v1/site/upload-image-after',
  CUSTOMER_SIGNATURE: '/api/web/v1/site/customer-signature',
  END_ORDER: '/api/web/v1/site/end-order',
  
  // User
  USER_ORDERS: '/user/orders',
  USER_BALANCE: '/api/web/v1/site/user-balance',
  USER_PROFILE: '/api/web/v1/site/profile',
  USER_DOCUMENTS: '/user/documents',

  NOTIFICATIONS: '/api/web/v1/site/notification',

  // Normal Orders
  MY_NORMAL_NEW_ORDERS: '/api/web/v1/site/my-normal-new-order',
  MY_NORMAL_SHIPPING_ORDERS: '/api/web/v1/site/my-normal-shipping-order',
  MY_NORMAL_COMPLETE_ORDERS: '/api/web/v1/site/my-normal-complete-order',
  MY_NORMAL_CANCELED_ORDERS: '/api/web/v1/site/my-normal-canceled-order',

  // Trip Orders
  MY_TRIP_NEW_ORDERS: '/api/web/v1/site/my-trip-new-order',
  MY_TRIP_SHIPPING_ORDERS: '/api/web/v1/site/my-trip-shipping-order',
  MY_TRIP_COMPLETE_ORDERS: '/api/web/v1/site/my-trip-complete-order',
  MY_TRIP_CANCELED_ORDERS: '/api/web/v1/site/my-trip-canceled-order',

  // Contract Orders
  MY_CONTRACT_NEW_ORDERS: '/api/web/v1/site/my-contract-new-order',
  MY_CONTRACT_SHIPPING_ORDERS: '/api/web/v1/site/my-contract-shipping-order',
  MY_CONTRACT_COMPLETE_ORDERS: '/api/web/v1/site/my-contract-complete-order',
  MY_CONTRACT_CANCELED_ORDERS: '/api/web/v1/site/my-contract-canceled-order',

  // Driver
  DRIVER_ORDERS: '/driver/orders',
  DRIVER_BALANCE: '/api/web/v1/site/user-balance',
  DRIVER_PROFILE: '/api/web/v1/site/profile',
  DRIVER_NEW_ORDERS: '/api/web/v1/site/driver-new-order',
  DRIVER_SHIPPING_ORDERS: '/api/web/v1/site/driver-shipping-order',
  DRIVER_COMPLETE_ORDERS: '/api/web/v1/site/driver-complete-order',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_TRUCKS: '/admin/trucks',
  ADMIN_DRIVERS: '/admin/drivers',
  ADMIN_USERS: '/admin/users',
  ADMIN_COMPANY_DRIVERS: '/api/web/v1/site/company-driver',
  ADMIN_COMPANY_VEHICLES: '/api/web/v1/site/company-vehicle',
  ADD_VEHICLE: '/api/web/v1/site/add-vehicle',
  UPDATE_VEHICLE: '/api/web/v1/site/update-vehicle',
  VIEW_VEHICLE: '/api/web/v1/site/veiw-vehicle',
  COMPANY_ORDER: '/api/web/v1/site/company-order',

  // Site
  SITE_HOME: '/api/web/v1/site/home-web',
  SITE_CONTACT: '/api/web/v1/site/contact',
  SITE_TERMS: '/api/web/v1/site/term',
  NOTIFICATION_BADGE: '/api/web/v1/site/notification-budge',
  CREATE_NORMAL_REQUEST: '/api/web/v1/site/create-normal-request',
  CREATE_TRIP_REQUEST: '/api/web/v1/site/create-trip-request',
  CREATE_CONTRACT_REQUEST: '/api/web/v1/site/create-contract-request',
  SUB_TRUCK: '/api/web/v1/site/sub-truck',
  CANCEL_REQUEST: '/api/web/v1/site/cancel-request',
  RATE_REQUEST: '/api/web/v1/site/rate-request',
  ACCEPT_OFFER: '/api/web/v1/site/accept-offer',

  // Normal Orders (API per status)
  MY_NORMAL_NEW_ORDERS: '/api/web/v1/site/my-normal-new-order',
  MY_NORMAL_SHIPPING_ORDERS: '/api/web/v1/site/my-normal-shipping-order',
  MY_NORMAL_COMPLETE_ORDERS: '/api/web/v1/site/my-normal-complete-order',
  MY_NORMAL_CANCELED_ORDERS: '/api/web/v1/site/my-normal-canceled-order',
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
