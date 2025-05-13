import React from 'react';
import {View, FlatList, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Message} from './types';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/messageScreen/MessageScreenStyles';

interface MessageListProps {
  messages: Message[];
  currentUserUuid: string;
  participantNames: {[key: string]: string};
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserUuid,
  participantNames,
}) => {
  return (
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
  );
};

export default MessageList;
