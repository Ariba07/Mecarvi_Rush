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
  servicesOffered?: string[]; // Added for service providers
  latitude?: number;
  longitude?: number;
  defaultCity: string | null;
  defaultCountry: string | null;
  deliveryCity: string | null;
  deliveryCountry: string | null;
  notifyUuid?: string;
  sourceType?: string;
  addressType?: string;
  addressId?: number;
  deliveryDate: string | null; // Store date in YYYY-MM-DD format
  deliveryTime: string | null;
  totalPrice?: number;
  username?: string;
  userUuid?: string;
  id?: number;
  dispatchId?: number;
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
  servicesOffered: [], // Initialize as empty array
  latitude: 0,
  longitude: 0,
  defaultCity: null,
  defaultCountry: null,
  deliveryCity: null,
  deliveryCountry: null,
  notifyUuid: '',
  sourceType: '',
  addressType: 'pickup',
  addressId: undefined,
  deliveryDate: null,
  deliveryTime: null,
  totalPrice: 0,
  username: '',
  userUuid: '',
  id: 0,
  dispatchId: 0,
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
          'longitude',
          'latitude',
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
    setAddressId: (state, action: PayloadAction<number>) => {
      state.addressId = action.payload;
    },
    setTotalPrice: (state, action: PayloadAction<number>) => {
      state.totalPrice = action.payload;
    },
    setSourceType: (state, action: PayloadAction<string>) => {
      state.sourceType = action.payload;
    },
    setAddressType: (state, action: PayloadAction<string>) => {
      state.addressType = action.payload;
    },
    setServiceUuid: (state, action: PayloadAction<string>) => {
      state.service_uuid = action.payload;
    },
    setDispatchId: (state, action: PayloadAction<number>) => {
      state.dispatchId = action.payload;
    },
    setProductUuid: (state, action: PayloadAction<string>) => {
      state.product_uuid = action.payload;
    },
    setNotifyUuid: (state, action: PayloadAction<string>) => {
      state.notifyUuid = action.payload;
    },
    setServiceProviderUuid: (state, action: PayloadAction<string>) => {
      state.service_provider_uuid = action.payload;
    },
    setDeliveryDate(state, action: PayloadAction<string | null>) {
      state.deliveryDate = action.payload;
    },
    setDeliveryTime(state, action: PayloadAction<string | null>) {
      state.deliveryTime = action.payload;
    },
    setUser: (
      state,
      action: PayloadAction<{
        role: string;
        userId: number;
        token: string;
        firebaseUid: string;
        serviceProviderUuid?: string; // Optional, only for service providers
        servicesOffered?: string[]; // Optional, only for service providers
        username?: string; // Optional, only for service providers
        userUuid?: string; // Optional, only for service providers
        id?: number; // Optional, only for service providers
      }>,
    ) => {
      state.role = action.payload.role;
      state.user_id = action.payload.userId;
      state.token = action.payload.token;
      state.user_uuid = action.payload.firebaseUid;
      state.service_provider_uuid = action.payload.serviceProviderUuid || '';
      state.servicesOffered = action.payload.servicesOffered || [];
      state.username = action.payload.username || '';
      state.userUuid = action.payload.userUuid || '';
      state.id = action.payload.id || 0;
    },
    setUserUuid: (state, action: PayloadAction<string>) => {
      state.user_uuid = action.payload;
    },
    clearUser: state => {
      state.role = '';
      state.user_id = 0;
      state.option = '';
      state.token = '';
      state.cart = [];
      state.user_uuid = '';
      state.service_provider_uuid = '';
      state.servicesOffered = [];
      state.notifyUuid = '';
      state.sourceType = '';
      state.addressType = '';
      state.addressId = undefined;
      state.userUuid = '';
      state.username = '';
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.cart.findIndex(
        item => item.productUuid === action.payload.productUuid,
      );
      if (existingItemIndex !== -1) {
        state.cart[existingItemIndex].quantity =
          (state.cart[existingItemIndex].quantity || 1) + 1;
      } else {
        state.cart.push({
          ...action.payload,
          quantity: action.payload.quantity || 1, // Use provided quantity, fallback to 1
        });
      }
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cart.find(i => i.productUuid === action.payload);
      if (item) {
        item.quantity = (item.quantity || 1) + 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cart.find(i => i.productUuid === action.payload);
      if (item) {
        if ((item.quantity || 1) > 1) {
          item.quantity = (item.quantity || 1) - 1;
        } else {
          state.cart = state.cart.filter(i => i.productUuid !== action.payload);
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(i => i.productUuid !== action.payload);
    },
    clearCart: state => {
      state.cart = [];
    },
    setDefaultAddressDetails: (
      state,
      action: PayloadAction<{city: string; country: string}>,
    ) => {
      state.defaultCity = action.payload.city;
      state.defaultCountry = action.payload.country;
    },
    setDeliveryAddressDetails: (
      state,
      action: PayloadAction<{city: string; country: string}>,
    ) => {
      state.deliveryCity = action.payload.city;
      state.deliveryCountry = action.payload.country;
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
  longitude: state.auth.longitude,
  latitude: state.auth.latitude,
});

export const selectCnicImage = (state: {auth: AuthState}) => state.auth.cnic;
export const selectPhotoImage = (state: {auth: AuthState}) => state.auth.photo;
export const selectCardImage = (state: {auth: AuthState}) => state.auth.card;
export const selectTotalPrice = (state: {auth: AuthState}) =>
  state.auth.totalPrice;
export const selectOption = (state: {auth: AuthState}) => state.auth.option;
export const selectRole = (state: {auth: AuthState}) => state.auth.role;
export const selectUserName = (state: {auth: AuthState}) => state.auth.username;

export const selectUserId = (state: {auth: AuthState}) => state.auth.user_id;
export const selectId = (state: {auth: AuthState}) => state.auth.id;

export const selectUserUuidId = (state: {auth: AuthState}) =>
  state.auth.user_uuid;
export const selectToken = (state: {auth: AuthState}) => state.auth.token;
export const selectSourceType = (state: {auth: AuthState}) =>
  state.auth.sourceType;
export const selectAddressType = (state: {auth: AuthState}) =>
  state.auth.addressType;
export const selectServiceUuid = (state: {auth: AuthState}) =>
  state.auth.service_uuid;
export const selectProductUuid = (state: {auth: AuthState}) =>
  state.auth.product_uuid;
export const selectNotifyUuid = (state: {auth: AuthState}) =>
  state.auth.notifyUuid;
export const selectServiceProviderUuid = (state: {auth: AuthState}) =>
  state.auth.service_provider_uuid;
export const selectCart = (state: {auth: AuthState}) => state.auth.cart;
export const selectServicesOffered = (state: {auth: AuthState}) =>
  state.auth.servicesOffered;
export const selectDefaultCity = (state: {auth: AuthState}) =>
  state.auth.defaultCity;
export const selectDefaultCountry = (state: {auth: AuthState}) =>
  state.auth.defaultCountry;
export const selectDeliveryCity = (state: {auth: AuthState}) =>
  state.auth.deliveryCity;
export const selectDeliveryCountry = (state: {auth: AuthState}) =>
  state.auth.deliveryCountry;
export const selectAddressId = (state: {auth: AuthState}) =>
  state.auth.addressId;
export const selectDispatchId = (state: {auth: AuthState}) =>
  state.auth.dispatchId;
export const selectDeliveryDate = (state: {auth: AuthState}) =>
  state.auth.deliveryDate;
export const selectDeliveryTime = (state: {auth: AuthState}) =>
  state.auth.deliveryTime;

export const {
  setDeliveryDate,
  setDeliveryTime,
  updateCustomerField,
  updateBusinessField,
  setOption,
  updateCard,
  updateCnic,
  updatePhoto,
  setUser,
  setUserUuid,
  clearUser,
  setServiceUuid,
  setProductUuid,
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
  setServiceProviderUuid,
  setDefaultAddressDetails,
  setDeliveryAddressDetails,
  setNotifyUuid,
  setSourceType,
  setAddressType,
  setAddressId,
  setTotalPrice,
  setDispatchId,
} = authSlice.actions;

export default authSlice.reducer;
