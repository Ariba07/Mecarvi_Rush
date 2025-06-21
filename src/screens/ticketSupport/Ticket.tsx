import React, {useState, useEffect, useContext, useCallback} from 'react';
import {SafeAreaView, View, Alert} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  Message,
  RootStackParamList,
} from '../../components/types/screenTypes/ScreenTypes';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import Header from '../../components/common/header/Header';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';

import {Platform} from 'react-native';
import {styles} from '../../assets/styles/ticket/TicketSTyles';
import {useSelector} from 'react-redux';
import {selectUserId} from '../../slice/Slice';
import {STORAGE_KEY} from '../login/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TicketRouteProp = RouteProp<RootStackParamList, 'Ticket'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Ticket: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {theme} = useContext(ThemeContext);
  const route = useRoute<TicketRouteProp>();
  const {ticketId, ticketUuid} = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [ticketSubject, setTicketSubject] = useState<string>('Support Chat');
  const [selectedImages, setSelectedImages] = useState<
    {uri: string; type: string; name: string}[]
  >([]);

  const reduxUserId = useSelector(selectUserId);

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const credentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (credentials) {
          const parsedCredentials = JSON.parse(credentials);
          setUserId(parsedCredentials.id ?? reduxUserId ?? null);
        } else {
          setUserId(reduxUserId ?? null);
        }
      } catch (error) {
        setUserId(reduxUserId ?? null);
      }
    };
    fetchUserData();
  }, [reduxUserId]);

  const fetchChatMessages = useCallback(async () => {
    if (!ticketUuid) {
      Alert.alert('Error', 'Dispute UUID is missing.');
      return;
    }
    try {
      const response = (await apiHelper({
        method: 'GET',
        endpoint: `support-tickets/${ticketUuid}`,
      })) as any;
      if (response.status === 1 && response.data) {
        setTicketSubject(response.data.subject || 'Support Chat');
        const fetchedMessages = response.data.messages.map((msg: any) => {
          const date = new Date(msg.created_at);
          const time = date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          const images = Array.isArray(msg.images)
            ? msg.images
                .map((img: any) =>
                  typeof img === 'string'
                    ? img
                    : img?.file_url || img?.uri || img?.url || '',
                )
                .filter((img: string) => img)
            : [];
          return {
            id: msg.id.toString(),
            text: msg.message || '',
            images,
            timestamp: time,
            isSent: msg.user.id === userId,
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
      Alert.alert(
        'Error',
        'Failed to fetch chat messages. Please check your network.',
      );
    }
  }, [ticketUuid, userId]);

  const handleSelectImages = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0,
      });
      if (result.didCancel) {
        return;
      }
      if (result.errorCode) {
        Alert.alert('Error', `Image selection failed: ${result.errorMessage}`);
        return;
      }
      if (result.assets) {
        const compressedImages = await Promise.all(
          result.assets.map(async asset => {
            try {
              const compressed = await ImageResizer.createResizedImage(
                asset.uri!,
                1024,
                1024,
                'JPEG',
                70,
                0,
                undefined,
              );
              return {
                uri:
                  Platform.OS === 'ios'
                    ? compressed.uri.replace('file://', '')
                    : compressed.uri,
                type: 'image/jpeg',
                name: compressed.name || `image_${Date.now()}.jpg`,
              };
            } catch (error) {
              return null;
            }
          }),
        );
        const validImages = compressedImages.filter(
          (img): img is {uri: string; type: string; name: string} =>
            img !== null,
        );
        if (validImages.length === 0) {
          Alert.alert('Error', 'Failed to compress selected images.');
          return;
        }
        setSelectedImages(prev => [...prev, ...validImages]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select images.');
    }
  };

  const createChat = useCallback(async () => {
    if (!ticketId) {
      Alert.alert('Error', 'Ticket ID is missing.');
      return false;
    }
    if (!newMessage.trim() && selectedImages.length === 0) {
      Alert.alert('Error', 'Please enter a message or select an image.');
      return false;
    }
    try {
      const formData = new FormData();
      formData.append('message', newMessage);
      selectedImages.forEach(image =>
        formData.append('images[]', {
          uri: image.uri,
          type: image.type,
          name: image.name,
        } as any),
      );
      const response = (await apiHelper({
        method: 'POST',
        endpoint: `support-tickets/createChat/${ticketId}`,
        data: formData,
      })) as any;
      if (response.status === 1) {
        return true;
      }
      Alert.alert('Error', response.message || 'Failed to send message.');
      return false;
    } catch (error: any) {
      Alert.alert(
        'Error',
        'Failed to send message. Please check your network.',
      );
      return false;
    }
  }, [newMessage, selectedImages, ticketId]);

  useEffect(() => {
    fetchChatMessages();
  }, [fetchChatMessages]);

  const handleSendMessage = async () => {
    const success = await createChat();
    if (success) {
      setNewMessage('');
      setSelectedImages([]);
      await fetchChatMessages();
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: theme.whole || '#f0f4f8'}]}>
      <View style={styles.container}>
        <Header title={ticketSubject} onBackPress={() => navigation.goBack()} />
        <ChatMessages messages={messages} />
        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          selectedImages={selectedImages}
          onSelectImages={handleSelectImages}
          onSendMessage={handleSendMessage}
          onClearImages={() => setSelectedImages([])}
        />
      </View>
    </SafeAreaView>
  );
};

export default Ticket;
