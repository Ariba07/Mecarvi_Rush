import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiHelper} from '../apiHelper/ApiHelper';

const FCM_TOKEN_KEY = '@fcm_token';

// Function to request notification permissions (required for iOS)
async function requestNotificationPermission(): Promise<boolean> {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission granted.');
  } else {
    console.log('Notification permission denied.');
  }

  return enabled;
}

// Function to get and send the FCM token to the backend
async function sendFCMTokenToBackend(): Promise<void> {
  try {
    // Request permission (iOS requires this)
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      console.warn(
        'Cannot get FCM token: Notification permission not granted.',
      );
      return;
    }

    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the FCM token
    const token = await messaging().getToken();
    console.log('FCM Token:', token);

    // Check if the token has changed
    const storedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);
    if (storedToken === token) {
      console.log('FCM token unchanged, skipping backend update.');
      return;
    }

    // Send the token to the backend using form-data
    const formData = new FormData();
    formData.append('device_token', token);

    await apiHelper({
      method: 'POST',
      endpoint: 'devices/register',
      data: formData,
    });
    console.log('FCM token sent to backend successfully:', token);

    // Store the token locally
    await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error sending FCM token to backend:', error);
    throw error; // Re-throw the error to be caught in the calling function
  }
}

// Function to handle token refresh and send the new token to the backend
function setupTokenRefreshListener(): () => void {
  return messaging().onTokenRefresh(async (newToken: string) => {
    console.log('FCM Token refreshed:', newToken);
    const storedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);
    if (storedToken === newToken) {
      console.log('Refreshed FCM token unchanged, skipping backend update.');
      return;
    }

    const formData = new FormData();
    formData.append('device_token', newToken);

    try {
      await apiHelper({
        method: 'POST',
        endpoint: 'devices/register',
        data: formData,
      });
      console.log(
        'Refreshed FCM token sent to backend successfully:',
        newToken,
      );
      await AsyncStorage.setItem(FCM_TOKEN_KEY, newToken);
    } catch (error) {
      console.error('Error sending refreshed FCM token to backend:', error);
    }
  });
}

// Main function to initialize FCM token management
export function initializeFCM(): () => void {
  // Get and send the initial token
  sendFCMTokenToBackend();

  // Set up the token refresh listener
  const unsubscribe = setupTokenRefreshListener();

  return unsubscribe;
}

// Function to clear the stored FCM token (e.g., on logout)
export async function clearFCMToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(FCM_TOKEN_KEY);
    console.log('Stored FCM token cleared.');
  } catch (error) {
    console.error('Error clearing FCM token:', error);
  }
}
