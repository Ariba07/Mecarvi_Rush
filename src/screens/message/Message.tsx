/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  collection,
  doc,
  orderBy,
  query,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {db} from '../../../FirebaseConfig';

type MessagesRouteProp = RouteProp<RootStackParamList, 'Message'>;

interface Message {
  id: string;
  text: string;
  createdAt: any;
  sender: string; // Added sender field
}

const currentUser = 'user123'; // TEMP: Replace this when adding authentication

const MessageScreen: React.FC = () => {
  const route = useRoute<MessagesRouteProp>();
  const {chatId, chatName} = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const messagesRef = collection(
      doc(collection(db, 'chats'), chatId),
      'messages',
    );
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      const fetchedMessages: Message[] = snapshot.docs.map(messageDoc => ({
        id: messageDoc.id,
        text: messageDoc.data().text,
        sender: messageDoc.data().sender || 'unknown',
        createdAt: messageDoc.data().createdAt || serverTimestamp(),
      }));

      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!text.trim()) {
      return;
    }

    const messagesRef = collection(
      doc(collection(db, 'chats'), chatId),
      'messages',
    );
    await addDoc(messagesRef, {
      text,
      sender: currentUser, // TEMP: Replace with authenticated user ID
      createdAt: serverTimestamp(),
    });

    setText('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <FlatList
        data={messages}
        inverted
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const isSent = item.sender === currentUser;
          return (
            <View
              style={[
                styles.message,
                isSent ? styles.sentMessage : styles.receivedMessage,
              ]}>
              <Text
                style={[
                  styles.messageText,
                  isSent ? styles.sentText : styles.receivedText,
                ]}>
                {item.text}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f0f0f0', paddingHorizontal: 10},
  message: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
  },
  sentMessage: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  receivedMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  messageText: {fontSize: 16},
  sentText: {color: '#fff'},
  receivedText: {color: '#000'},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
  },
  sendText: {color: '#fff', fontWeight: 'bold'},
});

export default MessageScreen;
