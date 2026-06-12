import {initializeApp, getApps, getApp} from '@react-native-firebase/app';
import {getFirestore} from '@react-native-firebase/firestore';
import {initializeAuth} from '@react-native-firebase/auth';
import {getMessaging} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import Config from 'react-native-config';

const firebaseConfig = {
  apiKey:
    Platform.OS === 'ios'
      ? Config.FIREBASE_API_KEY_IOS
      : Config.FIREBASE_API_KEY_ANDROID,
  projectId: Config.FIREBASE_PROJECT_ID,
  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
  appId:
    Platform.OS === 'ios'
      ? Config.FIREBASE_APP_ID_IOS
      : Config.FIREBASE_APP_ID_ANDROID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: AsyncStorage,
});

const messaging = getMessaging(app);

export {app, db, auth, messaging};
