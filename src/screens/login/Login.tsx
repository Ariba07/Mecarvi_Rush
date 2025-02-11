/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
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

const {width, height} = Dimensions.get('window'); // Get screen dimensions

// **Validation Schema**
const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const [isChecked, setIsChecked] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = (values: {email: string; password: string}) => {
    console.log('Login with:', values);
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
        <ImageBackground
          source={require('../../assets/images/BG.png')}
          style={styles.background}>
          <View style={styles.logoView}>
            <Image
              source={require('../../assets/images/headerLogo.png')}
              style={styles.logo}
            />
          </View>
          <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            {/* Formik for Form Handling */}
            <Formik
              initialValues={{email: '', password: ''}}
              validationSchema={loginValidationSchema}
              onSubmit={handleLogin}>
              {({handleChange, handleSubmit, values, errors, touched}) => (
                <View>
                  {/* Email Field */}
                  <Text style={styles.label}>Email</Text>
                  <CustomTextInput
                    placeholder="email" // Ensures lowercase first letter
                    value={values.email}
                    onChangeText={handleChange('email')}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  {/* Password Field */}
                  <Text style={styles.label}>Password</Text>
                  <CustomTextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    value={values.password}
                    onChangeText={handleChange('password')}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  {/* Remember Me and Forgot Password */}
                  <View style={styles.options}>
                    <TouchableOpacity
                      style={styles.checkboxContainer}
                      onPress={toggleCheckbox}>
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
                          style={{alignItems: 'center'}}
                        />
                      </View>
                      <Text style={styles.rememberText}>Remember me</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Forget')}>
                      <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Login Button */}
                  <CustomButton title="Login" onPress={handleSubmit} />
                </View>
              )}
            </Formik>

            {/* Footer Section */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
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
