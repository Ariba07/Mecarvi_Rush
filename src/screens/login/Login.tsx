/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  ImageBackground,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {useDispatch} from 'react-redux';
import {setUser, setProfileImage} from '../../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeContext} from '../../context/ThemeContext';
import {auth} from '../../services/firebase';
import {signInWithCustomToken} from '@react-native-firebase/auth';
import {initializeFCM} from '@/services/notifications';
import {apiHelper} from '../../services/api';
import LoginForm from './LoginForm';
import FooterSection from './FooterSection';
import {STORAGE_KEY, TOKEN_KEY, UserData, ApiResponse} from './types';
import {styles} from '../../assets/styles/login/LoginStyles';
import CustomModal from '../../components/common/errorModal/CustomModal';

const FIRST_LOGIN_KEY = '@first_login';

interface ActionResult {
  success: boolean;
  error?: {
    title: string;
    message: string;
  };
}

const Login: React.FC = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [unsubscribeFCM, setUnsubscribeFCM] = useState<(() => void) | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('Error');
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
          const firstLogin = await AsyncStorage.getItem(FIRST_LOGIN_KEY);
          navigation.replace(firstLogin === null ? 'Subscription' : 'Drawer');
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

  const handleLogin = async (values: {
    email: string;
    password: string;
  }): Promise<ActionResult> => {
    setIsLoading(true);
    try {
      const response = await apiHelper<ApiResponse>({
        method: 'POST',
        endpoint: 'authentication/login',
        data: values,
      });
      const {data, meta} = response;
      const roles = data.roles;
      if (!meta.firebase_token) {
        throw new Error('No Firebase token received from backend');
      }
      await AsyncStorage.setItem(TOKEN_KEY, meta.token);
      const userCredential = await signInWithCustomToken(
        auth,
        meta.firebase_token,
      );
      const firebaseUid = userCredential.user.uid;
      const userId = data.id;
      const name = data.full_name;
      const userUuid = data.user_uuid;
      const subscriptionStatus = data.subscription_status;
      const userData: UserData = {
        role: roles?.[0] || 'customer',
        userId: userId || 0,
        token: meta.token,
        firebaseUid,
        username: name || '',
        walletBalance: data.wallet?.balance || 0,
        pointsEarned: data.wallet?.points_earned || 0,
        pointsUsed: data.wallet?.points_used || 0,
        subscriptionStatus: subscriptionStatus || '',
        user_uuid: userUuid || '',
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
          }),
        );
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
      const unsubscribe = initializeFCM(isChecked, navigation, dispatch);
      setUnsubscribeFCM(() => unsubscribe);
      const firstLogin = await AsyncStorage.getItem(FIRST_LOGIN_KEY);
      if (firstLogin === null) {
        await AsyncStorage.setItem(FIRST_LOGIN_KEY, 'completed');
        navigation.replace('Subscription');
      } else {
        navigation.replace('Drawer');
      }
      return {success: true};
    } catch (error: any) {
      console.log('Login error:', error);
      return {
        success: false,
        error: {
          title: 'Error',
          message: error.message || 'Failed to login. Please try again.',
        },
      };
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: {email: string; password: string}) => {
    const result = await handleLogin(values);
    if (!result.success && result.error) {
      setModalTitle(result.error.title);
      setModalMessage(result.error.message);
      setModalVisible(true);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.backgroundColor || '#fff'}}>
      <ImageBackground source={backgroundImage} style={styles.background}>
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.text || '#333'} />
          </View>
        )}
        <Animatable.View
          animation="bounceInDown"
          duration={1000}
          style={styles.logoView}>
          <Image
            source={require('../../assets/images/headerLogo.png')}
            style={styles.logo}
          />
        </Animatable.View>
        <Animatable.View
          animation="fadeInUp"
          duration={1000}
          delay={300}
          style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <LoginForm
            onSubmit={onSubmit}
            isChecked={isChecked}
            setIsChecked={setIsChecked}
            isLoading={isLoading}
          />
          <FooterSection />
          <CustomModal
            visible={modalVisible}
            title={modalTitle}
            message={modalMessage}
            onClose={() => setModalVisible(false)}
          />
        </Animatable.View>
      </ImageBackground>
    </View>
  );
};

export default Login;
