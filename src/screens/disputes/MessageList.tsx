/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, FlatList, Text, RefreshControl} from 'react-native';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {Message} from '../../components/types/screenTypes/ScreenTypes';
import {styles} from '../../assets/styles/disputes/DisputeChatStyles';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import * as Animatable from 'react-native-animatable';

interface MessageListProps {
  messages: Message[];
  refreshing: boolean;
  onRefresh: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  refreshing,
  onRefresh,
}) => {
  const {theme} = React.useContext(ThemeContext);

  const renderMessage = ({item, index}: {item: Message; index: number}) => (
    <Animatable.View
      animation="fadeInUp"
      duration={600}
      delay={index * 100}
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
              {color: item.isSent ? '#ffffff' : '#000000'},
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
            {(item.images ?? []).map((imageUrl: string, imgIndex: number) => (
              <Animatable.Image
                key={`${item.id}-${imgIndex}`}
                animation="zoomIn"
                duration={600}
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
    </Animatable.View>
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

export default MessageList;
