import {configureStore} from '@reduxjs/toolkit';
import authReducer from './src/slice/Slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 64, // Increases the warning threshold to avoid minor warnings
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
