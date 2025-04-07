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
  Image,
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
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'; // Firebase Storage imports
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {db, auth, storage} from '../../../FirebaseConfig'; // Import storage
import {useSelector} from 'react-redux';
import {selectUserUuidId} from '../../slice/Slice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

type MessagesRouteProp = RouteProp<RootStackParamList, 'Message'>;

interface Message {
  id: string;
  text: string;
  createdAt: any;
  sender: string;
  type?: string; // Added to distinguish between text and image messages
}

const MessageScreen: React.FC = () => {
  const route = useRoute<MessagesRouteProp>();
  const navigation = useNavigation();
  const {chatId, chatName} = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const currentUserUuid = useSelector(selectUserUuidId);
  const {theme} = useContext(ThemeContext);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        console.log('Firebase Auth User UID in MessageScreen:', user.uid);
        console.log('Current User UUID (Redux/AsyncStorage):', currentUserUuid);
        if (user.uid !== currentUserUuid) {
          console.warn('Firebase UID and currentUserUuid do not match!');
        }
      } else {
        console.warn('No Firebase Auth user signed in');
      }
    });

    if (!chatId) {
      console.error('No chatId provided');
      return;
    }

    if (!currentUserUuid) {
      console.warn('No currentUserUuid available');
      return;
    }

    const messagesRef = collection(
      doc(collection(db, 'chats'), chatId),
      'messages',
    );
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const fetchedMessages: Message[] = snapshot.docs.map(messageDoc => ({
          id: messageDoc.id,
          text: messageDoc.data().text,
          sender: messageDoc.data().sender || 'unknown',
          createdAt: messageDoc.data().createdAt || serverTimestamp(),
          type: messageDoc.data().type || 'text', // Default to 'text' if type is not specified
        }));
        setMessages(fetchedMessages);
        console.log('Messages fetched for chatId:', chatId, fetchedMessages);
      },
      error => {
        console.error('Error in onSnapshot:', error);
      },
    );

    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, [chatId, currentUserUuid]);

  const sendMessage = async () => {
    if (!text.trim()) {
      console.warn('Message text is empty');
      return;
    }

    if (!currentUserUuid) {
      console.warn('No currentUserUuid available to send message');
      return;
    }

    if (!chatId) {
      console.warn('No chatId available to send message');
      return;
    }

    const messagesRef = collection(
      doc(collection(db, 'chats'), chatId),
      'messages',
    );
    try {
      await addDoc(messagesRef, {
        text: text.trim(),
        sender: currentUserUuid,
        createdAt: serverTimestamp(),
        type: 'text', // Specify type as text for regular messages
      });
      console.log('Message sent by:', currentUserUuid, 'Text:', text);
      setText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Function to upload image to Firebase Storage and get URL
  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `chatImages/${chatId}/${Date.now()}`);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Function to send image message
  const sendImageMessage = async (uri: string) => {
    if (!currentUserUuid || !chatId) {
      console.warn('No currentUserUuid or chatId available to send image');
      return;
    }

    try {
      const downloadURL = await uploadImage(uri);
      const messagesRef = collection(
        doc(collection(db, 'chats'), chatId),
        'messages',
      );
      await addDoc(messagesRef, {
        text: downloadURL, // Store the image URL in the text field
        sender: currentUserUuid,
        createdAt: serverTimestamp(),
        type: 'image', // Specify type as image
      });
      console.log(
        'Image message sent by:',
        currentUserUuid,
        'URL:',
        downloadURL,
      );
    } catch (error) {
      console.error('Error sending image message:', error);
    }
  };

  // Function to handle camera capture
  const handleCamera = () => {
    launchCamera({mediaType: 'photo', cameraType: 'back'}, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          sendImageMessage(uri);
        }
      }
    });
  };

  // Function to handle image upload from gallery
  const handleImageUpload = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          sendImageMessage(uri);
        }
      }
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={wp(6)} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerText, {color: theme.text}]}>
            {chatName}
          </Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="videocam" size={wp(6)} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="phone" size={wp(6)} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={messages}
          inverted
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            const isSent = item.sender === currentUserUuid;
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
                  {item.type === 'image' ? (
                    <Image
                      source={{uri: item.text}}
                      style={styles.messageImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text
                      style={[
                        styles.messageText,
                        isSent ? styles.sentText : styles.receivedText,
                      ]}>
                      {item.text}
                    </Text>
                  )}
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
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={handleCamera} style={styles.iconButton}>
              <Icon name="camera-alt" size={wp(6)} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleImageUpload}
              style={styles.iconButton}>
              <Icon name="link" size={wp(6)} color="#999" />
            </TouchableOpacity>
          </View>
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
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: wp(3),
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
  messageText: {
    fontSize: wp(4),
  },
  sentText: {
    color: '#fff',
  },
  receivedText: {
    color: '#000',
  },
  messageImage: {
    width: wp(50),
    height: hp(20),
    borderRadius: wp(2),
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
  iconContainer: {
    flexDirection: 'row',
    marginLeft: wp(2),
  },
  iconButton: {
    padding: wp(2),
  },
  sendButton: {
    backgroundColor: '#ff69b4',
    padding: wp(2),
    borderRadius: wp(10),
    marginLeft: wp(2),
  },
});

export default MessageScreen;
