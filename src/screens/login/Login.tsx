/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {View, ImageBackground, Image, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {useDispatch} from 'react-redux';
import {setUser, setProfileImage} from '../../slice/Slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {auth} from '../../../FirebaseConfig';
import {signInWithCustomToken} from '@react-native-firebase/auth';
import {initializeFCM} from '../../components/helperUtils/notifications/FCMTokenManager';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import CustomErrorModal from '../../components/common/errorModal/CustomErrorModal';
import LoginForm from './LoginForm';
import FooterSection from './FooterSection';
import {STORAGE_KEY, TOKEN_KEY, UserData, ApiResponse} from './types';
import {styles} from '../../assets/styles/login/LoginStyles';

const Login: React.FC = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [unsubscribeFCM, setUnsubscribeFCM] = useState<(() => void) | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const {theme} = useContext(ThemeContext);
  const backgroundImage =
    theme.backgroundColor === '#ffffff'
      ? require('../../assets/images/BG.png')
      : require('../../assets/images/dark.png');

  useEffect(() => {
    const checkCredentials = async () => {
      try {
        const credentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (credentials) {
          navigation.replace('Subscription');
        }
      } catch (error) {
        console.log('Error checking credentials:', error);
      }
    };
    checkCredentials();
  }, [navigation]);

  useEffect(() => {
    return () => {
      if (unsubscribeFCM) {
        unsubscribeFCM();
        console.log('FCM listeners unsubscribed on Login unmount');
      }
    };
  }, [unsubscribeFCM]);

  const handleLogin = async (values: {email: string; password: string}) => {
    try {
      const response = await apiHelper<ApiResponse>({
        method: 'POST',
        endpoint: 'authentication/login',
        data: values,
      });
      const {data, meta} = response;
      const isCustomer = data.roles?.includes('customer');
      const roles = isCustomer ? data.roles : data.user?.roles;
      if (roles?.includes('service_provider')) {
        setErrorMessage('Invalid credentials.');
        setModalVisible(true);
        return;
      }
      if (!meta.firebase_token) {
        throw new Error('No Firebase token received from backend');
      }
      await AsyncStorage.setItem(TOKEN_KEY, meta.token);
      const userCredential = await signInWithCustomToken(
        auth,
        meta.firebase_token,
      );
      const firebaseUid = userCredential.user.uid;
      const userId = isCustomer ? data.id : data.user?.id;
      const name = isCustomer ? data.full_name : data.service_provider_name;
      const userUuid = isCustomer ? data.user_uuid : data.user?.user_uuid;
      const subscriptionStatus = isCustomer
        ? data.subscription_status
        : data.user?.subscription_status;
      const userData: UserData = {
        role: roles?.[0] || 'unknown',
        userId: userId || 0,
        token: meta.token,
        firebaseUid,
        username: name || '',
        walletBalance: data.wallet?.balance || 0,
        pointsEarned: data.wallet?.points_earned || 0,
        pointsUsed: data.wallet?.points_used || 0,
        subscriptionStatus: subscriptionStatus || '',
        user_uuid: userUuid || '',
        ...(roles?.includes('service_provider') && {
          serviceProviderUuid: data.service_provider_uuid,
          servicesOffered: data.services_offered,
          id: data.id,
        }),
      };
      dispatch(setUser(userData));
      const profileImage = data.image || null;
      dispatch(setProfileImage(profileImage));
      if (isChecked) {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            email: values.email,
            password: values.password,
            userId,
            role: roles?.[0],
            user_uuid: firebaseUid,
            userUuid,
            walletBalance: data.wallet?.balance,
            pointsEarned: data.wallet?.points_earned,
            pointsUsed: data.wallet?.points_used,
            subscriptionStatus,
            name,
            ...(roles?.includes('service_provider') && {
              serviceProviderUuid: data.service_provider_uuid,
              servicesOffered: data.services_offered,
              id: data.id,
            }),
          }),
        );
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
      const unsubscribe = initializeFCM(isChecked, navigation, dispatch);
      setUnsubscribeFCM(() => unsubscribe);
      navigation.replace('Subscription');
    } catch (error: any) {
      const localErrorMessage = error.code
        ? {
            'auth/invalid-custom-token':
              'Invalid authentication token. Please try again.',
            'auth/network-request-failed':
              'Network error. Please check your connection.',
            'auth/internal-error':
              'Firebase internal error. Please contact support.',
          }[error.code as string] || `Firebase error: ${error.message}`
        : error.message || 'Login failed. Please check your credentials.';
      setErrorMessage(localErrorMessage);
      setModalVisible(true);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.backgroundColor || '#fff'}}>
      <ImageBackground source={backgroundImage} style={styles.background}>
        <View style={styles.logoView}>
          <Image
            source={require('../../assets/images/headerLogo.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <LoginForm
            onSubmit={handleLogin}
            isChecked={isChecked}
            setIsChecked={setIsChecked}
          />
          <FooterSection />
        </View>
      </ImageBackground>
      <CustomErrorModal
        visible={modalVisible}
        message={errorMessage}
        onClose={() => setModalVisible(false)}
        theme={theme}
      />
    </View>
  );
};

export default Login;
