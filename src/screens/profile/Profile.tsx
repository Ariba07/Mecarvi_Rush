/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectUserName,
  selectUserUuidId,
  setProfileImage,
} from '../../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {ThemeContext} from '../../context/ThemeContext';
import {apiHelper} from '../../services/api';
import Header from '../../components/common/header/Header';
import ProfileHeader from './ProfileHeader';
import ProfileForm from './ProfileForm';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {STORAGE_KEY} from '../login/types';
import {styles} from '../../assets/styles/profile/ProfileStyles';
import * as Animatable from 'react-native-animatable';
import CustomModal from '../../components/common/errorModal/CustomModal';

interface ActionResult {
  success: boolean;
  data?: any;
  error?: {
    title: string;
    message: string;
  };
}

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
  const [userName, setUserName] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('Error');

  useEffect(() => {
    const getUserId = async () => {
      try {
        const credentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (credentials) {
          const parsedCredentials = JSON.parse(credentials);
          setUserName(parsedCredentials.name || reduxUserName);
        } else {
          setUserName(reduxUserName ?? null);
        }
      } catch (error) {
        setUserName(reduxUserName ?? null);
      }
    };
    getUserId();
  }, [reduxUserName, user_uuid]);

  useEffect(() => {
    const fetchProfileData = async () => {
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
  }, [dispatch]);

  const handleImagePick = async (): Promise<ActionResult> => {
    const options = {mediaType: 'photo' as const, quality: 1} as any;
    return new Promise(resolve => {
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
          resolve({success: false});
        } else if (response.errorCode) {
          resolve({
            success: false,
            error: {
              title: 'Error',
              message: 'Failed to pick an image. Please try again.',
            },
          });
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setSelectedImage({
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName || 'profile_image.jpg',
          });
          resolve({success: true});
        } else {
          resolve({success: false});
        }
      });
    });
  };

  const onImagePick = async () => {
    const result = await handleImagePick();
    if (!result.success && result.error) {
      setModalTitle(result.error.title);
      setModalMessage(result.error.message);
      setModalVisible(true);
    }
  };

  const handleUpdate = async (): Promise<ActionResult> => {
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
      return {
        success: true,
        data: updatedProfile,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Failed to update profile. Please try again.',
        },
      };
    }
  };

  const onUpdate = async () => {
    const result = await handleUpdate();
    if (result.success) {
      setModalTitle('Success');
      setModalMessage('Profile updated successfully!');
      setModalVisible(true);
    } else if (result.error) {
      setModalTitle(result.error.title);
      setModalMessage(result.error.message);
      setModalVisible(true);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.safeArea, {backgroundColor: theme.whole || '#F5F7FA'}]}>
        <View style={styles.container}>
          <Header title="Profile" onBackPress={() => navigation.goBack()} />
          <Animatable.Text
            animation="fadeIn"
            duration={800}
            style={{
              textAlign: 'center',
              marginTop: hp(5),
              color: theme.text || '#333',
            }}>
            Loading...
          </Animatable.Text>
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
            onImagePick={onImagePick}
          />
          <ProfileForm
            fullName={fullName}
            email={email}
            phoneNumber={phoneNumber}
            setFullName={setFullName}
            setEmail={setEmail}
            setPhoneNumber={setPhoneNumber}
            onUpdate={onUpdate}
          />
          <CustomModal
            visible={modalVisible}
            title={modalTitle}
            message={modalMessage}
            onClose={() => setModalVisible(false)}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Profile;
