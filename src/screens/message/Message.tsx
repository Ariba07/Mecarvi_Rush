import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  collection,
  orderBy,
  query,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {db, auth} from '../../../FirebaseConfig';
import {useSelector} from 'react-redux';
import {selectUserUuidId} from '../../slice/Slice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

type MessagesRouteProp = RouteProp<RootStackParamList, 'Message'>;

interface Message {
  id: string;
  text: string;
  createdAt: any;
  sender: string;
}

const MessageScreen: React.FC = () => {
  const route = useRoute<MessagesRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {chatId, chatName, participantNames = {}} = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const currentUserUuid = useSelector(selectUserUuidId);
  const {theme} = useContext(ThemeContext);

  useEffect(() => {
    let unsubscribeAuth: () => void;
    let unsubscribeMessages: () => void;

    console.log('Firestore db instance:', db);

    unsubscribeAuth = auth.onAuthStateChanged(user => {
      try {
        if (user) {
          console.log('Firebase Auth User UID in MessageScreen:', user.uid);
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
          setErrorMessage('Please log in to view messages.');
          navigation.navigate('Login');
        }
      } catch (error: any) {
        console.warn('Detailed Auth Callback Error:', {
          message: error.message || 'Failed to process auth state',
          stack: error.stack,
          code: error.code || 'auth/callback-error',
          response: 'No response data',
          firestoreError: 'Not a Firestore error',
          timestamp: new Date().toISOString(),
        });
        setErrorMessage('Unable to verify session. Please log in again.');
        navigation.navigate('Login');
      }
    });

    if (!chatId) {
      const error = new Error('No chatId provided');
      console.warn('Detailed Error:', {
        message: error.message,
        stack: error.stack,
        code: 'app/no-chat-id',
        response: 'No response data',
        firestoreError: 'Not a Firestore error',
        timestamp: new Date().toISOString(),
      });
      setErrorMessage('Invalid chat. Please try again.');
      return;
    }

    if (!currentUserUuid) {
      const error = new Error('No currentUserUuid available');
      console.warn('Detailed Error:', {
        message: error.message,
        stack: error.stack,
        code: 'app/no-user-uuid',
        response: 'No response data',
        firestoreError: 'Not a Firestore error',
        timestamp: new Date().toISOString(),
      });
      setErrorMessage('Please log in to view messages.');
      return;
    }

    try {
      if (!db || typeof db.collection !== 'function') {
        throw new Error('Firestore instance is invalid or not initialized');
      }

      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'desc'));

      unsubscribeMessages = onSnapshot(
        q,
        snapshot => {
          try {
            const fetchedMessages: Message[] = snapshot.docs.map(
              messageDoc => ({
                id: messageDoc.id,
                text: messageDoc.data().text || '',
                sender: messageDoc.data().sender || 'unknown',
                createdAt: messageDoc.data().createdAt || serverTimestamp(),
              }),
            );
            setMessages(fetchedMessages);
            console.log(
              'Messages fetched for chatId:',
              chatId,
              fetchedMessages,
            );
            setErrorMessage(null);
          } catch (error: any) {
            console.warn('Detailed Snapshot Error:', {
              message: error.message || 'Failed to process messages snapshot',
              stack: error.stack,
              code: error.code || 'firestore/snapshot-error',
              response: 'No response data',
              firestoreError: {
                code: error.code,
                message: error.message,
              },
              timestamp: new Date().toISOString(),
            });
            setErrorMessage('Unable to load messages. Please try again.');
          }
        },
        (error: any) => {
          console.warn('Detailed Messages Error:', {
            message: error.message || 'Failed to fetch messages',
            stack: error.stack,
            code: error.code || 'firestore/messages-error',
            response: 'No response data',
            firestoreError: {
              code: error.code,
              message: error.message,
            },
            timestamp: new Date().toISOString(),
          });
          setErrorMessage(getUserFriendlyMessage(error));
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
      setErrorMessage('Unable to load messages. Please try again later.');
    }

    return () => {
      console.log('Cleaning up messages listener...');
      if (unsubscribeMessages) {
        unsubscribeMessages();
      }
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }
    };
  }, [chatId, currentUserUuid, navigation]);

  const sendMessage = async () => {
    if (!text.trim()) {
      console.warn('Message text is empty');
      return;
    }

    if (!currentUserUuid) {
      console.warn('No currentUserUuid available to send message');
      setErrorMessage('Please log in to send messages.');
      return;
    }

    if (!chatId) {
      console.warn('No chatId available to send message');
      setErrorMessage('Invalid chat. Please try again.');
      return;
    }

    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        text: text.trim(),
        sender: currentUserUuid,
        createdAt: serverTimestamp(),
      });
      console.log('Message sent by:', currentUserUuid, 'Text:', text);
      setText('');
      setErrorMessage(null);
    } catch (error: any) {
      console.warn('Detailed Send Message Error:', {
        message: error.message || 'Failed to send message',
        stack: error.stack,
        code: error.code || 'firestore/send-error',
        response: 'No response data',
        firestoreError: {
          code: error.code,
          message: error.message,
        },
        timestamp: new Date().toISOString(),
      });
      setErrorMessage(getUserFriendlyMessage(error));
    }
  };

  const getUserFriendlyMessage = (error: any): string => {
    switch (error.code) {
      case 'firestore/permission-denied':
        return 'You don’t have permission to send or view messages.';
      case 'firestore/unavailable':
        return 'Network error. Please check your connection.';
      case 'firestore/invalid-argument':
        return 'Unable to process message. Please try again.';
      case 'firestore/not-found':
        return 'Chat not found. Please try another chat.';
      case 'firestore/resource-exhausted':
        return 'Service limit reached. Please try again later.';
      case 'firestore/unauthenticated':
        return 'Please log in again.';
      case 'app/no-chat-id':
        return 'Invalid chat. Please try again.';
      case 'app/no-user-uuid':
        return 'Please log in to send messages.';
      case 'app/firestore-invalid':
        return 'Unable to load messages. Please try again later.';
      default:
        return error.message.includes('collection')
          ? 'Unable to process request. Please try again later.'
          : 'An error occurred. Please try again.';
    }
  };

  const otherParticipantUuid = Object.keys(participantNames).find(
    uuid => uuid !== currentUserUuid,
  );
  const otherParticipantName = otherParticipantUuid
    ? participantNames[otherParticipantUuid] || 'Unknown'
    : chatName;

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={wp(6)} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerText, {color: theme.text}]}>
            {otherParticipantName}
          </Text>
        </View>

        {errorMessage ? (
          <Text style={[styles.errorText, {color: theme.text}]}>
            {errorMessage}
          </Text>
        ) : (
          <FlatList
            data={messages}
            inverted
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              const isSent = item.sender === currentUserUuid;
              const senderName = participantNames[item.sender] || 'Unknown';
              const createdAt = item.createdAt?.toDate
                ? item.createdAt.toDate()
                : new Date();
              const time = createdAt.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <View
                  style={[
                    styles.messageContainer,
                    isSent
                      ? styles.sentMessageContainer
                      : styles.receivedMessageContainer,
                  ]}>
                  <View
                    style={[
                      styles.message,
                      isSent ? styles.sentMessage : styles.receivedMessage,
                    ]}>
                    <Text
                      style={[
                        styles.senderName,
                        isSent ? styles.sentText : styles.receivedText,
                      ]}>
                      {senderName}
                    </Text>
                    <Text
                      style={[
                        styles.messageText,
                        isSent ? styles.sentText : styles.receivedText,
                      ]}>
                      {item.text}
                    </Text>
                    <View style={styles.timeContainer}>
                      <Text style={styles.timeText}>{time}</Text>
                      {isSent && (
                        <Icon
                          name="done-all"
                          size={wp(4)}
                          color="#fff"
                          style={styles.checkmark}
                        />
                      )}
                    </View>
                  </View>
                </View>
              );
            }}
            contentContainerStyle={styles.messageList}
          />
        )}

        <View
          style={[
            styles.inputContainer,
            {backgroundColor: theme.backgroundColor},
          ]}>
          <TextInput
            style={[styles.input, {color: theme.input}]}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Icon name="send" size={wp(6)} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: Platform.OS === 'android' ? hp(3) : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(4),
  },
  headerText: {
    fontSize: wp(5),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  messageList: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(2),
  },
  messageContainer: {
    marginVertical: hp(1),
  },
  sentMessageContainer: {
    alignItems: 'flex-end',
  },
  receivedMessageContainer: {
    alignItems: 'flex-start',
  },
  message: {
    maxWidth: '75%',
    padding: wp(3),
    borderRadius: wp(4),
  },
  sentMessage: {
    backgroundColor: '#03A7A7',
    borderTopRightRadius: 0,
  },
  receivedMessage: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 0,
  },
  senderName: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
    marginBottom: hp(0.5),
  },
  messageText: {
    fontSize: wp(4),
  },
  sentText: {
    color: '#fff',
  },
  receivedText: {
    color: '#000',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.5),
  },
  timeText: {
    fontSize: wp(3),
    color: '#000000',
  },
  checkmark: {
    marginLeft: wp(1),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(3),
  },
  input: {
    flex: 1,
    padding: wp(2),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp(5),
    fontSize: wp(4),
  },
  sendButton: {
    backgroundColor: '#ff69b4',
    padding: wp(2),
    borderRadius: wp(10),
    marginLeft: wp(2),
  },
  errorText: {
    fontSize: wp(4),
    textAlign: 'center',
    marginVertical: hp(2),
    color: 'red',
  },
});

export default MessageScreen;
