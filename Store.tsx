import {configureStore} from '@reduxjs/toolkit';
import authReducer from './src/slice/Slice'; // Import your auth slice

const store = configureStore({
  reducer: {
    auth: authReducer, // Add auth slice to Redux store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
