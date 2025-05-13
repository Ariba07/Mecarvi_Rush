import * as Yup from 'yup';

export interface UserData {
  role: string;
  userId: number;
  token: string;
  firebaseUid: string;
  username: string;
  serviceProviderUuid?: string;
  servicesOffered?: string[];
  user_uuid?: string;
  id?: number;
  walletBalance?: number;
  pointsEarned?: number;
  pointsUsed?: number;
  subscriptionStatus?: string;
}

export interface ApiResponse {
  data: {
    user?: {
      id: number;
      roles: string[];
      user_uuid: string;
      subscription_status: string;
      wallet: {
        id: number;
        balance: number;
        points_earned: number;
        points_used: number;
      };
    };
    id?: number;
    roles?: string[];
    full_name?: string;
    service_provider_name?: string;
    service_provider_uuid?: string;
    services_offered?: string[];
    user_uuid?: string;
    subscription_status?: string;
    wallet?: {
      id: number;
      balance: number;
      points_earned: number;
      points_used: number;
    };
    image?: string;
  };
  meta: {token: string; firebase_token: string};
}

export const STORAGE_KEY = '@login_credentials';
export const TOKEN_KEY = 'userToken';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});
