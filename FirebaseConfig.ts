import {initializeApp, getApps, getApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {Platform} from 'react-native';

const firebaseConfig = {
  apiKey:
    Platform.OS === 'ios'
      ? 'AIzaSyCdKPMj7q6FFWjId7F9irNalCXc3lbNHIY' // iOS API Key
      : 'AIzaSyCyTh8-6lpIsZCjRV3NXtC--wgcQJ2JyWY', // Android API Key
  authDomain: 'mecarvi-rush.firebaseapp.com',
  projectId: 'mecarvi-rush',
  storageBucket: 'mecarvi-rush.firebasestorage.app',
  messagingSenderId: '334376253693',
  appId:
    Platform.OS === 'ios'
      ? '1:334376253693:ios:c6f1a2c2843e86036fe694' // iOS App ID
      : '1:334376253693:android:c5c9dbcae6e5b7846fe694', // Android App ID
};

// Initialize Firebase only if it’s not already initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export {app, db};
