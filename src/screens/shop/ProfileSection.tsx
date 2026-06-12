import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../context/ThemeContext';
import {ProfileData} from './types';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/shopProfile/ShopProfileStyles';

interface ProfileSectionProps {
  profile: ProfileData;
  currentUserUuid: string | null;
  providerId: string | null;
  onChat: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  currentUserUuid,
  providerId,
  onChat,
}) => {
  const {theme} = React.useContext(ThemeContext);

  return (
    <View style={styles.profileSection}>
      <View style={styles.profileImagePlaceholder}>
        <Text style={[styles.profileImageText, {color: theme.text}]}>
          {profile.name[0]}
        </Text>
      </View>
      <Text style={[styles.profileName, {color: theme.text}]}>
        {profile.name}
      </Text>
      <Text style={styles.profileLocation}>{profile.location}</Text>
      <TouchableOpacity
        style={[
          styles.chatButton,
          (!currentUserUuid || !providerId) && styles.disabledChatButton,
        ]}
        onPress={onChat}
        disabled={!currentUserUuid || !providerId}>
        <Icon name="chat" size={wp(4)} color="#fff" />
        <Text style={styles.chatButtonText}>Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileSection;
