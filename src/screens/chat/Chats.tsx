import React, {useState, useEffect, useContext} from 'react';
import {View, SafeAreaView, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  Chat,
  Message,
  RootStackParamList,
} from '../../types/navigation';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
} from '@react-native-firebase/firestore';
import {db, auth} from '../../services/firebase';
import Header from '../../components/common/header/Header';
import {ThemeContext} from '../../context/ThemeContext';
import {useSelector, useDispatch} from 'react-redux';
import {selectUserUuidId} from '../../store/authSlice';
import ChatList from './ChatList';
import ErrorDisplay from './ErrorDisplay';
import {styles} from '../../assets/styles/chats/ChatsStyles';

const Chats: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const dispatch = useDispatch();
  const currentUserUuid = useSelector(selectUserUuidId);

  useEffect(() => {
    let unsubscribeAuth: () => void;
    let unsubscribeChats: () => void;
    let messageUnsubscribers: (() => void)[] = [];

    const setupChatsListener = (userUuid: string) => {
      if (!userUuid) {
        setErrorMessage('Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const chatsRef = collection(db, 'chats');
        const q = query(
          chatsRef,
          where('participants', 'array-contains', userUuid),
        );
        unsubscribeChats = onSnapshot(
          q,
          snapshot => {
            if (snapshot.empty) {
              setChats([]);
              setLoading(false);
              return;
            }

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

            messageUnsubscribers.forEach(unsub => unsub());
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
                const messageUnsubscribe = onSnapshot(
                  messagesQuery,
                  messagesSnapshot => {
                    const lastMessageData = messagesSnapshot.docs[0]?.data() as
                      | Message
                      | undefined;
                    const lastMessage = lastMessageData
                      ? {
                          ...lastMessageData,
                          // Normalize text/message fields
                          text:
                            lastMessageData.text ||
                            lastMessageData.message ||
                            '',
                        }
                      : undefined;
                    setChats(prevChats => {
                      const updatedChats = prevChats.map(c =>
                        c.id === chat.id ? {...c, lastMessage} : c,
                      );
                      return [...updatedChats];
                    });
                  },
                  error => {
                    console.warn('Messages Error:', error.message);
                  },
                );
                messageUnsubscribers.push(messageUnsubscribe);
              } catch (error: any) {
                console.warn('Messages Setup Error:', error.message);
              }
            });

            setLoading(false);
            setErrorMessage(null);
          },
          error => {
            setErrorMessage(getUserFriendlyMessage(error));
            setLoading(false);
          },
        );
      } catch (error: any) {
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
          return 'An error occurred. Please try again.';
      }
    };

    unsubscribeAuth = auth.onAuthStateChanged(user => {
      try {
        if (user) {
          if (user.uid !== currentUserUuid && currentUserUuid) {
            setErrorMessage('Session error. Please log in again.');
            navigation.navigate('Login');
            setLoading(false);
          } else {
            setupChatsListener(user.uid);
          }
        } else {
          setErrorMessage('Please log in to view chats.');
          navigation.navigate('Login');
          setLoading(false);
        }
      } catch (error: any) {
        setErrorMessage('Unable to verify session. Please log in again.');
        navigation.navigate('Login');
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribeChats) {
        unsubscribeChats();
      }
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }
      messageUnsubscribers.forEach(unsub => unsub());
    };
  }, [currentUserUuid, navigation, dispatch]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
        <View style={styles.container}>
          <Header title="Messages" onBackPress={() => navigation.goBack()} />
          <ActivityIndicator size="large" color={theme.text} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header title="Messages" onBackPress={() => navigation.goBack()} />
        <ErrorDisplay errorMessage={errorMessage} chatsLength={chats.length} />
        {chats.length > 0 && (
          <ChatList chats={chats} currentUserUuid={currentUserUuid} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Chats;
