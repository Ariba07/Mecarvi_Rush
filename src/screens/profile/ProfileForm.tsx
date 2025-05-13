/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TextInput} from 'react-native';
import CustomButton from '../../components/common/buttons/CustomButton';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {styles} from '../../assets/styles/profile/ProfileStyles';

interface ProfileFormProps {
  fullName: string;
  email: string;
  phoneNumber: string;
  setFullName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhoneNumber: (value: string) => void;
  onUpdate: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  fullName,
  email,
  phoneNumber,
  setFullName,
  setEmail,
  setPhoneNumber,
  onUpdate,
}) => {
  const {theme} = React.useContext(ThemeContext);

  return (
    <View
      style={[styles.card, {backgroundColor: theme.backgroundColor || '#fff'}]}>
      <Text style={[styles.label, {color: theme.text || '#333'}]}>
        Full Name
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            color: theme.input || '#333',
            borderColor: theme.text ? theme.text + '30' : '#DDD',
          },
        ]}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Enter full name"
        placeholderTextColor={theme.text ? theme.text + '80' : '#999'}
      />
      <Text style={[styles.label, {color: theme.text || '#333'}]}>Email</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: theme.input || '#333',
            borderColor: theme.text ? theme.text + '30' : '#DDD',
          },
        ]}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Enter email"
        placeholderTextColor={theme.text ? theme.text + '80' : '#999'}
      />
      <Text style={[styles.label, {color: theme.text || '#333'}]}>
        Phone Number
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            color: theme.input || '#333',
            borderColor: theme.text ? theme.text + '30' : '#DDD',
          },
        ]}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        placeholder="Enter phone number"
        placeholderTextColor={theme.text ? theme.text + '80' : '#999'}
      />
      <CustomButton title="Update" onPress={onUpdate} />
    </View>
  );
};

export default ProfileForm;
