import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Platform,
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
import {db} from '../../../FirebaseConfig';
import Header from '../../components/common/header/Header';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useSelector} from 'react-redux';
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
  const navigation = useNavigation<NavigationProp>();
  const {theme} = useContext(ThemeContext);
  const currentUserUuid = useSelector(selectUserUuidId);

  useEffect(() => {
    console.log('Current User UUID in Chats:', currentUserUuid);
    if (!currentUserUuid) {
      console.warn('No currentUserUuid available');
      return;
    }

    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', currentUserUuid),
    );

    const unsubscribe = onSnapshot(
      q,
      async snapshot => {
        const chatList: Chat[] = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          chatId: doc.data().chatId,
          participants: doc.data().participants,
          lastMessage: undefined, // Will be updated by nested listener
          otherParticipantName: undefined, // Will be fetched
        }));

        // Fetch the other participant's name
        const chatListWithNames = await Promise.all(
          chatList.map(async chat => {
            const otherParticipant = chat.participants.find(
              p => p !== currentUserUuid,
            );
            if (otherParticipant) {
              try {
                const response = await apiHelper({
                  method: 'GET',
                  endpoint: `service-provider/${otherParticipant}`,
                });
                const apiData = (response as {data: any}).data;
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

        // Set up a listener for each chat's messages
        const messageUnsubscribers: (() => void)[] = [];
        chatListWithNames.forEach(chat => {
          const messagesRef = collection(db, 'chats', chat.id, 'messages');
          const messagesQuery = query(
            messagesRef,
            orderBy('createdAt', 'desc'),
            limit(1),
          );
          const messageUnsubscribe = onSnapshot(
            messagesQuery,
            messagesSnapshot => {
              const lastMessage = messagesSnapshot.docs[0]?.data() as
                | Message
                | undefined;
              setChats(prevChats =>
                prevChats.map(c =>
                  c.id === chat.id ? {...c, lastMessage} : c,
                ),
              );
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

        setChats(chatListWithNames);
        console.log('Chats fetched:', chatListWithNames);

        // Cleanup message listeners on unmount
        return () => {
          messageUnsubscribers.forEach(unsub => unsub());
        };
      },
      error => {
        console.error('Error fetching chats:', error);
      },
    );

    return () => unsubscribe();
  }, [currentUserUuid]);

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
