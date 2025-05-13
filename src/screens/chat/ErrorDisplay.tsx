import React from 'react';
import {Text} from 'react-native';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {styles} from '../../assets/styles/chats/ChatsStyles';

interface ErrorDisplayProps {
  errorMessage: string | null;
  chatsLength: number;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  errorMessage,
  chatsLength,
}) => {
  const {theme} = React.useContext(ThemeContext);

  if (errorMessage) {
    return (
      <Text style={[styles.errorText, {color: theme.text}]}>
        {errorMessage}
      </Text>
    );
  }

  if (chatsLength === 0) {
    return (
      <Text style={[styles.noChatsText, {color: theme.text}]}>
        No chats available
      </Text>
    );
  }

  return null;
};

export default ErrorDisplay;
