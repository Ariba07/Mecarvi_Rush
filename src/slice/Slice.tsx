import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  phoneNumber: string;
}

const initialState: AuthState = {
  phoneNumber: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
  },
});

// Selector to get phoneNumber from the auth slice
export const selectPhoneNumber = (state: {auth: AuthState}) =>
  state.auth.phoneNumber;

export const {setPhoneNumber} = authSlice.actions;
export default authSlice.reducer;
