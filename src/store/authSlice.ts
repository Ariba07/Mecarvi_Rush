import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CartItem} from '@/types/navigation';

export interface ImageData {
  uri: string;
  type: string;
  name: string;
  fileSize?: number;
  width?: number;
  height?: number;
}

export interface AcceptedBid {
  product_id: number;
  quantity: number;
  bid_price: number;
  servicer_id: number;
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

  // Others
  role: string;
  user_id: number;
  user_uuid: string;
  token: string;
  service_uuid: string;
  product_uuid: string;
  cart: CartItem[];
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
  deliveryDate: string | null;
  deliveryTime: string | null;
  totalPrice?: number;
  username?: string;
  userUuid?: string;
  id?: number;
  dispatchId?: number;
  marketplace_uuid?: string;
  walletBalance?: number;
  pointsEarned?: number;
  pointsUsed?: number;
  subscriptionStatus?: string;
  acceptedBids: AcceptedBid[];
  quote_uuid?: string;
  profileImage: string | null;
}

export const initialState: AuthState = {
  email: '',
  phoneNumber: '',
  password: '',
  cnic: null,
  photo: null,
  card: null,

  role: '',
  user_id: 0,
  token: '',
  service_uuid: '',
  product_uuid: '',
  cart: [],
  user_uuid: '',
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
  walletBalance: 0,
  pointsEarned: 0,
  pointsUsed: 0,
  acceptedBids: [],
  quote_uuid: '',
  profileImage: null,
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

    updateCnic: (state, action: PayloadAction<ImageData | null>) => {
      state.cnic = action.payload;
    },
    updatePhoto: (state, action: PayloadAction<ImageData | null>) => {
      state.photo = action.payload;
    },
    updateCard: (state, action: PayloadAction<ImageData | null>) => {
      state.card = action.payload;
    },
    setWalletBalance: (state, action: PayloadAction<number>) => {
      state.walletBalance = action.payload;
    },
    setPointsEarned: (state, action: PayloadAction<number>) => {
      state.pointsEarned = action.payload;
    },
    setPointUsed: (state, action: PayloadAction<number>) => {
      state.pointsUsed = action.payload;
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
    setMarketPlaceUuid: (state, action: PayloadAction<string>) => {
      state.marketplace_uuid = action.payload;
    },
    setNotifyUuid: (state, action: PayloadAction<string>) => {
      state.notifyUuid = action.payload;
    },
    setSubscriptionStatus: (state, action: PayloadAction<string>) => {
      state.subscriptionStatus = action.payload;
    },
    setQuoteUuid: (state, action: PayloadAction<string>) => {
      state.quote_uuid = action.payload;
    },
    setDeliveryDate(state, action: PayloadAction<string | null>) {
      state.deliveryDate = action.payload;
    },
    setDeliveryTime(state, action: PayloadAction<string | null>) {
      state.deliveryTime = action.payload;
    },
    setProfileImage: (state, action: PayloadAction<string | null>) => {
      state.profileImage = action.payload;
    },
    setAcceptedBidDetails: (state, action: PayloadAction<AcceptedBid>) => {
      const existingBidIndex = state.acceptedBids.findIndex(
        bid =>
          bid.product_id === action.payload.product_id &&
          bid.servicer_id === action.payload.servicer_id,
      );
      if (existingBidIndex !== -1) {
        state.acceptedBids[existingBidIndex].quantity +=
          action.payload.quantity;
      } else {
        state.acceptedBids.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
      }
    },
    setUser: (
      state,
      action: PayloadAction<{
        role: string;
        userId: number;
        token: string;
        firebaseUid: string;
        username?: string;
        userUuid?: string;
        id?: number;
        walletBalance?: number;
        pointsEarned?: number;
        pointsUsed?: number;
        subscriptionStatus?: string;
      }>,
    ) => {
      state.role = action.payload.role;
      state.user_id = action.payload.userId;
      state.token = action.payload.token;
      state.user_uuid = action.payload.firebaseUid;
      state.username = action.payload.username || '';
      state.userUuid = action.payload.userUuid || '';
      state.id = action.payload.id || 0;
      state.walletBalance = action.payload.walletBalance || 0;
      state.pointsEarned = action.payload.pointsEarned || 0;
      state.pointsUsed = action.payload.pointsUsed || 0;
      state.subscriptionStatus = action.payload.subscriptionStatus || '';
    },
    setUserUuid: (state, action: PayloadAction<string>) => {
      state.user_uuid = action.payload;
    },
    clearUser: state => {
      state.role = '';
      state.user_id = 0;
      state.token = '';
      state.cart = [];
      state.user_uuid = '';
      state.notifyUuid = '';
      state.sourceType = '';
      state.addressType = '';
      state.addressId = undefined;
      state.userUuid = '';
      state.username = '';
      state.walletBalance = 0;
      state.pointsEarned = 0;
      state.pointsUsed = 0;
      state.acceptedBids = [];
      state.quote_uuid = '';
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
          quantity: action.payload.quantity || 1,
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

export const selectCnicImage = (state: {auth: AuthState}) => state.auth.cnic;
export const selectPhotoImage = (state: {auth: AuthState}) => state.auth.photo;
export const selectCardImage = (state: {auth: AuthState}) => state.auth.card;
export const selectTotalPrice = (state: {auth: AuthState}) =>
  state.auth.totalPrice;
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
export const selectMarketplaceUuid = (state: {auth: AuthState}) =>
  state.auth.marketplace_uuid;
export const selectProductUuid = (state: {auth: AuthState}) =>
  state.auth.product_uuid;
export const selectNotifyUuid = (state: {auth: AuthState}) =>
  state.auth.notifyUuid;
export const selectQuoteUuid = (state: {auth: AuthState}) =>
  state.auth.quote_uuid;
export const selectCart = (state: {auth: AuthState}) => state.auth.cart;
export const selectDefaultCity = (state: {auth: AuthState}) =>
  state.auth.defaultCity;
export const selectDefaultCountry = (state: {auth: AuthState}) =>
  state.auth.defaultCountry;
export const selectDeliveryCity = (state: {auth: AuthState}) =>
  state.auth.deliveryCity;
export const selectDeliveryCountry = (state: {auth: AuthState}) =>
  state.auth.deliveryCountry;
export const selectSubscriptionStatus = (state: {auth: AuthState}) =>
  state.auth.subscriptionStatus;
export const selectAddressId = (state: {auth: AuthState}) =>
  state.auth.addressId;
export const selectDispatchId = (state: {auth: AuthState}) =>
  state.auth.dispatchId;
export const selectWalletBalance = (state: {auth: AuthState}) =>
  state.auth.walletBalance;
export const selectPointsEarned = (state: {auth: AuthState}) =>
  state.auth.pointsEarned;
export const selectPointsUsed = (state: {auth: AuthState}) =>
  state.auth.pointsUsed;
export const selectDeliveryDate = (state: {auth: AuthState}) =>
  state.auth.deliveryDate;
export const selectDeliveryTime = (state: {auth: AuthState}) =>
  state.auth.deliveryTime;
export const selectAcceptedBidDetails = (state: {auth: AuthState}) =>
  state.auth.acceptedBids;
export const selectProfileImage = (state: {auth: AuthState}) =>
  state.auth.profileImage;

export const {
  setDeliveryDate,
  setDeliveryTime,
  updateCustomerField,
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
  setDefaultAddressDetails,
  setDeliveryAddressDetails,
  setNotifyUuid,
  setSourceType,
  setAddressType,
  setAddressId,
  setTotalPrice,
  setDispatchId,
  setMarketPlaceUuid,
  setAcceptedBidDetails,
  setQuoteUuid,
  setSubscriptionStatus,
  setProfileImage,
  setWalletBalance,
  setPointUsed,
  setPointsEarned,
} = authSlice.actions;

export default authSlice.reducer;
