import React, {useState, useEffect, useContext, useCallback} from 'react';
import {SafeAreaView, View, Platform} from 'react-native';
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
import {styles} from '../../assets/styles/ticket/TicketSTyles';
import {useSelector} from 'react-redux';
import {selectUserId} from '../../slice/Slice';
import {STORAGE_KEY} from '../login/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomModal from '../../components/common/errorModal/CustomModal';

type TicketRouteProp = RouteProp<RootStackParamList, 'Ticket'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ActionResult {
  success: boolean;
  data?: any;
  error?: {
    title: string;
    message: string;
  };
}

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
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('Error');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
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

  const fetchChatMessages = useCallback(async (): Promise<ActionResult> => {
    if (!ticketUuid) {
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Ticket UUID is missing.',
        },
      };
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
        return {
          success: true,
          data: fetchedMessages,
        };
      } else {
        return {
          success: false,
          error: {
            title: 'Error',
            message: response.message || 'Failed to load chat messages.',
          },
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Failed to fetch chat messages. Please check your network.',
        },
      };
    } finally {
      setRefreshing(false);
    }
  }, [ticketUuid, userId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const result = await fetchChatMessages();
    if (!result.success && result.error) {
      setModalTitle(result.error.title);
      setModalMessage(result.error.message);
      setModalVisible(true);
    }
  }, [fetchChatMessages]);

  const handleSelectImages = useCallback(async (): Promise<ActionResult> => {
    if (isSending) {
      return {success: false};
    }
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0,
      });
      if (result.didCancel) {
        return {success: false};
      }
      if (result.errorCode) {
        return {
          success: false,
          error: {
            title: 'Error',
            message: `Image selection failed: ${result.errorMessage}`,
          },
        };
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
          return {
            success: false,
            error: {
              title: 'Error',
              message: 'Failed to compress selected images.',
            },
          };
        }
        setSelectedImages(prev => [...prev, ...validImages]);
        return {success: true, data: validImages};
      }
      return {success: false};
    } catch (error) {
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Failed to select images.',
        },
      };
    }
  }, [isSending]);

  const createChat = useCallback(async (): Promise<ActionResult> => {
    if (!ticketId) {
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Ticket ID is missing.',
        },
      };
    }
    if (!newMessage.trim() && selectedImages.length === 0) {
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Please enter a message or select an image.',
        },
      };
    }
    setIsSending(true);
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
        return {
          success: true,
          error: {
            title: 'Success',
            message: 'Message sent successfully!',
          },
        };
      }
      return {
        success: false,
        error: {
          title: 'Error',
          message: response.message || 'Failed to send message.',
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Failed to send message. Please check your network.',
        },
      };
    } finally {
      setIsSending(false);
    }
  }, [newMessage, selectedImages, ticketId]);

  useEffect(() => {
    const loadMessages = async () => {
      const result = await fetchChatMessages();
      if (!result.success && result.error) {
        setModalTitle(result.error.title);
        setModalMessage(result.error.message);
        setModalVisible(true);
      }
    };
    loadMessages();
  }, [fetchChatMessages]);

  const onSelectImages = async () => {
    const result = await handleSelectImages();
    if (!result.success && result.error) {
      setModalTitle(result.error.title);
      setModalMessage(result.error.message);
      setModalVisible(true);
    }
  };

  const onSendMessage = async () => {
    if (isSending) {
      return;
    }
    const result = await createChat();
    if (result.success && result.error) {
      setNewMessage('');
      setSelectedImages([]);
      await fetchChatMessages();
      setModalTitle(result.error.title);
      setModalMessage(result.error.message);
      setModalVisible(true);
    } else if (!result.error) {
      setNewMessage('');
      setSelectedImages([]);
      await fetchChatMessages();
    } else if (!result.success && result.error) {
      setModalTitle(result.error.title);
      setModalMessage(result.error.message);
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: theme.whole || '#f0f4f8'}]}>
      <View style={styles.container}>
        <Header title={ticketSubject} onBackPress={() => navigation.goBack()} />
        <ChatMessages
          messages={messages}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          selectedImages={selectedImages}
          onSelectImages={onSelectImages}
          onSendMessage={onSendMessage}
          onClearImages={() => setSelectedImages([])}
          isSending={isSending}
        />
        <CustomModal
          visible={modalVisible}
          title={modalTitle}
          message={modalMessage}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default Ticket;
