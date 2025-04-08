import {
  getMessaging,
  onMessage,
  getToken,
  onTokenRefresh,
  AuthorizationStatus,
  deleteToken,
} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiHelper} from '../apiHelper/ApiHelper';
import {Dispatch} from 'redux'; // Import Dispatch type
import {setNotifyUuid} from '../../../slice/Slice';

const FCM_TOKEN_KEY = '@fcm_token';
const TOKEN_KEY = 'userToken';

// Function to check if the user is logged in
async function isUserLoggedIn(): Promise<boolean> {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return !!token; // Returns true if token exists, false otherwise
}

// Function to request notification permissions (required for iOS, optional for Android < 13)
async function requestNotificationPermission(): Promise<boolean> {
  const messaging = getMessaging();
  const authStatus = await messaging.requestPermission();
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  console.log(
    enabled
      ? 'Notification permission granted.'
      : 'Notification permission denied.',
  );
  return enabled;
}

// Function to send FCM token to backend and store it if needed
async function sendTokenToBackend(
  token: string,
  isChecked: boolean,
): Promise<void> {
  const storedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);
  if (storedToken === token) {
    console.log('FCM token unchanged, skipping backend update.');
    return;
  }

  const formData = new FormData();
  formData.append('device_token', token);

  await apiHelper({
    method: 'POST',
    endpoint: 'devices/register',
    data: formData,
  });
  console.log('FCM token sent to backend successfully:', token);

  // Only store the token in AsyncStorage if "Remember me" is checked
  if (isChecked) {
    await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
    console.log('FCM token stored in AsyncStorage.');
  }
}

// Function to get and send the FCM token to the backend
async function sendFCMTokenToBackend(isChecked: boolean): Promise<void> {
  try {
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      console.warn(
        'Cannot get FCM token: Notification permission not granted.',
      );
      return;
    }

    const messaging = getMessaging();
    await messaging.registerDeviceForRemoteMessages(); // iOS-specific, harmless on Android

    const token = await getToken(messaging);
    console.log('FCM Token:', token);

    await sendTokenToBackend(token, isChecked);
  } catch (error) {
    console.error('Error sending FCM token to backend:', error);
    throw error;
  }
}

// Function to handle token refresh and send the new token to the backend
function setupTokenRefreshListener(isChecked: boolean): () => void {
  const messaging = getMessaging();
  return onTokenRefresh(messaging, async (newToken: string) => {
    console.log('FCM Token refreshed:', newToken);
    try {
      await sendTokenToBackend(newToken, isChecked);
    } catch (error) {
      console.error('Error sending refreshed FCM token to backend:', error);
    }
  });
}

// Function to handle navigation and log UUID from notification
async function handleNotification(
  remoteMessage: any,
  navigation: any,
  dispatch: Dispatch, // Add dispatch parameter
) {
  if (!navigation) {
    console.error('Navigation object is not available');
    return;
  }

  // Only handle notifications if the user is logged in
  const loggedIn = await isUserLoggedIn();
  if (!loggedIn) {
    console.log('User is not logged in, skipping notification handling.');
    return;
  }

  const {data} = remoteMessage;
  const uuid = data?.uuid || data?.quote_uuid || null; // Support both 'uuid' and 'quote_uuid'
  console.log('Extracted UUID:', uuid);

  // Dispatch the UUID to Redux store
  if (uuid) {
    dispatch(setNotifyUuid(uuid));
    console.log('UUID dispatched to Redux store:', uuid);
  } else {
    console.log('No UUID found, cleared UUID in Redux store');
  }

  try {
    let targetScreen = 'Notification'; // Default screen
    if (data?.tag) {
      targetScreen = data.tag; // Use tag as screen if it matches a route
    }

    console.log(`Navigating to ${targetScreen} with UUID: ${uuid}`);
    navigation.navigate(targetScreen);
  } catch (error) {
    console.error('Error during navigation:', error);
  }
}

// Main function to initialize FCM with navigation and dispatch
export function initializeFCM(
  isChecked: boolean,
  navigation: any,
  dispatch: Dispatch, // Add dispatch parameter
): () => void {
  const messaging = getMessaging();

  // Get and send the initial token
  sendFCMTokenToBackend(isChecked).catch(error => {
    console.error('Initial FCM token setup failed:', error);
  });

  // Only set up notification listeners if navigation is provided
  let unsubscribeForeground: () => void = () => {};
  let unsubscribeBackground: () => void = () => {};

  if (navigation) {
    // Foreground message handler
    unsubscribeForeground = onMessage(messaging, async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);
      await handleNotification(remoteMessage, navigation, dispatch);
    });

    // Background handler (when app is opened from notification)
    unsubscribeBackground = messaging.onNotificationOpenedApp(
      async remoteMessage => {
        console.log('Notification opened app from background:', remoteMessage);
        await handleNotification(remoteMessage, navigation, dispatch);
      },
    );

    // Quit state handler (app opened from notification when closed)
    // Note: You commented this out, but if you want to re-enable it, you can uncomment and update it
    // messaging
    //   .getInitialNotification()
    //   .then(async remoteMessage => {
    //     if (remoteMessage) {
    //       console.log('App opened from quit state:', remoteMessage);
    //       await handleNotification(remoteMessage, navigation, dispatch);
    //     }
    //   })
    //   .catch(error => {
    //     console.error('Error checking initial notification:', error);
    //   });
  } else {
    console.warn('Navigation object not provided to initializeFCM');
  }

  // Token refresh listener
  const unsubscribeRefresh = setupTokenRefreshListener(isChecked);

  // Return cleanup function
  return () => {
    unsubscribeForeground();
    unsubscribeBackground();
    unsubscribeRefresh();
    console.log('FCM listeners unsubscribed');
  };
}

// Function to clear the stored FCM token (e.g., on logout)
export async function clearFCMToken(): Promise<void> {
  try {
    const messaging = getMessaging();
    await deleteToken(messaging);
    await AsyncStorage.removeItem(FCM_TOKEN_KEY);
    console.log(
      'FCM token deleted from Firebase and cleared from AsyncStorage.',
    );
  } catch (error) {
    console.error('Error clearing FCM token:', error);
  }
}
