import React, {useState, useEffect, useContext} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
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
} from 'firebase/firestore';
import {db, auth} from '../../../FirebaseConfig';
import Header from '../../components/common/header/Header';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useSelector, useDispatch} from 'react-redux';
import {selectUserUuidId} from '../../slice/Slice';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Message'>;

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
  lastMessage?: Message;
  otherParticipantName?: string;
}

const Chats: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigation = useNavigation<NavigationProp>();
  const {theme} = useContext(ThemeContext);
  const dispatch = useDispatch();
  const currentUserUuid = useSelector(selectUserUuidId);

  useEffect(() => {
    let unsubscribeAuth: () => void;
    let unsubscribeChats: () => void;
    let messageUnsubscribers: (() => void)[] = [];

    const setupChatsListener = (userUuid: string) => {
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

          // Log all chat documents for debugging
          snapshot.docs.forEach(doc => {
            console.log('Chat document:', {id: doc.id, ...doc.data()});
          });

          const chatList: Chat[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              chatId: data.chatId,
              participants: data.participants,
              lastMessage: undefined,
              otherParticipantName: undefined,
            };
          });

          console.log('Step 3: Fetching participant names...');
          const chatListWithNames = await Promise.all(
            chatList.map(async chat => {
              const otherParticipant = chat.participants.find(
                p => p !== userUuid,
              );
              if (otherParticipant) {
                try {
                  console.log(
                    'Fetching name for participant:',
                    otherParticipant,
                  );
                  const response = await apiHelper({
                    method: 'GET',
                    endpoint: `service-provider/${otherParticipant}`,
                  });
                  const apiData = (response as {data: any}).data;
                  console.log(
                    'Participant name fetched:',
                    apiData.service_provider_name,
                  );
                  return {
                    ...chat,
                    otherParticipantName:
                      apiData.service_provider_name || 'Unknown',
                  };
                } catch (error) {
                  console.error(
                    `Error fetching name for ${otherParticipant}:`,
                    error,
                  );
                  return {...chat, otherParticipantName: 'Unknown'};
                }
              }
              return chat;
            }),
          );

          // Set the initial chats with names
          setChats(chatListWithNames);
          console.log('Step 4: Initial chats set:', chatListWithNames);

          // Set up a listener for each chat's messages
          console.log('Step 5: Setting up message listeners...');
          messageUnsubscribers = [];
          chatListWithNames.forEach(chat => {
            const messagesRef = collection(db, 'chats', chat.id, 'messages');
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
                console.log('Last message for chat', chat.id, ':', lastMessage);
                setChats(prevChats => {
                  const updatedChats = prevChats.map(c =>
                    c.id === chat.id ? {...c, lastMessage} : c,
                  );
                  console.log('Updated chats with last message:', updatedChats);
                  return [...updatedChats];
                });
              },
              error => {
                console.error(
                  `Error fetching messages for chat ${chat.id}:`,
                  error,
                );
              },
            );
            messageUnsubscribers.push(messageUnsubscribe);
          });

          setLoading(false);
        },
        error => {
          console.error('Error fetching chats:', error);
          setLoading(false);
        },
      );
    };

    // Step 1: Sync currentUserUuid with Firebase Auth UID
    unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        console.log('Firebase Auth User UID:', user.uid);
        console.log('Current User UUID (Redux/AsyncStorage):', currentUserUuid);
        if (user.uid !== currentUserUuid) {
          console.warn(
            'Firebase UID and currentUserUuid do not match! Syncing...',
          );
        } else {
          // If they match, set up the listener immediately
          setupChatsListener(user.uid);
        }
      } else {
        console.warn('No Firebase Auth user signed in');
        navigation.navigate('Login');
        setLoading(false);
      }
    });

    // Step 2: If currentUserUuid changes (e.g., after sync), set up the listener
    if (currentUserUuid) {
      setupChatsListener(currentUserUuid);
    }

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
        {chats.length === 0 && (
          <Text style={[styles.noChatsText, {color: theme.text}]}>
            No chats available
          </Text>
        )}
        <FlatList
          data={chats}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            const isSender = item.lastMessage?.sender === currentUserUuid;
            return (
              <TouchableOpacity
                style={[
                  styles.chatItem,
                  {backgroundColor: theme.backgroundColor},
                ]}
                onPress={() =>
                  navigation.navigate('Message', {
                    chatId: item.id,
                    chatName: item.otherParticipantName || item.name,
                  })
                }>
                <Text style={[styles.chatName, {color: theme.text}]}>
                  {item.otherParticipantName || item.name}
                </Text>
                {item.lastMessage ? (
                  <Text style={[styles.lastMessage, {color: theme.text}]}>
                    {isSender
                      ? `You: ${item.lastMessage.text}`
                      : `${item.lastMessage.text}`}
                  </Text>
                ) : (
                  <Text style={[styles.lastMessage, {color: theme.text}]}>
                    No messages yet
                  </Text>
                )}
              </TouchableOpacity>
            );
          }}
        />
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
});

export default Chats;
