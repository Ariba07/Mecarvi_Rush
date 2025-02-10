import {configureStore} from '@reduxjs/toolkit';
import counterReducer from '../Mecarvi_Rush/src/slice/Slice'; // Example slice

export const store = configureStore({
  reducer: {
    counter: counterReducer, // Add reducers here
  },
});

export default store;
