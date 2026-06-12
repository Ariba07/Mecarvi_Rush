import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../context/ThemeContext';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/ticket/TicketStyles';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (text: string) => void;
  selectedImages: {uri: string; type: string; name: string}[];
  onSelectImages: () => void;
  onSendMessage: () => void;
  onClearImages: () => void;
  isSending: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  selectedImages,
  onSelectImages,
  onSendMessage,
  onClearImages,
  isSending,
}) => {
  const {theme} = React.useContext(ThemeContext);

  return (
    <>
      <View
        style={[
          styles.inputContainer,
          {backgroundColor: theme.backgroundColor || '#f0f4f8'},
        ]}>
        <TouchableOpacity
          onPress={onSelectImages}
          style={styles.attachmentButton}
          disabled={isSending}>
          <Icon
            name="attach-file"
            size={wp(6)}
            color={isSending ? '#ccc' : '#fff'}
          />
        </TouchableOpacity>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.whole || '#fff',
              color: theme.input || '#000',
            },
            isSending && styles.inputDisabled,
          ]}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={theme.text ? theme.text + '80' : '#999'}
          multiline
          editable={!isSending}
        />
        <TouchableOpacity
          onPress={onSendMessage}
          style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
          disabled={isSending}>
          <Icon name="send" size={wp(6)} color={isSending ? '#ccc' : '#fff'} />
        </TouchableOpacity>
      </View>
      {selectedImages.length > 0 && (
        <View style={styles.selectedImagesContainer}>
          <Text
            style={[styles.selectedImagesText, {color: theme.text || '#333'}]}>
            Selected Images: {selectedImages.length}
          </Text>
          <TouchableOpacity
            onPress={onClearImages}
            style={styles.clearImagesButton}
            disabled={isSending}>
            <Text style={styles.clearImagesButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default MessageInput;
