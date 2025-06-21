import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/profile/ProfileStyles';
import * as Animatable from 'react-native-animatable'; // Import animatable

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
      <Animatable.View
        animation="zoomIn"
        duration={600}
        style={styles.imageWrapper}>
        <Image
          source={
            selectedImage
              ? {uri: selectedImage.uri}
              : profileImage
              ? {uri: profileImage}
              : {
                  uri: 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
                } // Fallback to default image
          }
          style={styles.profileImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.editIconContainer}
          onPress={onImagePick}>
          <Animatable.View>
            <Icon name="edit" size={wp(5)} color="#fff" />
          </Animatable.View>
        </TouchableOpacity>
      </Animatable.View>
      <Animatable.Text
        animation="fadeIn"
        duration={600}
        delay={200}
        style={[styles.storeName, {color: theme.text || '#333'}]}>
        {userName || 'Unknown User'}
      </Animatable.Text>
    </View>
  );
};

export default ProfileHeader;
