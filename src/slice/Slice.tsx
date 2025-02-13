import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface AuthState {
  // Customer Fields
  fullName?: string;
  email: string;
  phoneNumber: string;
  password: string;
  cnic: string | null;
  photo: string | null;
  card: string | null;

  // Business Fields
  name?: string;
  registrationNumber?: string;
  stateRegistration?: string;
  tin?: string;
  businessStructure?: string;
  yearEstablished?: string;
  address?: string;
  ownerName?: string;
  ownerPhoneNumber?: string;
  ownerEmail?: string;
  linkedIn?: string;
  serviceOffered?: string[];
  productionCapacity?: string;
  turnaroundTime?: string;
  specialization?: string;
  targetMarket?: string;
  facebookLink?: string;
  instagramLink?: string;
  logoUpload?: null;
  portfolio?: null;
  businessProof?: null;
  documentVerification?: null;
  onboardingAvailability?: string;
  website?: string;

  //others
  option: string;
}

export const initialState: AuthState = {
  email: '',
  phoneNumber: '',
  password: '',
  cnic: '',
  photo: '',
  card: '',
  option: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateCustomerField: <K extends keyof AuthState>(
      state: AuthState,
      action: PayloadAction<{field: K; value: AuthState[K]}>,
    ) => {
      if (
        [
          'fullName',
          'email',
          'phoneNumber',
          'password',
          'cnic',
          'photo',
          'card',
        ].includes(action.payload.field)
      ) {
        state[action.payload.field] = action.payload.value;
      }
    },
    updateBusinessField: <K extends keyof AuthState>(
      state: AuthState,
      action: PayloadAction<{field: K; value: AuthState[K]}>,
    ) => {
      if (
        [
          'name',
          'website',
          'registrationNumber',
          'stateRegistration',
          'tin',
          'businessStructure',
          'yearEstablished',
          'address',
          'ownerName',
          'ownerPhoneNumber',
          'ownerEmail',
          'linkedIn',
          'serviceOffered',
          'productionCapacity',
          'turnaroundTime',
          'specialization',
          'targetMarket',
          'facebookLink',
          'instagramLink',
          'logoUpload',
          'portfolio',
          'businessProof',
          'documentVerification',
          'onboardingAvailability',
          'cnic',
          'photo',
          'card',
          'password',
        ].includes(action.payload.field)
      ) {
        state[action.payload.field] = action.payload.value;
      }
    },
    setOption: (state, action: PayloadAction<string>) => {
      state.option = action.payload;
    },
  },
});

export const selectCustomerAuthState = (state: {auth: AuthState}) => ({
  fullName: state.auth.fullName,
  email: state.auth.email,
  phoneNumber: state.auth.phoneNumber,
  password: state.auth.password,
  cnic: state.auth.cnic,
  photo: state.auth.photo,
  card: state.auth.card,
});

export const selectBusinessAuthState = (state: {auth: AuthState}) => ({
  name: state.auth.name,
  website: state.auth.website,
  registrationNumber: state.auth.registrationNumber,
  stateRegistration: state.auth.stateRegistration,
  tin: state.auth.tin,
  businessStructure: state.auth.businessStructure,
  yearEstablished: state.auth.yearEstablished,
  address: state.auth.address,
  ownerName: state.auth.ownerName,
  ownerPhoneNumber: state.auth.ownerPhoneNumber,
  ownerEmail: state.auth.ownerEmail,
  linkedIn: state.auth.linkedIn,
  serviceOffered: state.auth.serviceOffered,
  productionCapacity: state.auth.productionCapacity,
  turnaroundTime: state.auth.turnaroundTime,
  specialization: state.auth.specialization,
  targetMarket: state.auth.targetMarket,
  facebookLink: state.auth.facebookLink,
  instagramLink: state.auth.instagramLink,
  logoUpload: state.auth.logoUpload,
  portfolio: state.auth.portfolio,
  businessProof: state.auth.businessProof,
  documentVerification: state.auth.documentVerification,
  onboardingAvailability: state.auth.onboardingAvailability,
  password: state.auth.password,
  cnic: state.auth.cnic,
  photo: state.auth.photo,
  card: state.auth.card,
});
export const selectOption = (state: {auth: AuthState}) => state.auth.option;

export const {updateCustomerField, updateBusinessField, setOption} =
  authSlice.actions;
export default authSlice.reducer;
