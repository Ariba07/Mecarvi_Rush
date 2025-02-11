import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

const initialState: AuthState = {
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateField: <K extends keyof AuthState>(
      state: AuthState,
      action: PayloadAction<{field: K; value: AuthState[K]}>,
    ) => {
      state[action.payload.field] = action.payload.value;
    },
  },
});

// Selector to get auth state
export const selectAuthState = (state: {auth: AuthState}) => state.auth;

// Export actions and reducer
export const {updateField} = authSlice.actions;
export default authSlice.reducer;
