import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/messageScreen/MessageScreenStyles';

interface MessageInputProps {
  text: string;
  setText: (text: string) => void;
  onSend: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({text, setText, onSend}) => {
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
      />
      <TouchableOpacity onPress={onSend} style={styles.sendButton}>
        <Icon name="send" size={wp(6)} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;
