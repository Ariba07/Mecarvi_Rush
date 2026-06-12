import React from 'react';
import {View, TextInput, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {ThemeContext} from '../../context/ThemeContext';
import {styles} from '../../assets/styles/disputes/DisputeChatStyles';
import * as Animatable from 'react-native-animatable';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (text: string) => void;
  selectedImages: {uri: string; type: string; name: string}[];
  setSelectedImages: (
    images: {uri: string; type: string; name: string}[],
  ) => void;
  onSelectImages: () => void;
  onSendMessage: () => void;
  isSending: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  selectedImages,
  setSelectedImages,
  onSelectImages,
  onSendMessage,
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
        <Animatable.View animation="bounceIn" duration={800}>
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
        </Animatable.View>
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
          editable={!isSending}
        />
        <Animatable.View animation="bounceIn" duration={800} delay={200}>
          <TouchableOpacity
            onPress={onSendMessage}
            style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
            disabled={isSending}>
            <Icon
              name="send"
              size={wp(6)}
              color={isSending ? '#ccc' : '#fff'}
            />
          </TouchableOpacity>
        </Animatable.View>
      </View>
      {selectedImages.length > 0 && (
        <Animatable.View animation="fadeIn" duration={600}>
          <View style={styles.selectedImagesContainer}>
            <Text
              style={[
                styles.selectedImagesText,
                {color: theme.text || '#333'},
              ]}>
              Selected Images: {selectedImages.length}
            </Text>
            <TouchableOpacity
              onPress={() => setSelectedImages([])}
              style={styles.clearImagesButton}
              disabled={isSending}>
              <Text style={styles.clearImagesButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      )}
    </>
  );
};

export default MessageInput;
