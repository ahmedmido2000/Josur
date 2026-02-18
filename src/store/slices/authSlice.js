import { createSlice } from '@reduxjs/toolkit';
import { getToken, setToken, removeToken, getUserData, setUserData } from '../../utils/tokenStorage';
import { getUserRoleFromType } from '../../utils/constants';

/**
 * Auth Slice
 * Manages authentication state and user data
 */

const initialState = {
  user: getUserData(),
  token: getToken(),
  isAuthenticated: !!getToken(),
  role: null,
  userType: null,
};

// Set role from stored user data if exists
if (initialState.user?.user_type) {
  initialState.userType = initialState.user.user_type;
  initialState.role = getUserRoleFromType(initialState.user.user_type);
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
      
      // Set user type and map to role
      state.userType = user?.user_type || null;
      state.role = getUserRoleFromType(user?.user_type);
      
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
      state.userType = null;
      
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
      
      // Keep existing role and userType from user data
      // Token refresh doesn't change user identity
    },
  },
});

export const { setCredentials, updateUser, logout, refreshToken } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.role;
export const selectUserType = (state) => state.auth.userType;

export default authSlice.reducer;
