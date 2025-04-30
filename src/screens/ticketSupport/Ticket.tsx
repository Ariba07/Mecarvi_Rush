/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import Header from '../../components/common/header/Header';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
}

type TicketRouteProp = RouteProp<RootStackParamList, 'Ticket'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Ticket: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {theme} = useContext(ThemeContext);
  const route = useRoute<TicketRouteProp>();
  const {ticketId, ticketUuid} = route.params; // e.g., "94885691-42be-4327-aa9b-da5a6edf1544"
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [ticketSubject, setTicketSubject] = useState<string>('Support Chat');

  // Fetch chat messages from API
  const fetchChatMessages = useCallback(async () => {
    if (!ticketUuid) {
      Alert.alert('Error', 'Ticket UUID is missing.');
      return;
    }

    try {
      const response = (await apiHelper({
        method: 'GET',
        endpoint: `support-tickets/${ticketUuid}`,
      })) as any;

      console.log('Fetch Chat API Response:', response);

      if (response.status === 1 && response.data) {
        // Set ticket subject for header
        setTicketSubject(response.data.subject || 'Support Chat');

        // Map messages to the Message interface
        const fetchedMessages = response.data.messages.map((msg: any) => {
          const date = new Date(msg.created_at);
          const time = date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          return {
            id: msg.id.toString(),
            text: msg.message,
            timestamp: time,
            isSent: msg.user.id === 2, // Assuming logged-in user ID is 2 (Dummy Customer)
          };
        });
        setMessages(fetchedMessages);
      } else {
        Alert.alert(
          'Error',
          response.message || 'Failed to load chat messages.',
        );
      }
    } catch (error: any) {
      console.error('Fetch chat messages error:', error.message || error);
      Alert.alert(
        'Error',
        'Failed to fetch chat messages. Please check your network.',
      );
    }
  }, [ticketUuid]);

  // Send a new message via API
  const createChat = useCallback(async () => {
    if (!ticketId) {
      Alert.alert('Error', 'Ticket ID is missing.');
      return false;
    }

    if (!newMessage.trim()) {
      Alert.alert('Error', 'Please enter a message.');
      return false;
    }

    try {
      const response = (await apiHelper({
        method: 'POST',
        endpoint: `support-tickets/createChat/${ticketId}`,
        data: {message: newMessage},
      })) as any;

      console.log('Create Chat API Response:', response);

      if (response.status === 1) {
        // Successfully sent the message
        return true;
      } else {
        Alert.alert('Error', response.message || 'Failed to send message.');
        return false;
      }
    } catch (error: any) {
      console.error('Create chat error:', error.message || error);
      Alert.alert(
        'Error',
        'Failed to send message. Please check your network.',
      );
      return false;
    }
  }, [ticketId, newMessage]);

  // Fetch messages on mount
  useEffect(() => {
    fetchChatMessages();
  }, [fetchChatMessages]);

  const handleSendMessage = async () => {
    const success = await createChat();
    if (success) {
      setNewMessage(''); // Clear the input field
      await fetchChatMessages(); // Refresh the chat messages
    }
  };

  const renderMessage = ({item}: {item: Message}) => (
    <View
      style={[
        styles.messageContainer,
        item.isSent
          ? styles.sentMessageContainer
          : styles.receivedMessageContainer,
      ]}>
      <View
        style={[
          styles.messageBubble,
          item.isSent ? styles.sentMessageBubble : styles.receivedMessageBubble,
        ]}>
        <Text
          style={[styles.messageText, {color: item.isSent ? '#fff' : '#000'}]}>
          {item.text}
        </Text>
      </View>
      <Text
        style={[
          styles.timestamp,
          {
            color: theme.text || '#666',
            textAlign: item.isSent ? 'right' : 'left',
          },
        ]}>
        {item.timestamp}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: theme.whole || '#f0f4f8'}]}>
      <View style={styles.container}>
        {/* Header */}
        <Header title={ticketSubject} onBackPress={() => navigation.goBack()} />
        {/* Chat Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
        />
        {/* Message Input */}
        <View
          style={[
            styles.inputContainer,
            {backgroundColor: theme.backgroundColor || '#f0f4f8'},
          ]}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.whole || '#fff',
                color: theme.input || '#000',
              },
            ]}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor={theme.text ? theme.text + '80' : '#999'}
            multiline
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={styles.sendButton}>
            <Icon name="send" size={wp(6)} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
  },
  chatContainer: {
    paddingBottom: hp(10), // Extra padding to avoid overlap with input
  },
  messageContainer: {
    marginBottom: hp(2),
  },
  sentMessageContainer: {
    alignItems: 'flex-end',
  },
  receivedMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: wp(70),
    padding: wp(3),
    borderRadius: wp(4),
  },
  sentMessageBubble: {
    backgroundColor: '#00C4B4',
    borderBottomRightRadius: wp(1),
  },
  receivedMessageBubble: {
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: wp(1),
  },
  messageText: {
    fontSize: wp(4),
  },
  timestamp: {
    fontSize: wp(3),
    marginTop: hp(0.5),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(3),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: wp(5),
    padding: wp(2),
    fontSize: wp(4),
    maxHeight: hp(10),
    marginRight: wp(2),
  },
  sendButton: {
    backgroundColor: '#00C4B4',
    borderRadius: wp(5),
    padding: wp(2),
  },
});

export default Ticket;
