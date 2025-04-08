/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
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
import {signInWithCustomToken} from 'firebase/auth';
import {initializeFCM} from '../../components/helperUtils/notifications/FCMTokenManager';

const {width, height} = Dimensions.get('window');

const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const STORAGE_KEY = '@login_credentials';
const TOKEN_KEY = 'userToken';

const Login: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [unsubscribeFCM, setUnsubscribeFCM] = useState<(() => void) | null>(
    null,
  );
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
    AsyncStorage.getItem(STORAGE_KEY)
      .then(credentials => {
        if (credentials) {
          navigation.replace('Subscription');
        }
      })
      .catch(error => console.log('Error checking credentials:', error));
  }, [navigation]);

  // Cleanup FCM listeners when the component unmounts
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
      const response = await apiHelper({
        method: 'POST',
        endpoint: 'authentication/login/',
        data: values,
      });
      const {data, meta} = response as {
        data: {
          user?: {id: number; roles: string[]};
          id?: number;
          roles?: string[];
          service_provider_uuid?: string;
          services_offered?: string[];
        };
        meta: {token: string; firebase_token: string};
      };

      await AsyncStorage.setItem(TOKEN_KEY, meta.token);

      const userCredential = await signInWithCustomToken(
        auth,
        meta.firebase_token,
      );
      const firebaseUid = userCredential.user.uid;

      const isCustomer = data.roles?.includes('customer');
      const userId = isCustomer ? data.id : data.user?.id;
      const roles = isCustomer ? data.roles : data.user?.roles;

      const userData = {
        role: roles?.[0] || 'unknown',
        userId: userId || 0,
        token: meta.token,
        firebaseUid,
        ...(roles?.includes('service_provider') && {
          serviceProviderUuid: data.service_provider_uuid,
          servicesOffered: data.services_offered,
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
          ...(roles?.includes('service_provider') && {
            serviceProviderUuid: data.service_provider_uuid,
            servicesOffered: data.services_offered,
          }),
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }

      // Initialize FCM after successful login
      const unsubscribe = initializeFCM(isChecked, navigation, dispatch);
      setUnsubscribeFCM(() => unsubscribe); // Store the unsubscribe function in state

      navigation.replace('Subscription');
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.message === 'Firebase sign-in failed'
          ? 'Firebase authentication failed.'
          : 'Login failed.',
      );
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
