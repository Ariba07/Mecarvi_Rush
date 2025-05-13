/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectUserName,
  selectUserUuidId,
  setProfileImage,
} from '../../slice/Slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import Header from '../../components/common/header/Header';
import ProfileHeader from './ProfileHeader';
import ProfileForm from './ProfileForm';

import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {STORAGE_KEY} from '../login/types';
import {styles} from '../../assets/styles/profile/ProfileStyles';

const Profile: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const reduxUserName = useSelector(selectUserName);
  const user_uuid = useSelector(selectUserUuidId);
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileImage, setProfilePic] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userUuid, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const credentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (credentials) {
          const parsedCredentials = JSON.parse(credentials);
          setUserName(parsedCredentials.name || reduxUserName);
          setUserId(parsedCredentials.userUuid || user_uuid);
        } else {
          setUserName(reduxUserName ?? null);
          setUserId(user_uuid ?? null);
        }
      } catch (error) {
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
        setLoading(true);
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
          setProfilePic(profile.image || null);
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

  const handleImagePick = () => {
    const options = {mediaType: 'photo' as const, quality: 1} as any;
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
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
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('email', email);
      formData.append('phone_number', phoneNumber);
      if (selectedImage) {
        formData.append('image', {
          uri: selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.name,
        });
      }
      await apiHelper({
        method: 'POST',
        endpoint: 'profile?_method=patch',
        data: formData,
      });
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
        setProfilePic(updatedProfile.image || null);
        setSelectedImage(null);
      }
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
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
          <ProfileHeader
            userName={userName}
            profileImage={profileImage}
            selectedImage={selectedImage}
            onImagePick={handleImagePick}
          />
          <ProfileForm
            fullName={fullName}
            email={email}
            phoneNumber={phoneNumber}
            setFullName={setFullName}
            setEmail={setEmail}
            setPhoneNumber={setPhoneNumber}
            onUpdate={handleUpdate}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Profile;
