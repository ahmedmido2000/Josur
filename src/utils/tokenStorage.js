import { STORAGE_KEYS } from './constants';
import { jwtDecode } from 'jwt-decode';

/**
 * Token Storage Utilities
 * Handles secure storage and retrieval of authentication tokens
 */

/**
 * Store authentication token in localStorage
 * @param {string} token - JWT token to store
 */
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }
};

/**
 * Retrieve authentication token from localStorage
 * @returns {string|null} - JWT token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Remove authentication token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

/**
 * Decode JWT token and extract payload
 * @param {string} token - JWT token to decode
 * @returns {object|null} - Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} - True if token is expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    // Check if token expiration time is in the past
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get user role from token
 * @param {string} token - JWT token
 * @returns {string|null} - User role or null
 */
export const getUserRoleFromToken = (token) => {
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

/**
 * Get user ID from token
 * @param {string} token - JWT token
 * @returns {string|number|null} - User ID or null
 */
export const getUserIdFromToken = (token) => {
  const decoded = decodeToken(token);
  return decoded?.id || decoded?.userId || null;
};

/**
 * Store user data in localStorage
 * @param {object} userData - User data to store
 */
export const setUserData = (userData) => {
  if (userData) {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  }
};

/**
 * Retrieve user data from localStorage
 * @returns {object|null} - User data or null
 */
export const getUserData = () => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  try {
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};
