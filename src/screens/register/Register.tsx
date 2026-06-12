/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
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
import * as Animatable from 'react-native-animatable';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomButton from '../../components/common/buttons/CustomButton';
import CustomTextInput from '../../components/common/textInput/CustomTextInput';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {useDispatch} from 'react-redux';
import {Formik} from 'formik';
import {registerCustomerValidationSchema} from '@/utils/validation';
import {updateCustomerField} from '../../store/authSlice';
import {ThemeContext} from '../../context/ThemeContext';

const {width, height} = Dimensions.get('window');

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const [countryCode, setCountryCode] = useState<string>('+1'); // Default country code

  const backgroundImage =
    theme.backgroundColor === '#ffffff'
      ? require('../../assets/images/BG.png')
      : require('../../assets/images/dark.png');

  const handleNext = (values: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) => {
    // Concatenate country code with phone number
    const fullPhoneNumber = `${countryCode}${values.phoneNumber}`;

    // Dispatch to Redux store
    dispatch(updateCustomerField({field: 'fullName', value: values.name}));
    dispatch(updateCustomerField({field: 'email', value: values.email}));
    dispatch(
      updateCustomerField({field: 'phoneNumber', value: fullPhoneNumber}),
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
            <Animatable.View
              animation="bounceInDown"
              duration={1000}
              style={styles.logoView}>
              <Image
                source={require('../../assets/images/headerLogo.png')}
                style={styles.logo}
              />
            </Animatable.View>

            <Animatable.Text
              animation="fadeIn"
              duration={800}
              delay={300}
              style={styles.title}>
              Registration
            </Animatable.Text>

            <Animatable.View
              animation="fadeInUp"
              duration={1000}
              delay={300}
              style={{height: hp(65), marginTop: hp(2)}}>
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
                      <Animatable.View
                        animation="fadeIn"
                        duration={800}
                        delay={600}>
                        <CustomTextInput
                          placeholder="Full Name"
                          value={values.name}
                          onChangeText={text =>
                            handleChange('name')(text as string)
                          }
                        />
                      </Animatable.View>
                      {touched.name && errors.name && (
                        <Animatable.Text
                          animation="shake"
                          duration={500}
                          style={styles.errorText}>
                          {errors.name}
                        </Animatable.Text>
                      )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        Email
                      </Text>
                      <Animatable.View
                        animation="fadeIn"
                        duration={800}
                        delay={800}>
                        <CustomTextInput
                          placeholder="Email"
                          value={values.email}
                          onChangeText={text =>
                            handleChange('email')(text as string)
                          }
                        />
                      </Animatable.View>
                      {touched.email && errors.email && (
                        <Animatable.Text
                          animation="shake"
                          duration={500}
                          style={styles.errorText}>
                          {errors.email}
                        </Animatable.Text>
                      )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        Phone Number (select country code)
                      </Text>
                      <Animatable.View
                        animation="fadeIn"
                        duration={800}
                        delay={1000}>
                        <CustomTextInput
                          placeholder="Phone Number"
                          isPhoneNumber
                          value={values.phoneNumber}
                          onChangeText={text =>
                            handleChange('phoneNumber')(text as string)
                          }
                          onCountryCodeChange={setCountryCode}
                        />
                      </Animatable.View>
                      {touched.phoneNumber && errors.phoneNumber && (
                        <Animatable.Text
                          animation="shake"
                          duration={500}
                          style={styles.errorText}>
                          {errors.phoneNumber}
                        </Animatable.Text>
                      )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        Password
                      </Text>
                      <Animatable.View
                        animation="fadeIn"
                        duration={800}
                        delay={1200}>
                        <CustomTextInput
                          placeholder="Password"
                          secureTextEntry
                          value={values.password}
                          onChangeText={text =>
                            handleChange('password')(text as string)
                          }
                        />
                      </Animatable.View>
                      {touched.password && errors.password && (
                        <Animatable.Text
                          animation="shake"
                          duration={500}
                          style={styles.errorText}>
                          {errors.password}
                        </Animatable.Text>
                      )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        Confirm Password
                      </Text>
                      <Animatable.View
                        animation="fadeIn"
                        duration={800}
                        delay={1400}>
                        <CustomTextInput
                          placeholder="Confirm Password"
                          secureTextEntry
                          value={values.confirmPassword}
                          onChangeText={text =>
                            handleChange('confirmPassword')(text as string)
                          }
                        />
                      </Animatable.View>
                      {touched.confirmPassword && errors.confirmPassword && (
                        <Animatable.Text
                          animation="shake"
                          duration={500}
                          style={styles.errorText}>
                          {errors.confirmPassword}
                        </Animatable.Text>
                      )}

                      <Animatable.View
                        animation="pulse"
                        iterationCount={1}
                        duration={1000}>
                        <CustomButton title="Next" onPress={handleSubmit} />
                      </Animatable.View>
                    </>
                  )}
                </Formik>
              </ScrollView>
            </Animatable.View>
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
