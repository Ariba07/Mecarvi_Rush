import messaging from '@react-native-firebase/messaging';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/screenTypes/ScreenTypes';

// Define navigation prop type
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Message'>;

// Request notification permissions for both Android and iOS
async function requestNotificationPermission(): Promise<boolean> {
  try {
    // Request permission using Notifee (covers both Android and iOS)
    await notifee.requestPermission();
    console.log('Notification permission granted.');

    // Additionally, request FCM permission (mainly for iOS)
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('FCM permission granted.');
    } else {
      console.log('FCM permission denied.');
    }

    return enabled;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

// Create a notification channel for Android
async function createNotificationChannel(): Promise<void> {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  await notifee.createChannel({
    id: 'chat',
    name: 'Chat Notifications',
    importance: AndroidImportance.HIGH,
  });

  await notifee.createChannel({
    id: 'alert',
    name: 'Alert Notifications',
    importance: AndroidImportance.HIGH,
  });
}

// Display a notification based on its type
async function displayNotification(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): Promise<void> {
  const {notification, data} = remoteMessage;
  const notificationType = data?.type || 'default';

  let channelId = 'default';
  let title = notification?.title || 'Notification';
  let body = notification?.body || 'You have a new notification!';

  switch (notificationType) {
    case 'chat':
      channelId = 'chat';
      title = notification?.title || 'New Message';
      body = notification?.body || 'You have a new message!';
      break;
    case 'alert':
      channelId = 'alert';
      title = notification?.title || 'Alert';
      body = notification?.body || 'Important alert!';
      break;
    default:
      channelId = 'default';
      break;
  }

  await notifee.displayNotification({
    title,
    body,
    data,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      sound: 'default',
    },
  });
}

// Function to trigger a test notification
async function triggerTestNotification(): Promise<void> {
  // Request permission before triggering the test notification
  const permissionGranted = await requestNotificationPermission();
  if (!permissionGranted) {
    console.warn('Cannot trigger test notification: Permission not granted.');
    return;
  }

  const testMessage: FirebaseMessagingTypes.RemoteMessage = {
    notification: {
      title: 'Test Notification',
      body: 'This is a test notification to verify setup!',
    },
    data: {
      type: 'default',
    },
    fcmOptions: {
      analyticsLabel: 'test_notification',
    },
  };

  console.log('Triggering test notification...');
  await displayNotification(testMessage);
}

// Handle notifications when the app is in the foreground
function setupForegroundNotificationListener(): void {
  messaging().onMessage(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('Foreground notification received:', remoteMessage);
      await displayNotification(remoteMessage);
    },
  );
}

// Handle notifications when the app is in the background or quit
function setupBackgroundNotificationListener(): void {
  messaging().setBackgroundMessageHandler(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('Background notification received:', remoteMessage);
      await displayNotification(remoteMessage);
    },
  );
}

// Handle notification interactions (e.g., when the user taps the notification)
function setupNotificationInteractionListener(
  navigation: NavigationProp,
): void {
  notifee.onForegroundEvent(({type, detail}) => {
    if (type === EventType.PRESS) {
      console.log('Notification pressed:', detail.notification);
      const notificationType = detail.notification?.data?.type;

      switch (notificationType) {
        case 'chat':
          const chatId = detail.notification?.data?.chatId as string;
          const chatName = detail.notification?.data?.chatName as string;
          if (chatId && chatName) {
            navigation.navigate('Message', {chatId, chatName});
          }
          break;
        case 'alert':
          navigation.navigate('Chats'); // Adjust the screen name as needed
          break;
        default:
          navigation.navigate('Services'); // Adjust the screen name as needed
          break;
      }
    }
  });
}

// Main function to initialize notification handling and trigger a test notification
export function initializeNotifications(navigation: NavigationProp): void {
  // Create notification channels (Android)
  createNotificationChannel();

  // Set up listeners
  setupForegroundNotificationListener();
  setupBackgroundNotificationListener();
  setupNotificationInteractionListener(navigation);

  // Trigger a test notification immediately
  triggerTestNotification();
}
