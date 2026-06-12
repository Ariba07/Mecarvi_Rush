import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../context/ThemeContext';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/messageScreen/MessageScreenStyles';

interface MessageInputProps {
  text: string;
  setText: (text: string) => void;
  onSend: () => void;
  isSending: boolean; // Added isSending prop
}

const MessageInput: React.FC<MessageInputProps> = ({
  text,
  setText,
  onSend,
  isSending,
}) => {
  const {theme} = React.useContext(ThemeContext);

  return (
    <View
      style={[styles.inputContainer, {backgroundColor: theme.backgroundColor}]}>
      <TextInput
        style={[styles.input, {color: theme.input}]}
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
        placeholderTextColor="#999"
        editable={!isSending} // Disable input while sending
      />
      <TouchableOpacity
        onPress={onSend}
        style={[styles.sendButton, isSending && styles.disabledButton]}
        disabled={isSending}>
        <Icon name="send" size={wp(6)} color={isSending ? '#999' : '#fff'} />
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;
