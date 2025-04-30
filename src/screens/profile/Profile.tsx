/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
  Keyboard,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import CustomButton from '../../components/common/buttons/CustomButton';
import {TouchableWithoutFeedback} from 'react-native';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectUserName,
  selectUserUuidId,
  setProfileImage,
} from '../../slice/Slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const STORAGE_KEY = '@login_credentials';

const Profile = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileImage, setProfilePic] = useState<string | null>(null); // URL for existing image
  const [selectedImage, setSelectedImage] = useState<any>(null); // Selected image file for upload
  const [loading, setLoading] = useState(true);
  const reduxUserName = useSelector(selectUserName);
  const user_uuid = useSelector(selectUserUuidId);
  const [userUuid, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const getUserId = async () => {
      try {
        const credentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (credentials) {
          const parsedCredentials = JSON.parse(credentials);
          if (parsedCredentials.name) {
            setUserName(parsedCredentials.name);
            setUserId(parsedCredentials.userUuid);
            return;
          }
        }
        // Fallback to Redux if AsyncStorage doesn't have userId
        setUserName(reduxUserName ?? null);
        setUserId(user_uuid ?? null);
      } catch (error) {
        console.warn('Error retrieving user ID from AsyncStorage:', error);
        // Fallback to Redux on error
        setUserName(reduxUserName ?? null);
        setUserId(user_uuid ?? null);
      }
    };

    getUserId();
  }, [reduxUserName, user_uuid]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userUuid) {
        return;
      }

      try {
        setLoading(true); // Show loading while fetching
        const response = await apiHelper({
          method: 'GET',
          endpoint: 'authentication/profile',
        });
        const profile = (
          response as {
            data: {
              full_name?: string;
              email?: string;
              phone_number?: string;
              image?: string;
            };
          }
        ).data;

        if (profile) {
          setFullName(profile.full_name || '');
          setEmail(profile.email || '');
          setPhoneNumber(profile.phone_number || '');
          setProfilePic(profile.image || null); // Set the existing profile image URL
          dispatch(setProfileImage(profile.image || null));
        }
      } catch (error) {
        console.warn('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [dispatch, userUuid]);

  // Handle image selection
  const handleImagePick = () => {
    const options = {
      mediaType: 'photo' as const,
      quality: 1,
    } as any;

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.warn('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to pick an image. Please try again.');
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setSelectedImage({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName || 'profile_image.jpg',
        });
      }
    });
  };

  const handleUpdate = async () => {
    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('email', email);
      formData.append('phone_number', phoneNumber);

      // Append image if a new one was selected
      if (selectedImage) {
        formData.append('image', {
          uri: selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.name,
        });
      }

      const response = await apiHelper({
        method: 'POST',
        endpoint: 'profile?_method=patch',
        data: formData,
      });

      console.log('Profile updated successfully:', response);

      // Refetch the profile data after a successful update using the correct endpoint
      const updatedProfileResponse = await apiHelper({
        method: 'GET',
        endpoint: 'authentication/profile',
      });
      const updatedProfile = (
        updatedProfileResponse as {
          data: {
            full_name?: string;
            email?: string;
            phone_number?: string;
            image?: string;
          };
        }
      ).data;

      if (updatedProfile) {
        setFullName(updatedProfile.full_name || '');
        setEmail(updatedProfile.email || '');
        setPhoneNumber(updatedProfile.phone_number || '');
        setProfileImage(updatedProfile.image || null);
        setSelectedImage(null); // Reset selected image after upload
      }

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      console.warn('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.safeArea, {backgroundColor: theme.whole || '#F5F7FA'}]}>
        <View style={styles.container}>
          <Header title="Profile" onBackPress={() => navigation.goBack()} />
          <Text
            style={{
              textAlign: 'center',
              marginTop: hp(5),
              color: theme.text || '#333',
            }}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView
        style={[styles.safeArea, {backgroundColor: theme.whole || '#F5F7FA'}]}>
        <View style={styles.container}>
          <Header title="Profile" onBackPress={() => navigation.goBack()} />

          {/* Profile Image & Name */}
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
                onPress={handleImagePick}>
                <Icon name="edit" size={wp(5)} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.storeName, {color: theme.text || '#333'}]}>
              {userName || 'Unknown User'}
            </Text>
          </View>

          <View
            style={[
              styles.card,
              {backgroundColor: theme.backgroundColor || '#fff'},
            ]}>
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

            <Text style={[styles.label, {color: theme.text || '#333'}]}>
              Email
            </Text>
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

            <CustomButton title="Update" onPress={handleUpdate} />
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(15),
    resizeMode: 'cover',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#03A7A7',
    borderRadius: wp(10),
    padding: wp(1),
    borderWidth: 2,
    borderColor: '#fff',
  },
  storeName: {
    fontSize: wp(5),
    fontWeight: 'bold',
    marginTop: hp(2),
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: wp(5),
    borderRadius: 12,
  },
  label: {
    fontSize: wp(3.5),
    fontWeight: '500',
    marginBottom: hp(0.5),
    color: '#333',
  },
  input: {
    height: hp(5.5),
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    fontSize: wp(3.5),
    color: '#333',
    marginBottom: hp(1.5),
  },
});

export default Profile;
