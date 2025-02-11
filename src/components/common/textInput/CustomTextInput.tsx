import React, {useState} from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface CustomTextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(!secureTextEntry); // State for visibility

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={!isPasswordVisible} // Toggle secureTextEntry based on state
        value={value ? value.charAt(0).toLowerCase() + value.slice(1) : ''}
        onChangeText={onChangeText}
        placeholderTextColor={'#999'}
        keyboardType={placeholder === 'Phone Number' ? 'numeric' : 'default'}
      />
      {(placeholder === 'Password' ||
        placeholder === 'Confirm Password' ||
        placeholder === 'New Password') && (
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Icon
            name={isPasswordVisible ? 'eye' : 'eye-off'} // Change icon based on visibility
            size={20}
            color={'#333333'}
            type="ionicon"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(0.5), // Responsive margin
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? '#A9A9A9' : '#777', // Different border color for iOS & Android
    borderRadius: wp(2), // Responsive border radius
    paddingVertical: Platform.OS === 'ios' ? hp(1.5) : hp(0.2), // Responsive padding
    paddingHorizontal: wp(2),
    width: wp(80), // Responsive width
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1, // Take available space
    fontSize: wp(3.5), // Responsive font size
    color: '#000',
  },
});

export default CustomTextInput;
