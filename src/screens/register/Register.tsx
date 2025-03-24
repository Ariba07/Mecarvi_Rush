/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomButton from '../../components/common/buttons/CustomButton';
import CustomTextInput from '../../components/common/textInput/CustomTextInput';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {useDispatch} from 'react-redux';
import {Formik} from 'formik';
import {registerCustomerValidationSchema} from '../../components/helperUtils/validations/validationSchema';
import {updateCustomerField} from '../../slice/Slice';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

const {width, height} = Dimensions.get('window'); // Get screen dimensions

const Register = () => {
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext); // Access theme

  // Determine the background image based on the theme
  const backgroundImage =
    theme.backgroundColor === '#ffffff'
      ? require('../../assets/images/BG.png') // Light theme
      : require('../../assets/images/dark.png'); // Dark theme

  const handleNext = (values: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) => {
    // Dispatch each field to Redux store
    dispatch(updateCustomerField({field: 'fullName', value: values.name}));
    dispatch(updateCustomerField({field: 'email', value: values.email}));
    dispatch(
      updateCustomerField({field: 'phoneNumber', value: values.phoneNumber}),
    );
    dispatch(updateCustomerField({field: 'password', value: values.password}));

    // Navigate to the next screen
    navigation.navigate('Upload');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
        <ImageBackground source={backgroundImage} style={styles.background}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <View style={styles.logoView}>
              <Image
                source={require('../../assets/images/headerLogo.png')}
                style={styles.logo}
              />
            </View>

            <Text style={styles.title}>Registration</Text>

            <View style={{height: hp(65), marginTop: hp(2)}}>
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <Formik
                  initialValues={{
                    name: '',
                    email: '',
                    phoneNumber: '',
                    password: '',
                    confirmPassword: '',
                  }}
                  validationSchema={registerCustomerValidationSchema}
                  onSubmit={handleNext}>
                  {({handleChange, handleSubmit, values, errors, touched}) => (
                    <>
                      <Text style={[styles.label, {color: theme.text}]}>
                        Full Name
                      </Text>
                      <CustomTextInput
                        placeholder="Full Name"
                        value={values.name}
                        onChangeText={text =>
                          handleChange('name')(text as string)
                        }
                      />
                      {touched.name && errors.name && (
                        <Text style={styles.errorText}>{errors.name}</Text>
                      )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        Email
                      </Text>
                      <CustomTextInput
                        placeholder="Email"
                        value={values.email}
                        onChangeText={text =>
                          handleChange('email')(text as string)
                        }
                      />
                      {touched.email && errors.email && (
                        <Text style={styles.errorText}>{errors.email}</Text>
                      )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        Phone Number
                      </Text>
                      <CustomTextInput
                        placeholder="Phone Number"
                        value={values.phoneNumber}
                        onChangeText={text =>
                          handleChange('phoneNumber')(text as string)
                        }
                      />
                      {touched.phoneNumber && errors.phoneNumber && (
                        <Text style={styles.errorText}>
                          {errors.phoneNumber}
                        </Text>
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

                      <Text style={[styles.label, {color: theme.text}]}>
                        Confirm Password
                      </Text>
                      <CustomTextInput
                        placeholder="Confirm Password"
                        secureTextEntry
                        value={values.confirmPassword}
                        onChangeText={text =>
                          handleChange('confirmPassword')(text as string)
                        }
                      />
                      {touched.confirmPassword && errors.confirmPassword && (
                        <Text style={styles.errorText}>
                          {errors.confirmPassword}
                        </Text>
                      )}

                      {/* Register Button */}
                      <CustomButton title="Next" onPress={handleSubmit} />
                    </>
                  )}
                </Formik>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: hp(35),
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
  },
  label: {
    fontSize: wp(3.5),
    color: '#333',
    marginTop: hp(1),
    fontWeight: '500',
    width: '80%',
    marginLeft: wp(5),
  },
  errorText: {
    color: 'red',
    fontSize: wp(3),
    marginLeft: wp(5),
  },
});

export default Register;
