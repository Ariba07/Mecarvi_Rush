import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/types/screenTypes/ScreenTypes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
} from '@react-native-firebase/firestore';
import { db, auth } from '../../../FirebaseConfig';
import Header from '../../components/common/header/Header';
import { ThemeContext } from '../../components/helperUtils/theme/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserUuidId } from '../../slice/Slice';

interface Message {
  text: string;
  sender: string;
  createdAt: any;
}

interface Chat {
  id: string;
  name: string;
  chatId: string;
  participants: string[];
  participantNames: { [uuid: string]: string };
  lastMessage?: Message;
}

const Chats: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const currentUserUuid = useSelector(selectUserUuidId);

  useEffect(() => {
    let unsubscribeAuth: () => void;
    let unsubscribeChats: () => void;
    let messageUnsubscribers: (() => void)[] = [];

    console.log('Firestore db instance:', db);

    const setupChatsListener = (userUuid: string) => {
      if (!userUuid) {
        const error = new Error('Invalid user UUID');
        console.warn('Detailed Error:', {
          message: error.message,
          stack: error.stack,
          code: 'app/invalid-uuid',
          response: 'No response data',
          firestoreError: 'Not a Firestore error',
          timestamp: new Date().toISOString(),
        });
        setErrorMessage('Please log in again.');
        setLoading(false);
        return;
      }

      try {
        if (!db || typeof db.collection !== 'function') {
          throw new Error('Firestore instance is invalid or not initialized');
        }

        console.log('Current User UUID in Chats:', userUuid);
        const chatsRef = collection(db, 'chats');
        const q = query(
          chatsRef,
          where('participants', 'array-contains', userUuid),
        );
        console.log('Step 1: Querying chats for user:', userUuid);

        unsubscribeChats = onSnapshot(
          q,
          async snapshot => {
            try {
              console.log(
                'Step 2: Chats snapshot received, docs count:',
                snapshot.docs.length,
              );
              if (snapshot.empty) {
                console.log('No chats found for user:', userUuid);
                setChats([]);
                setLoading(false);
                return;
              }

              snapshot.docs.forEach(doc => {
                console.log('Chat document:', { id: doc.id, ...doc.data() });
              });

              const chatList: Chat[] = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                  id: doc.id,
                  name: data.name || 'Unnamed Chat',
                  chatId: data.chatId || doc.id,
                  participants: data.participants || [],
                  participantNames: data.participantNames || {},
                  lastMessage: undefined,
                };
              });

              setChats(chatList);
              console.log('Step 3: Initial chats set:', chatList);

              console.log('Step 4: Setting up message listeners...');
              messageUnsubscribers = [];
              chatList.forEach(chat => {
                try {
                  const messagesRef = collection(
                    db,
                    'chats',
                    chat.id,
                    'messages',
                  );
                  const messagesQuery = query(
                    messagesRef,
                    orderBy('createdAt', 'desc'),
                    limit(1),
                  );
                  console.log('Listening for messages in chat:', chat.id);
                  const messageUnsubscribe = onSnapshot(
                    messagesQuery,
                    messagesSnapshot => {
                      console.log(
                        'Messages snapshot for chat',
                        chat.id,
                        'docs count:',
                        messagesSnapshot.docs.length,
                      );
                      const lastMessage = messagesSnapshot.docs[0]?.data() as
                        | Message
                        | undefined;
                      console.log(
                        'Last message for chat',
                        chat.id,
                        ':',
                        lastMessage,
                      );
                      setChats(prevChats => {
                        const updatedChats = prevChats.map(c =>
                          c.id === chat.id ? { ...c, lastMessage } : c,
                        );
                        console.log(
                          'Updated chats with last message:',
                          updatedChats,
                        );
                        return [...updatedChats];
                      });
                    },
                    error => {
                      console.warn('Detailed Messages Error:', {
                        message: error.message || 'Failed to fetch messages',
                        stack: error.stack,
                        code:
                          (error as { code?: string }).code ||
                          'firestore/messages-error',
                        response: 'No response data',
                        firestoreError: {
                          code: (error as { code?: string }).code,
                          message: error.message,
                        },
                        timestamp: new Date().toISOString(),
                      });
                    },
                  );
                  messageUnsubscribers.push(messageUnsubscribe);
                } catch (error: any) {
                  console.warn('Detailed Messages Setup Error:', {
                    message:
                      error.message || 'Failed to set up messages listener',
                    stack: error.stack,
                    code: error.code || 'firestore/messages-setup-error',
                    response: 'No response data',
                    firestoreError: {
                      code: (error as { code?: string }).code,
                      message: error.message,
                    },
                    timestamp: new Date().toISOString(),
                  });
                }
              });

              setLoading(false);
              setErrorMessage(null);
            } catch (error: any) {
              console.warn('Detailed Snapshot Error:', {
                message: error.message || 'Failed to process chats snapshot',
                stack: error.stack,
                code: error.code || 'firestore/snapshot-error',
                response: 'No response data',
                firestoreError: {
                  code: (error as { code?: string }).code,
                  message: error.message,
                },
                timestamp: new Date().toISOString(),
              });
              setErrorMessage('Unable to load chats. Please try again.');
              setLoading(false);
            }
          },
          error => {
            console.warn('Detailed Chats Error:', {
              message: error.message || 'Failed to fetch chats',
              stack: error.stack,
              code: (error as { code?: string }).code || 'firestore/chats-error',
              response: 'No response data',
              firestoreError: {
                code: (error as { code?: string }).code,
                message: error.message,
              },
              timestamp: new Date().toISOString(),
            });
            setErrorMessage(getUserFriendlyMessage(error));
            setLoading(false);
          },
        );
      } catch (error: any) {
        console.warn('Detailed Firestore Setup Error:', {
          message: error.message || 'Failed to set up Firestore query',
          stack: error.stack,
          code: error.code || 'firestore/setup-error',
          response: 'No response data',
          firestoreError: {
            code: error.code,
            message: error.message,
          },
          timestamp: new Date().toISOString(),
        });
        setErrorMessage('Unable to load chats. Please try again later.');
        setLoading(false);
      }
    };

    const getUserFriendlyMessage = (error: any): string => {
      switch (error.code) {
        case 'firestore/permission-denied':
          return 'You don’t have permission to view chats.';
        case 'firestore/unavailable':
          return 'Network error. Please check your connection.';
        case 'firestore/invalid-argument':
          return 'Unable to load chats. Please try again.';
        case 'firestore/not-found':
          return 'No chats available.';
        case 'firestore/resource-exhausted':
          return 'Service limit reached. Please try again later.';
        case 'firestore/unauthenticated':
          return 'Please log in again.';
        case 'auth/no-user':
          return 'Please log in to view chats.';
        case 'auth/uid-mismatch':
          return 'Session error. Please log in again.';
        default:
          return error.message.includes('collection')
            ? 'Unable to load chats. Please try again later.'
            : 'An error occurred. Please try again.';
      }
    };

    unsubscribeAuth = auth.onAuthStateChanged(user => {
      try {
        if (user) {
          console.log('Firebase Auth User UID:', user.uid);
          console.log(
            'Current User UUID (Redux/AsyncStorage):',
            currentUserUuid,
          );
          if (user.uid !== currentUserUuid && currentUserUuid) {
            console.warn('Firebase UID and currentUserUuid do not match');
            console.warn('Detailed Auth Error:', {
              message: 'Firebase UID and currentUserUuid do not match',
              stack: new Error().stack,
              code: 'auth/uid-mismatch',
              response: 'No response data',
              firestoreError: 'Not a Firestore error',
              timestamp: new Date().toISOString(),
            });
            setErrorMessage('Session error. Please log in again.');
            navigation.navigate('Login');
            setLoading(false);
          } else {
            setupChatsListener(user.uid);
          }
        } else {
          console.warn('No Firebase Auth user signed in');
          console.warn('Detailed Auth Error:', {
            message: 'No Firebase Auth user signed in',
            stack: new Error().stack,
            code: 'auth/no-user',
            response: 'No response data',
            firestoreError: 'Not a Firestore error',
            timestamp: new Date().toISOString(),
          });
          setErrorMessage('Please log in to view chats.');
          navigation.navigate('Login');
          setLoading(false);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.warn('Detailed Auth Callback Error:', {
            message: error.message || 'Failed to process auth state',
            stack: error.stack,
            code: 'auth/callback-error',
            response: 'No response data',
            firestoreError: 'Not a Firestore error',
            timestamp: new Date().toISOString(),
          });
        }
        setErrorMessage('Unable to verify session. Please log in again.');
        navigation.navigate('Login');
        setLoading(false);
      }
    });

    return () => {
      console.log('Cleaning up chats listener...');
      if (unsubscribeChats) {
        unsubscribeChats();
      }
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }
      console.log('Cleaning up message listeners...');
      messageUnsubscribers.forEach(unsub => unsub());
    };
  }, [currentUserUuid, navigation, dispatch]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.whole }]}>
        <View style={styles.container}>
          <Header title="Messages" onBackPress={() => navigation.goBack()} />
          <ActivityIndicator size="large" color={theme.text} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.whole }]}>
      <View style={styles.container}>
        <Header title="Messages" onBackPress={() => navigation.goBack()} />
        {errorMessage ? (
          <Text style={[styles.errorText, { color: theme.text }]}>
            {errorMessage}
          </Text>
        ) : chats.length === 0 ? (
          <Text style={[styles.noChatsText, { color: theme.text }]}>
            No chats available
          </Text>
        ) : (
          <FlatList
            data={chats}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const otherParticipant = item.participants.find(
                p => p !== currentUserUuid,
              );
              const otherParticipantName =
                otherParticipant && item.participantNames[otherParticipant]
                  ? item.participantNames[otherParticipant]
                  : 'Unknown';
              const isSender = item.lastMessage?.sender === currentUserUuid;
              return (
                <TouchableOpacity
                  style={[
                    styles.chatItem,
                    { backgroundColor: theme.backgroundColor },
                  ]}
                  onPress={() =>
                    navigation.navigate('Message', {
                      chatId: item.id,
                      chatName: otherParticipantName,
                      participantNames: item.participantNames,
                    })
                  }>
                  <Text style={[styles.chatName, { color: theme.text }]}>
                    {otherParticipantName}
                  </Text>
                  {item.lastMessage ? (
                    <Text style={[styles.lastMessage, { color: theme.text }]}>
                      {isSender
                        ? `You: ${item.lastMessage.text}`
                        : `${otherParticipantName}: ${item.lastMessage.text}`}
                    </Text>
                  ) : (
                    <Text style={[styles.lastMessage, { color: theme.text }]}>
                      No messages yet
                    </Text>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
    paddingBottom: Platform.select({
      ios: hp(4),
      android: hp(8),
    }),
  },
  chatItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 8,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noChatsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
});

export default Chats;
