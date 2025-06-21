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
import {Dispatch} from 'redux';
import {setNotifyUuid} from '../../../slice/Slice';

const FCM_TOKEN_KEY = '@fcm_token';
const TOKEN_KEY = 'userToken';

// Function to check if the user is logged in
async function isUserLoggedIn(): Promise<boolean> {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  console.log('isUserLoggedIn: Token exists:', !!token);
  return !!token;
}

// Function to request notification permissions
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
  try {
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
    console.log('FCM token registered on backend:', token);

    if (isChecked) {
      await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
      console.log('FCM token stored in AsyncStorage.');
    }
  } catch (error: any) {
    // Handle duplicate token error specifically
    if (error?.response?.data?.message?.includes('Duplicate entry')) {
      console.log(
        'FCM token already exists on backend, skipping registration.',
      );
      if (isChecked) {
        await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
        console.log('FCM token stored in AsyncStorage despite duplicate.');
      }
    } else {
      console.warn(
        'Error sending FCM token to backend:',
        JSON.stringify(error, null, 2),
      );
      throw error;
    }
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
    await messaging.registerDeviceForRemoteMessages();

    const token = await getToken(messaging);
    console.log('FCM Token:', token);

    await sendTokenToBackend(token, isChecked);
  } catch (error) {
    console.warn('Error sending FCM token to backend:', error);
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
      console.warn('Error sending refreshed FCM token to backend:', error);
    }
  });
}

// Handle notification processing
async function handleNotification(
  remoteMessage: any,
  navigation: any,
  dispatch: Dispatch,
) {
  try {
    console.log('handleNotification: Starting processing');

    if (!navigation) {
      console.warn('handleNotification: Navigation object is not available');
      return;
    }

    const loggedIn = await isUserLoggedIn();
    if (!loggedIn) {
      console.warn(
        'handleNotification: User is not logged in, skipping notification handling',
      );
      return;
    }

    console.log(
      'handleNotification: Full remoteMessage:',
      JSON.stringify(remoteMessage, null, 2),
    );

    const data = remoteMessage?.data;
    if (!data) {
      console.warn(
        'handleNotification: No data field in remoteMessage:',
        remoteMessage,
      );
      dispatch(setNotifyUuid(''));
      return;
    }

    console.log(
      'handleNotification: Notification data:',
      JSON.stringify(data, null, 2),
    );

    console.log('handleNotification: Data type:', typeof data);
    console.log('handleNotification: Data keys:', Object.keys(data));

    let uuid: string | null = null;

    if (data.quote_request_uuid) {
      uuid = data.quote_request_uuid;
    } else if (data.quote_uuid) {
      uuid = data.quote_uuid;
    } else if (data.uuid) {
      uuid = data.uuid;
    } else if (data.order_uuid) {
      uuid = data.order_uuid;
    }

    if (!uuid && typeof data === 'string') {
      try {
        const parsedData = JSON.parse(data);
        uuid =
          parsedData.quote_request_uuid ||
          parsedData.quote_uuid ||
          parsedData.uuid ||
          parsedData.order_uuid ||
          null;

        console.log('handleNotification: Parsed data:', parsedData);
      } catch (e) {
        console.warn('handleNotification: Failed to parse data as JSON:', e);
      }
    }

    console.log('handleNotification: Extracted UUID:', uuid);

    if (uuid) {
      dispatch(setNotifyUuid(uuid));
      console.log('handleNotification: UUID dispatched to Redux store:', uuid);
    } else {
      console.warn('handleNotification: No UUID found in notification data');
      dispatch(setNotifyUuid(''));
    }

    let targetScreen = 'Notification';
    if (data.tag && navigation.getState()?.routeNames.includes(data.tag)) {
      targetScreen = data.tag;
    } else if (data.tag) {
      console.warn(
        `handleNotification: Invalid navigation route: ${data.tag}, falling back to Notification`,
      );
    }

    console.log(
      `handleNotification: Navigating to ${targetScreen} with UUID: ${uuid}`,
    );
    navigation.navigate(targetScreen, {quote_request_uuid: uuid});
  } catch (error) {
    console.warn('handleNotification: Error processing notification:', error);
  }
}

// Main function to initialize FCM
export function initializeFCM(
  isChecked: boolean,
  navigation: any,
  dispatch: Dispatch,
): () => void {
  const messaging = getMessaging();

  sendFCMTokenToBackend(isChecked).catch(error => {
    console.warn('initializeFCM: Initial FCM token setup failed:', error);
  });

  let unsubscribeForeground: () => void = () => {};
  let unsubscribeBackground: () => void = () => {};
  let unsubscribeQuit: () => void = () => {};

  if (navigation) {
    unsubscribeForeground = onMessage(messaging, async remoteMessage => {
      console.log(
        'initializeFCM: Foreground message received:',
        JSON.stringify(remoteMessage, null, 2),
      );
      await handleNotification(remoteMessage, navigation, dispatch);
    });

    unsubscribeBackground = messaging.onNotificationOpenedApp(
      async remoteMessage => {
        console.log(
          'initializeFCM: Background message received:',
          JSON.stringify(remoteMessage, null, 2),
        );
        await handleNotification(remoteMessage, navigation, dispatch);
      },
    );

    messaging
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log(
            'initializeFCM: App opened from quit state:',
            JSON.stringify(remoteMessage, null, 2),
          );
          await handleNotification(remoteMessage, navigation, dispatch);
        }
      })
      .catch(error => {
        console.warn(
          'initializeFCM: Error checking initial notification:',
          error,
        );
      });
  } else {
    console.warn('initializeFCM: Navigation object not provided');
  }

  const unsubscribeRefresh = setupTokenRefreshListener(isChecked);

  return () => {
    unsubscribeForeground();
    unsubscribeBackground();
    unsubscribeQuit();
    unsubscribeRefresh();
    console.log('initializeFCM: FCM listeners unsubscribed');
  };
}

// Function to clear the stored FCM token (e.g., on logout)
export async function clearFCMToken(): Promise<void> {
  try {
    const messaging = getMessaging();
    const token = await AsyncStorage.getItem(FCM_TOKEN_KEY);
    if (token) {
      // Notify backend to remove the token
      await apiHelper({
        method: 'DELETE',
        endpoint: `devices/delete?device_token=${encodeURIComponent(token)}`,
      });
      console.log('FCM token removed from backend.');
    }
    await deleteToken(messaging);
    await AsyncStorage.removeItem(FCM_TOKEN_KEY);
    console.log(
      'clearFCMToken: FCM token deleted from Firebase and cleared from AsyncStorage.',
    );
  } catch (error) {
    console.warn('clearFCMToken: Error clearing FCM token:', error);
  }
}
