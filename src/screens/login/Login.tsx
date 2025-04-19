/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomButton from '../../components/common/buttons/CustomButton';
import CustomTextInput from '../../components/common/textInput/CustomTextInput';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {useDispatch} from 'react-redux';
import {setUser} from '../../slice/Slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {auth} from '../../../FirebaseConfig';
import {signInWithCustomToken} from '@react-native-firebase/auth';
import {initializeFCM} from '../../components/helperUtils/notifications/FCMTokenManager';
import CustomErrorModal from '../../components/common/errorModal/CustomErrorModal';

const {width, height} = Dimensions.get('window');

// Validation schema
const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

// AsyncStorage keys
const STORAGE_KEY = '@login_credentials';
const TOKEN_KEY = 'userToken';

// TypeScript interfaces
interface UserData {
  role: string;
  userId: number;
  token: string;
  firebaseUid: string;
  username: string;
  serviceProviderUuid?: string;
  servicesOffered?: string[];
  user_uuid?: string;
  id?: number;
}

interface ApiResponse {
  data: {
    user?: {id: number; roles: string[]; user_uuid: string};
    id?: number;
    roles?: string[];
    full_name?: string;
    service_provider_name?: string;
    service_provider_uuid?: string;
    services_offered?: string[];
    user_uuid?: string;
  };
  meta: {token: string; firebase_token: string};
}

