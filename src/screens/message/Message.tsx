import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {useSelector} from 'react-redux';
import {selectUserUuidId} from '../../slice/Slice';
import {db, auth} from '../../../FirebaseConfig';
import {
  collection,
  orderBy,
  query,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import {Message, getUserFriendlyMessage} from './types';
import {styles} from '../../assets/styles/messageScreen/MessageScreenStyles';

type MessagesRouteProp = RouteProp<RootStackParamList, 'Message'>;

const MessageScreen: React.FC = () => {
  const route = useRoute<MessagesRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {chatId, participantNames = {}} = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const currentUserUuid = useSelector(selectUserUuidId);
  const {theme} = useContext(ThemeContext);

  useEffect(() => {
    let unsubscribeAuth: () => void;
    let unsubscribeMessages: () => void;

    unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (!user) {
        setErrorMessage('Please log in to view messages.');
        navigation.navigate('Login');
      } else if (user.uid !== currentUserUuid && currentUserUuid) {
        setErrorMessage('Session error. Please log in again.');
        navigation.navigate('Login');
      }
    });

    if (!chatId || !currentUserUuid) {
      setErrorMessage(
        chatId
          ? 'Please log in to view messages.'
          : 'Invalid chat. Please try again.',
      );
      return;
    }

    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'desc'));
      unsubscribeMessages = onSnapshot(
        q,
        snapshot => {
          try {
            const fetchedMessages: Message[] = snapshot.docs.map(
              messageDoc => ({
                id: messageDoc.id,
                text: messageDoc.data().text || messageDoc.data().message || '',
                sender: messageDoc.data().sender || 'unknown',
                createdAt: messageDoc.data().createdAt || serverTimestamp(),
              }),
            );
            setMessages(fetchedMessages);
            setErrorMessage(null);
          } catch (error: any) {
            setErrorMessage(getUserFriendlyMessage(error));
          }
        },
        error => {
          setErrorMessage(getUserFriendlyMessage(error));
        },
      );
    } catch (error: any) {
      setErrorMessage(getUserFriendlyMessage(error));
    }

    return () => {
      if (unsubscribeMessages) {
        unsubscribeMessages();
      }
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }
    };
  }, [chatId, currentUserUuid, navigation]);
  console.log(messages);

  const sendMessage = async () => {
    if (!text.trim() || !currentUserUuid || !chatId) {
      setErrorMessage(
        !text.trim()
          ? 'Message text is empty'
          : 'Invalid chat or session. Please try again.',
      );
      return;
    }
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        text: text.trim(),
        sender: currentUserUuid,
        createdAt: serverTimestamp(),
      });
      setText('');
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(getUserFriendlyMessage(error));
    }
  };

  const otherParticipantUuid = Object.keys(participantNames).find(
    uuid => uuid !== currentUserUuid,
  );
  const otherParticipantName = otherParticipantUuid
    ? participantNames[otherParticipantUuid] || 'Unknown'
    : route.params.chatName;

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
          <MessageList
            messages={messages}
            currentUserUuid={currentUserUuid}
            participantNames={participantNames}
          />
        )}
        <MessageInput text={text} setText={setText} onSend={sendMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreen;
