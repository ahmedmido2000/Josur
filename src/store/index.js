import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '../api/baseApi';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import { errorMiddleware } from './middleware/errorMiddleware';

/**
 * Redux Store Configuration
 * Combines all reducers and middleware
 */

export const store = configureStore({
  reducer: {
    // RTK Query API reducer
    [baseApi.reducerPath]: baseApi.reducer,
    
    // Redux slices
    auth: authReducer,
    ui: uiReducer,
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for RTK Query
      serializableCheck: {
        ignoredActions: [baseApi.reducerPath + '/executeQuery/fulfilled'],
      },
    })
      .concat(baseApi.middleware)
      .concat(errorMiddleware),
  
  // Enable Redux DevTools in development
  devTools: import.meta.env.VITE_ENABLE_REDUX_DEVTOOLS !== 'false',
});

// Enable refetchOnFocus and refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;