const Login: React.FC = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [unsubscribeFCM, setUnsubscribeFCM] = useState<(() => void) | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Modal state
  const [errorMessage, setErrorMessage] = useState<string>(''); // Error message state
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const {theme} = useContext(ThemeContext);
  const backgroundImage =
    theme.backgroundColor === '#ffffff'
      ? require('../../assets/images/BG.png')
      : require('../../assets/images/dark.png');

  // Check for stored credentials to auto-login
  useEffect(() => {
    const checkCredentials = async () => {
      try {
        const credentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (credentials) {
          navigation.replace('Subscription');
        }
      } catch (error: unknown) {
        console.log('Error checking credentials:', error);
      }
    };
    checkCredentials();
  }, [navigation]);

  // Cleanup FCM listeners
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
        endpoint: 'authentication/login/',
        data: values,
      });

      const {data, meta} = response;
      console.log('Login response:', response);

      // Determine user role
      const isCustomer = data.roles?.includes('customer');
      const roles = isCustomer ? data.roles : data.user?.roles;

      // Check if the role is service_provider
      if (roles?.includes('service_provider')) {
        setErrorMessage('Invalid credentials.');
        setModalVisible(true); // Show modal instead of Alert
        return;
      }

      // Proceed with Firebase authentication
      console.log('Firebase token:', meta.firebase_token);
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

      const userData: UserData = {
        role: roles?.[0] || 'unknown',
        userId: userId || 0,
        token: meta.token,
        firebaseUid,
        username: name || '',
        user_uuid: userUuid || '',
        ...(roles?.includes('service_provider') && {
          serviceProviderUuid: data.service_provider_uuid,
          servicesOffered: data.services_offered,
          id: data.id,
        }),
      };

      dispatch(setUser(userData));
      console.log('User data:', userData);

      if (isChecked) {
        const storageData = {
          email: values.email,
          password: values.password,
          userId,
          role: roles?.[0],
          user_uuid: firebaseUid,
          userUuid: userUuid,
          name,
          ...(roles?.includes('service_provider') && {
            serviceProviderUuid: data.service_provider_uuid,
            servicesOffered: data.services_offered,
            id: data.id,
          }),
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }

      // Initialize FCM
      const unsubscribe = initializeFCM(isChecked, navigation, dispatch);
      setUnsubscribeFCM(() => unsubscribe);

      navigation.replace('Subscription');
    } catch (error: unknown) {
      console.warn('Login error:', error);
      let localErrorMessage = 'Login failed. Please check your credentials.';
      if ((error as any).code) {
        switch ((error as any).code) {
          case 'auth/invalid-custom-token':
            localErrorMessage =
              'Invalid authentication token. Please try again.';
            break;
          case 'auth/network-request-failed':
            localErrorMessage = 'Network error. Please check your connection.';
            break;
          case 'auth/internal-error':
            localErrorMessage =
              'Firebase internal error. Please contact support.';
            break;
          default:
            localErrorMessage = `Firebase error: ${(error as any).message}`;
        }
      } else if ((error as any).message) {
        localErrorMessage = (error as any).message;
      }
      setErrorMessage(localErrorMessage);
      setModalVisible(true); // Show modal for other errors
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
      <ImageBackground source={backgroundImage} style={styles.background}>
        <View style={styles.logoView}>
          <Image
            source={require('../../assets/images/headerLogo.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <Formik
            initialValues={{email: '', password: ''}}
            validationSchema={loginValidationSchema}
            onSubmit={handleLogin}>
            {({handleChange, handleSubmit, values, errors, touched}) => (
              <View>
                <Text style={[styles.label, {color: theme.text}]}>Email</Text>
                <CustomTextInput
                  placeholder="Email"
                  value={values.email}
                  onChangeText={text => handleChange('email')(text as string)}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <Text style={[styles.label, {color: theme.text}]}>
                  Password
                </Text>
                <CustomTextInput
                  placeholder="Password"
                  secureTextEntry
                  value={values.password}
                  onChangeText={text =>
                    handleChange('password')(text as string)
                  }
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <View style={styles.options}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setIsChecked(!isChecked)}>
                    <View
                      style={[
                        styles.checkbox,
                        isChecked && styles.checkboxChecked,
                      ]}>
                      {isChecked && (
                        <Icon
                          name="checkmark"
                          size={wp(3)}
                          color="#fff"
                          type="ionicon"
                        />
                      )}
                    </View>
                    <Text style={[styles.rememberText, {color: theme.text}]}>
                      Remember me
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Forget')}>
                    <Text style={[styles.forgotText, {color: theme.text}]}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>

                <CustomButton title="Login" onPress={handleSubmit} />
              </View>
            )}
          </Formik>
          <View style={styles.footer}>
            <Text style={[styles.footerText, {color: theme.text}]}>
              Don’t have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Options')}>
              <Text style={styles.registerText}>Register here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Render Custom Error Modal */}
      <CustomErrorModal
        visible={modalVisible}
        message={errorMessage}
        onClose={() => setModalVisible(false)}
        theme={theme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {width, height},
  container: {flex: 1, paddingHorizontal: wp(5)},
  logoView: {alignSelf: 'center', marginTop: hp(5), marginBottom: hp(13)},
  logo: {width: wp(50), height: hp(15), resizeMode: 'contain'},
  title: {
    fontSize: wp(7),
    fontWeight: 'bold',
    color: '#ff00a7',
    alignSelf: 'center',
    marginBottom: hp(2),
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: hp(2),
    alignSelf: 'center',
  },
  rememberText: {fontSize: wp(4), color: '#333'},
  forgotText: {fontSize: wp(3), color: '#333', textDecorationLine: 'underline'},
  footer: {flexDirection: 'row', justifyContent: 'center', marginTop: hp(1)},
  footerText: {fontSize: wp(3), color: '#333'},
  registerText: {
    color: '#ff00a7',
    fontSize: wp(3),
    textDecorationLine: 'underline',
  },
  checkboxContainer: {flexDirection: 'row', alignItems: 'center'},
  checkbox: {
    width: hp(2),
    height: hp(2),
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: wp(1),
    marginRight: wp(2),
  },
  checkboxChecked: {backgroundColor: '#03A7A7'},
  label: {
    fontSize: wp(3.5),
    color: '#333',
    marginTop: hp(1.5),
    fontWeight: '500',
    marginLeft: wp(5),
  },
  errorText: {
    color: 'red',
    fontSize: wp(3),
    marginLeft: wp(5),
    marginTop: hp(0.5),
  },
});

export default Login;
