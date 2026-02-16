import { createSlice } from '@reduxjs/toolkit';
import { getToken, setToken, removeToken, getUserData, setUserData, decodeToken } from '../../utils/tokenStorage';

/**
 * Auth Slice
 * Manages authentication state and user data
 */

const initialState = {
  user: getUserData(),
  token: getToken(),
  isAuthenticated: !!getToken(),
  role: null,
};

// Decode token to get role if token exists
if (initialState.token) {
  const decoded = decodeToken(initialState.token);
  initialState.role = decoded?.role || null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set credentials after successful login
     */
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
      // Decode token to get role
      const decoded = decodeToken(token);
      state.role = decoded?.role || user?.role || null;
      
      // Store in localStorage
      setToken(token);
      setUserData(user);
    },
    
    /**
     * Update user profile data
     */
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      setUserData(state.user);
    },
    
    /**
     * Logout and clear all auth data
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      
      // Clear localStorage
      removeToken();
    },
    
    /**
     * Refresh token
     */
    refreshToken: (state, action) => {
      const { token } = action.payload;
      state.token = token;
      setToken(token);
      
      // Update role from new token
      const decoded = decodeToken(token);
      state.role = decoded?.role || null;
    },
  },
});

export const { setCredentials, updateUser, logout, refreshToken } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.role;

export default authSlice.reducer;
