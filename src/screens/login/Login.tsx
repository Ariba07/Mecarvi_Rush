/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
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

const {width, height} = Dimensions.get('window');

// **Validation Schema**
const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const STORAGE_KEY = '@login_credentials';

const Login: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({email: '', password: ''});
  const {theme} = useContext(ThemeContext); // Access theme

  useEffect(() => {
    const checkCredentials = async () => {
      try {
        const savedCredentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedCredentials) {
          // If credentials exist, assume user is authenticated and navigate
          navigation.replace('Subscription');
        }
      } catch (error) {
        console.log('Error checking credentials:', (error as any)?.message);
      }
    };
    checkCredentials();
  }, [navigation]); // Empty dependency array

  const handleLogin = async (values: {email: string; password: string}) => {
    try {
      const response = await apiHelper({
        method: 'POST',
        endpoint: 'authentication/login/',
        data: values,
      });

      navigation.replace('Subscription');
      const data = response as {data: {user: {id: number; roles: string[]}}};
      dispatch(
        setUser({
          role: data.data.user.roles[0],
          userId: data.data.user.id,
        }),
      );

      // Store credentials, userId, and role in AsyncStorage if "Remember me" is checked
      if (isChecked) {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            email: values.email,
            password: values.password,
            userId: data.data.user.id, // Add userId
            role: data.data.user.roles[0], // Add role
          }),
        );
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.log((error as any)?.message);
      Alert.alert('Error', 'Login failed. Please check your credentials.');
    }
  };

  // Determine the background image based on the theme
  const backgroundImage =
    theme.backgroundColor === '#ffffff'
      ? require('../../assets/images/BG.png') // Light theme
      : require('../../assets/images/dark.png'); // Dark theme

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              initialValues={initialValues}
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
                    secureTextEntry={true}
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
                        <Icon
                          name="checkmark"
                          size={Platform.OS === 'ios' ? wp(4) : wp(3)}
                          color={'#ffffff'}
                          type="ionicon"
                        />
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
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Options')}>
                <Text style={styles.registerText}>Register here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: {
    width: width,
    height: height,
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  logoView: {
    alignSelf: 'center',
    marginTop: Platform.OS === 'ios' ? hp(8) : hp(5),
    marginBottom: Platform.OS === 'ios' ? hp(11) : hp(13),
  },
  logo: {
    width: Platform.OS === 'ios' ? wp(45) : wp(50),
    height: hp(15),
    resizeMode: 'contain',
  },
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
  rememberText: {
    fontSize: wp(4),
    color: '#333',
  },
  forgotText: {
    fontSize: wp(3),
    color: '#333333',
    textDecorationLine: 'underline',
    top: wp(-5),
  },
  footerText: {
    fontSize: wp(3),
    alignSelf: 'center',
    marginRight: wp(1),
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: hp(1),
  },
  registerText: {
    color: '#ff00a7',
    fontSize: wp(3),
    textDecorationLine: 'underline',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: hp(2),
    height: hp(2),
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: wp(1),
    marginRight: wp(2),
    backgroundColor: '#FFF',
    marginLeft: wp(1),
  },
  checkboxChecked: {
    backgroundColor: '#03A7A7',
  },
  label: {
    fontSize: wp(3.5),
    color: '#333',
    marginTop: hp(1.5),
    fontWeight: '500',
    width: '80%',
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
