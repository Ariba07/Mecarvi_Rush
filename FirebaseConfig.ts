import {initializeApp, getApps, getApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage'; // Import Firebase Storage
import {Platform} from 'react-native';
// Remove unused import if you're not setting up messaging here
// import '@react-native-firebase/messaging';

const firebaseConfig = {
  apiKey:
    Platform.OS === 'ios'
      ? 'AIzaSyAV8UHltOdV-JdOB2223cODmULiQTop-iQ'
      : 'AIzaSyBugwvjfiPnh-9EK_sMH_AwV4pVHL0Nvj4',
  authDomain: 'mecarvi-rush.firebaseapp.com',
  projectId: 'mecarvirush',
  storageBucket: 'mecarvirush.firebasestorage.app',
  messagingSenderId: '429796383185',
  appId:
    Platform.OS === 'ios'
      ? '1:429796383185:ios:9b333b35d2b5dc511428f0'
      : '1:429796383185:android:5e422ffb88850d1d1428f0',
};

// Initialize Firebase only if it’s not already initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firebase Storage
const storage = getStorage(app);

export {app, db, auth, storage};
