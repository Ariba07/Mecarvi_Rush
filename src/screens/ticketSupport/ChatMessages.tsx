/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, FlatList, Image, RefreshControl} from 'react-native';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Message} from '../../components/types/screenTypes/ScreenTypes';
import {styles} from '../../assets/styles/ticket/TicketSTyles';

interface ChatMessagesProps {
  messages: Message[];
  refreshing: boolean;
  onRefresh: () => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  refreshing,
  onRefresh,
}) => {
  const {theme} = React.useContext(ThemeContext);

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
        {item.text ? (
          <Text
            style={[
              styles.messageText,
              {color: item.isSent ? '#fff' : '#000'},
              (item.images?.length ?? 0) > 0 && {marginBottom: hp(1)},
            ]}>
            {item.text}
          </Text>
        ) : null}
        {(item.images?.length ?? 0) > 0 && (
          <View
            style={[
              styles.imageContainer,
              item.isSent && styles.sentImageContainer,
            ]}>
            {(item.images ?? []).map((imageUrl, index) => (
              <Image
                key={`${item.id}-${index}`}
                source={{uri: imageUrl}}
                style={styles.messageImage}
                resizeMode="cover"
                onError={() =>
                  console.warn(`Failed to load image: ${imageUrl}`)
                }
              />
            ))}
          </View>
        )}
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
    <FlatList
      data={messages}
      renderItem={renderMessage}
      keyExtractor={item => item.id ?? ''}
      contentContainerStyle={styles.chatContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.status || '#00C4B4']}
          tintColor={theme.status || '#00C4B4'}
          title="Pull to refresh"
        />
      }
    />
  );
};

export default ChatMessages;
