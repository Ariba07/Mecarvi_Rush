import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from '../Mecarvi_Rush/src/slice/Slice'; // Updated path

// Persist configuration
const persistConfig = {
  key: 'auth', // Key for the persisted state (auth slice)
  storage: AsyncStorage, // Use AsyncStorage for persistence
  whitelist: ['cart', 'sourceType'], // Only persist the 'cart' field within 'auth' (optional optimization)
};

// Wrap the authReducer with persistReducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Create the store
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Persist the auth slice
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore persist actions
        ignoredPaths: ['auth.cart', 'auth.sourceType'], // Ignore paths with non-serializable data if needed
      },
    }),
});

// Create the persistor
const persistor = persistStore(store, null, () => {
  console.log('State rehydrated:', store.getState());
});

// // Debug: Log state changes and AsyncStorage content
// store.subscribe(() => {
//   const state = store.getState();
//   console.log('State updated:', state);
//   AsyncStorage.getItem('persist:auth')
//     .then(data => console.log('Persisted state in AsyncStorage:', data))
//     .catch(err => console.error('Error reading AsyncStorage:', err));
// });

export {store, persistor};

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
