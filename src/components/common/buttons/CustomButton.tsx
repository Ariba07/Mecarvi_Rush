/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ThemeContext} from '../../../context/ThemeContext';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean; // Added loading prop
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled,
  isLoading,
}) => {
  const {theme} = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={[styles.button, {opacity: disabled || isLoading ? 0.5 : 1}]}
      onPress={onPress}
      disabled={disabled || isLoading}>
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.backgroundColor} />
      ) : (
        <Text style={[styles.text, {color: theme.backgroundColor}]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#03A7A7',
    paddingVertical: Platform.OS === 'ios' ? hp(1) : hp(1.5),
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
    width: wp(80),
    height: Platform.OS === 'ios' ? hp(4.5) : hp(5.7),
    alignSelf: 'center',
  },
  text: {
    color: '#fff',
    fontSize: Platform.OS === 'ios' ? wp(4.7) : wp(4.5),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default CustomButton;
