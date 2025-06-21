import React from 'react';
import {FlatList, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {
  Chat,
  RootStackParamList,
} from '../../components/types/screenTypes/ScreenTypes';
import {styles} from '../../assets/styles/chats/ChatsStyles';

interface ChatListProps {
  chats: Chat[];
  currentUserUuid: string;
}

const ChatList: React.FC<ChatListProps> = ({chats, currentUserUuid}) => {
  const {theme} = React.useContext(ThemeContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderItem = ({item}: {item: Chat}) => {
    const otherParticipant = item.participants.find(p => p !== currentUserUuid);
    const otherParticipantName =
      otherParticipant && item.participantNames[otherParticipant]
        ? item.participantNames[otherParticipant]
        : 'Unknown';
    const isSender = item.lastMessage?.sender === currentUserUuid;
    const messageText =
      item.lastMessage?.text || item.lastMessage?.message || '';

    return (
      <TouchableOpacity
        style={[styles.chatItem, {backgroundColor: theme.backgroundColor}]}
        onPress={() =>
          navigation.navigate('Message', {
            chatId: item.id,
            chatName: otherParticipantName,
            participantNames: item.participantNames,
          })
        }>
        <Text style={[styles.chatName, {color: theme.text}]}>
          {otherParticipantName}
        </Text>
        {item.lastMessage ? (
          <Text style={[styles.lastMessage, {color: theme.text}]}>
            {isSender
              ? `You: ${messageText}`
              : `${otherParticipantName}: ${messageText}`}
          </Text>
        ) : (
          <Text style={[styles.lastMessage, {color: theme.text}]}>
            No messages yet
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={chats}
      keyExtractor={item => item.id}
      renderItem={renderItem}
    />
  );
};

export default ChatList;
