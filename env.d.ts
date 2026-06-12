declare module 'react-native-config' {
  export interface NativeConfig {
    FIREBASE_API_KEY_IOS: string;
    FIREBASE_API_KEY_ANDROID: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_STORAGE_BUCKET: string;
    FIREBASE_MESSAGING_SENDER_ID: string;
    FIREBASE_APP_ID_IOS: string;
    FIREBASE_APP_ID_ANDROID: string;
    STRIPE_PUBLISHABLE_KEY: string;
    API_BASE_URL: string;
    GOOGLE_MAPS_API_KEY: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
