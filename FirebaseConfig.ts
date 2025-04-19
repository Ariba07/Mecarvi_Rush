import {initializeApp, getApps, getApp} from '@react-native-firebase/app';
import {getFirestore} from '@react-native-firebase/firestore';
import {initializeAuth} from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';

const firebaseConfig = {
  apiKey:
    Platform.OS === 'ios'
      ? 'AIzaSyAV8UHltOdV-JdOB2223cODmULiQTop-iQ'
      : 'AIzaSyBugwvjfiPnh-9EK_sMH_AwV4pVHL0Nvj4',
  projectId: 'mecarvirush',
  storageBucket: 'mecarvirush.firebasestorage.app',
  messagingSenderId: '429796383185',
  appId:
    Platform.OS === 'ios'
      ? '1:429796383185:ios:9b333b35d2b5dc511428f0'
      : '1:429796383185:android:5e422ffb88850d1d1428f0',
};

// Initialize Firebase only if not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: AsyncStorage,
});

// Initialize Messaging (optional, ensures module is loaded)
messaging();

export {app, db, auth};
