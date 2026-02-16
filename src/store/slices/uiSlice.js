import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/constants';

/**
 * UI Slice
 * Manages UI preferences and global UI state
 */

const getInitialLanguage = () => {
  return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'ar';
};

const initialState = {
  language: getInitialLanguage(),
  sidebarOpen: false,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Set application language
     */
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, action.payload);
    },
    
    /**
     * Toggle sidebar open/close
     */
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    /**
     * Set sidebar state
     */
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    /**
     * Set theme (light/dark)
     */
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { setLanguage, toggleSidebar, setSidebarOpen, setTheme } = uiSlice.actions;

// Selectors
export const selectLanguage = (state) => state.ui.language;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectTheme = (state) => state.ui.theme;

export default uiSlice.reducer;
