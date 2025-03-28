import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CartItem} from '../components/types/screenTypes/ScreenTypes';

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
  serviceOffered?: number[];
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

  // Others
  option: string;
  role: string;
  user_id: number;
  user_uuid: string;
  token: string;
  service_uuid: string;
  product_uuid: string;
  cart: CartItem[];
  service_provider_uuid: string;
}

export const initialState: AuthState = {
  email: '',
  phoneNumber: '',
  password: '',
  cnic: null,
  photo: null,
  card: null,
  option: '',
  role: '',
  user_id: 0,
  token: '',
  service_uuid: '',
  product_uuid: '',
  cart: [],
  user_uuid: '',
  service_provider_uuid: '',
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
          'email',
          'phoneNumber',
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
    setServiceUuid: (state, action: PayloadAction<string>) => {
      state.service_uuid = action.payload;
    },
    setProductUuid: (state, action: PayloadAction<string>) => {
      state.product_uuid = action.payload;
    },
    setServiceProviderUuid: (state, action: PayloadAction<string>) => {
      state.service_provider_uuid = action.payload;
    },
    setUser: (
      state,
      action: PayloadAction<{
        role: string;
        userId: number;
        token: string;
        firebaseUid: string; // Renamed to make it clear this should be the Firebase Auth UID
      }>,
    ) => {
      state.role = action.payload.role;
      state.user_id = action.payload.userId;
      state.token = action.payload.token;
      state.user_uuid = action.payload.firebaseUid; // Set user_uuid to Firebase Auth UID
    },
    setUserUuid: (state, action: PayloadAction<string>) => {
      state.user_uuid = action.payload; // New reducer to explicitly set user_uuid
    },
    clearUser: state => {
      state.role = '';
      state.user_id = 0;
      state.option = '';
      state.token = '';
      state.cart = [];
      state.user_uuid = '';
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.cart.findIndex(
        item => item.productUuid === action.payload.productUuid,
      );
      if (existingItemIndex !== -1) {
        state.cart[existingItemIndex].quantity =
          (state.cart[existingItemIndex].quantity || 1) + 1;
      } else {
        state.cart.push({...action.payload, quantity: 1});
      }
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const productUuid = action.payload;
      const item = state.cart.find(i => i.productUuid === productUuid);
      if (item) {
        item.quantity = (item.quantity || 1) + 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const productUuid = action.payload;
      const item = state.cart.find(i => i.productUuid === productUuid);
      if (item) {
        if ((item.quantity || 1) > 1) {
          item.quantity = (item.quantity || 1) - 1;
        } else {
          state.cart = state.cart.filter(i => i.productUuid !== productUuid);
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productUuid = action.payload;
      state.cart = state.cart.filter(i => i.productUuid !== productUuid);
    },
    clearCart: state => {
      state.cart = [];
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
  email: state.auth.email,
  phoneNumber: state.auth.phoneNumber,
});

export const selectCnicImage = (state: {auth: AuthState}) => state.auth.cnic;
export const selectPhotoImage = (state: {auth: AuthState}) => state.auth.photo;
export const selectCardImage = (state: {auth: AuthState}) => state.auth.card;

export const selectOption = (state: {auth: AuthState}) => state.auth.option;
export const selectRole = (state: {auth: AuthState}) => state.auth.role;
export const selectUserId = (state: {auth: AuthState}) => state.auth.user_id;
export const selectUserUuidId = (state: {auth: AuthState}) =>
  state.auth.user_uuid;

export const selectToken = (state: {auth: AuthState}) => state.auth.token;
export const selectServiceUuid = (state: {auth: AuthState}) =>
  state.auth.service_uuid;
export const selectProductUuid = (state: {auth: AuthState}) =>
  state.auth.product_uuid;
export const selectServiceProviderUuid = (state: {auth: AuthState}) =>
  state.auth.service_provider_uuid;
export const selectCart = (state: {auth: AuthState}) => state.auth.cart;

export const {
  updateCustomerField,
  updateBusinessField,
  setOption,
  updateCard,
  updateCnic,
  updatePhoto,
  setUser,
  setUserUuid, // Export the new reducer
  clearUser,
  setServiceUuid,
  setProductUuid,
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
  setServiceProviderUuid,
} = authSlice.actions;

export default authSlice.reducer;
