import {
  getMessaging,
  onMessage,
  getToken,
  onTokenRefresh,
  AuthorizationStatus,
  deleteToken,
} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiHelper} from '@/services/api';
import {Dispatch} from 'redux';
import {setNotifyUuid} from '@/store/authSlice';

const FCM_TOKEN_KEY = '@fcm_token';
const TOKEN_KEY = 'userToken';

async function isUserLoggedIn(): Promise<boolean> {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return !!token;
}

async function requestNotificationPermission(): Promise<boolean> {
  const messaging = getMessaging();
  const authStatus = await messaging.requestPermission();
  return (
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL
  );
}

async function sendTokenToBackend(
  token: string,
  isChecked: boolean,
): Promise<void> {
  try {
    const storedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);
    if (storedToken === token) {
      return;
    }

    const formData = new FormData();
    formData.append('device_token', token);

    await apiHelper({
      method: 'POST',
      endpoint: 'devices/register',
      data: formData,
    });

    if (isChecked) {
      await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
    }
  } catch (error: any) {
    if (error?.response?.data?.message?.includes('Duplicate entry')) {
      if (isChecked) {
        await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
      }
    } else {
      console.warn('Error sending FCM token to backend:', error);
      throw error;
    }
  }
}

async function sendFCMTokenToBackend(isChecked: boolean): Promise<void> {
  try {
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      return;
    }

    const messaging = getMessaging();
    await messaging.registerDeviceForRemoteMessages();

    const token = await getToken(messaging);
    await sendTokenToBackend(token, isChecked);
  } catch (error) {
    console.warn('Error sending FCM token to backend:', error);
    throw error;
  }
}

function setupTokenRefreshListener(isChecked: boolean): () => void {
  const messaging = getMessaging();
  return onTokenRefresh(messaging, async (newToken: string) => {
    try {
      await sendTokenToBackend(newToken, isChecked);
    } catch (error) {
      console.warn('Error sending refreshed FCM token to backend:', error);
    }
  });
}

async function handleNotification(
  remoteMessage: any,
  navigation: any,
  dispatch: Dispatch,
) {
  try {
    if (!navigation) {
      return;
    }

    const loggedIn = await isUserLoggedIn();
    if (!loggedIn) {
      return;
    }

    const data = remoteMessage?.data;
    if (!data) {
      dispatch(setNotifyUuid(''));
      return;
    }

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
      } catch (e) {
        console.warn('Failed to parse notification data as JSON:', e);
      }
    }

    dispatch(setNotifyUuid(uuid ?? ''));

    let targetScreen = 'Notification';
    if (data.tag && navigation.getState()?.routeNames.includes(data.tag)) {
      targetScreen = data.tag;
    }

    navigation.navigate(targetScreen, {quote_request_uuid: uuid});
  } catch (error) {
    console.warn('Error processing notification:', error);
  }
}

export function initializeFCM(
  isChecked: boolean,
  navigation: any,
  dispatch: Dispatch,
): () => void {
  const messaging = getMessaging();

  sendFCMTokenToBackend(isChecked).catch(error => {
    console.warn('Initial FCM token setup failed:', error);
  });

  let unsubscribeForeground: () => void = () => {};
  let unsubscribeBackground: () => void = () => {};
  const unsubscribeQuit: () => void = () => {};

  if (navigation) {
    unsubscribeForeground = onMessage(messaging, async remoteMessage => {
      await handleNotification(remoteMessage, navigation, dispatch);
    });

    unsubscribeBackground = messaging.onNotificationOpenedApp(
      async remoteMessage => {
        await handleNotification(remoteMessage, navigation, dispatch);
      },
    );

    messaging.getInitialNotification().then(async remoteMessage => {
      if (remoteMessage) {
        await handleNotification(remoteMessage, navigation, dispatch);
      }
    });
  }

  const unsubscribeRefresh = setupTokenRefreshListener(isChecked);

  return () => {
    unsubscribeForeground();
    unsubscribeBackground();
    unsubscribeQuit();
    unsubscribeRefresh();
  };
}

export async function clearFCMToken(): Promise<void> {
  try {
    const messaging = getMessaging();
    const token = await AsyncStorage.getItem(FCM_TOKEN_KEY);
    if (token) {
      await apiHelper({
        method: 'DELETE',
        endpoint: `devices/delete?device_token=${encodeURIComponent(token)}`,
      });
    }
    await deleteToken(messaging);
    await AsyncStorage.removeItem(FCM_TOKEN_KEY);
  } catch (error) {
    console.warn('Error clearing FCM token:', error);
  }
}
