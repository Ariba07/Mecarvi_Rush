import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/profile/ProfileStyles';

interface ProfileHeaderProps {
  userName: string | null;
  profileImage: string | null;
  selectedImage: any;
  onImagePick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userName,
  profileImage,
  selectedImage,
  onImagePick,
}) => {
  const {theme} = React.useContext(ThemeContext);

  return (
    <View style={styles.profileContainer}>
      <View style={styles.imageWrapper}>
        <Image
          source={
            selectedImage
              ? {uri: selectedImage.uri}
              : profileImage
              ? {uri: profileImage}
              : require('../../assets/images/Orders.png')
          }
          style={styles.profileImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.editIconContainer}
          onPress={onImagePick}>
          <Icon name="edit" size={wp(5)} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={[styles.storeName, {color: theme.text || '#333'}]}>
        {userName || 'Unknown User'}
      </Text>
    </View>
  );
};

export default ProfileHeader;
