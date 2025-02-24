import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface ImageData {
  uri: string;
  type: string;
  name: string;
  fileSize?: number;
  width?: number;
  height?: number;
}

export interface AuthState {
  // Customer Fields
  fullName?: string;
  email: string;
  phoneNumber: string;
  password: string;
  cnic: ImageData | null;
  photo: ImageData | null;
  card: ImageData | null;

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
  cnic: null,
  photo: null,
  card: null,
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
        ['fullName', 'email', 'phoneNumber', 'password'].includes(
          action.payload.field,
        )
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
          'password',
        ].includes(action.payload.field)
      ) {
        state[action.payload.field] = action.payload.value;
      }
    },
    updateCnic: (state, action: PayloadAction<ImageData | null>) => {
      state.cnic = action.payload;
    },
    updatePhoto: (state, action: PayloadAction<ImageData | null>) => {
      state.photo = action.payload;
    },
    updateCard: (state, action: PayloadAction<ImageData | null>) => {
      state.card = action.payload;
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
});

export const selectCnicImage = (state: {auth: AuthState}) => state.auth.cnic;
export const selectPhotoImage = (state: {auth: AuthState}) => state.auth.photo;
export const selectCardImage = (state: {auth: AuthState}) => state.auth.card;

export const selectOption = (state: {auth: AuthState}) => state.auth.option;

export const {
  updateCustomerField,
  updateBusinessField,
  setOption,
  updateCard,
  updateCnic,
  updatePhoto,
} = authSlice.actions;
export default authSlice.reducer;
