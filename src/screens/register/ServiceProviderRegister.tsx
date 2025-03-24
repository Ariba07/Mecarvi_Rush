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
import {Formik} from 'formik';
import {registerValidationSchema} from '../../components/helperUtils/validations/validationSchema';
import {updateBusinessField} from '../../slice/Slice';
import {useDispatch} from 'react-redux';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

const {width, height} = Dimensions.get('window');

const ServiceProviderRegister = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const dispatch = useDispatch();
  useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext); // Access theme

  // Determine the background image based on the theme
  const backgroundImage =
    theme.backgroundColor === '#ffffff'
      ? require('../../assets/images/BG.png') // Light theme
      : require('../../assets/images/dark.png'); // Dark theme

  const handleNext = (values: any) => {
    // Dispatch all business-related fields
    dispatch(updateBusinessField({field: 'name', value: values.name}));
    dispatch(
      updateBusinessField({
        field: 'registrationNumber',
        value: values.registrationNumber,
      }),
    );
    dispatch(
      updateBusinessField({
        field: 'stateRegistration',
        value: values.stateRegistration,
      }),
    );
    dispatch(updateBusinessField({field: 'tin', value: values.tin}));
    dispatch(
      updateBusinessField({
        field: 'businessStructure',
        value: values.businessStructure,
      }),
    );
    dispatch(
      updateBusinessField({
        field: 'yearEstablished',
        value: values.yearEstablished,
      }),
    );
    dispatch(updateBusinessField({field: 'address', value: values.address}));
    dispatch(
      updateBusinessField({field: 'phoneNumber', value: values.phoneNumber}),
    );
    dispatch(updateBusinessField({field: 'email', value: values.email}));
    dispatch(updateBusinessField({field: 'website', value: values.website}));

    // Navigate to the next screen
    navigation.navigate('ServiceProviderRegister1');
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
            <Text style={styles.subTitle}>
              Basic Service Provider Information
            </Text>

            <View style={{height: hp(65), marginTop: hp(2)}}>
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <Formik
                  initialValues={{
                    name: '',
                    registrationNumber: '',
                    stateRegistration: '',
                    tin: '',
                    businessStructure: '',
                    yearEstablished: '',
                    address: '',
                    phoneNumber: '',
                    email: '',
                    website: '',
                  }}
                  validationSchema={registerValidationSchema}
                  onSubmit={handleNext}>
                  {({handleChange, handleSubmit, values, errors, touched}) => (
                    <>
                      <Text style={[styles.label, {color: theme.text}]}>
                        Company Name
                      </Text>
                      <CustomTextInput
                        placeholder="Company Name"
                        value={values.name}
                        onChangeText={text =>
                          handleChange('name')(text as string)
                        }
                      />
                      {touched.name && errors.name && (
                        <Text style={styles.errorText}>{errors.name}</Text>
                      )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        Company Registration Number
                      </Text>
                      <CustomTextInput
                        placeholder="Company Registration Number"
                        value={values.registrationNumber}
                        onChangeText={text =>
                          handleChange('registrationNumber')(text as string)
                        }
                      />
                      {touched.registrationNumber &&
                        errors.registrationNumber && (
                          <Text style={styles.errorText}>
                            {errors.registrationNumber}
                          </Text>
                        )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        State Registration
                      </Text>
                      <CustomTextInput
                        placeholder="State Registration"
                        value={values.stateRegistration}
                        onChangeText={text =>
                          handleChange('stateRegistration')(text as string)
                        }
                      />
                      {touched.stateRegistration &&
                        errors.stateRegistration && (
                          <Text style={styles.errorText}>
                            {errors.stateRegistration}
                          </Text>
                        )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        Tax Identification Number (TIN)
                      </Text>
                      <CustomTextInput
                        placeholder="TIN"
                        value={values.tin}
                        onChangeText={text =>
                          handleChange('tin')(text as string)
                        }
                      />
                      {touched.tin && errors.tin && (
                        <Text style={styles.errorText}>{errors.tin}</Text>
                      )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        Legal Structure of Business
                      </Text>
                      <CustomTextInput
                        placeholder="Legal Structure of Business"
                        value={values.businessStructure}
                        onChangeText={text =>
                          handleChange('businessStructure')(text as string)
                        }
                      />
                      {touched.businessStructure &&
                        errors.businessStructure && (
                          <Text style={styles.errorText}>
                            {errors.businessStructure}
                          </Text>
                        )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        Year Established
                      </Text>
                      <CustomTextInput
                        placeholder="Year Established"
                        value={values.yearEstablished}
                        onChangeText={text =>
                          handleChange('yearEstablished')(text as string)
                        }
                      />
                      {touched.yearEstablished && errors.yearEstablished && (
                        <Text style={styles.errorText}>
                          {errors.yearEstablished}
                        </Text>
                      )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        Company Address
                      </Text>
                      <CustomTextInput
                        placeholder="Company Address"
                        value={values.address}
                        onChangeText={text =>
                          handleChange('address')(text as string)
                        }
                      />
                      {touched.address && errors.address && (
                        <Text style={styles.errorText}>{errors.address}</Text>
                      )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        Company Phone Number
                      </Text>
                      <CustomTextInput
                        placeholder="Company Phone Number"
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
                        Company Email
                      </Text>
                      <CustomTextInput
                        placeholder="Company Email"
                        value={values.email}
                        onChangeText={text =>
                          handleChange('email')(text as string)
                        }
                      />
                      {touched.email && errors.email && (
                        <Text style={styles.errorText}>{errors.email}</Text>
                      )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        Website URL (Optional)
                      </Text>
                      <CustomTextInput
                        placeholder="URL"
                        value={values.website}
                        onChangeText={text =>
                          handleChange('website')(text as string)
                        }
                      />
                      {touched.website && errors.website && (
                        <Text style={styles.errorText}>{errors.website}</Text>
                      )}

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
  subTitle: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#333333',
    alignSelf: 'center',
    marginTop: hp(2.5),
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

export default ServiceProviderRegister;
