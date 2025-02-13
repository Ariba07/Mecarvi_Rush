/* eslint-disable react-native/no-inline-styles */
import React from 'react';
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

const {width, height} = Dimensions.get('window');

const ServiceProviderRegister1 = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const dispatch = useDispatch();

  const handleNext = (values: any) => {
    // Dispatch all business-related fields
    dispatch(
      updateBusinessField({field: 'ownerName', value: values.ownerName}),
    );
    dispatch(
      updateBusinessField({
        field: 'ownerPhoneNumber',
        value: values.ownerPhoneNumber,
      }),
    );
    dispatch(
      updateBusinessField({
        field: 'ownerEmail',
        value: values.ownerEmail,
      }),
    );
    dispatch(updateBusinessField({field: 'linkedIn', value: values.linkedIn}));
    dispatch(
      updateBusinessField({
        field: 'password',
        value: values.password,
      }),
    );

    navigation.navigate('ServiceProviderRegister2');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
        <ImageBackground
          source={require('../../assets/images/BG.png')}
          style={styles.background}>
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
              Owner/Primary Contact Information
            </Text>

            <View style={{height: hp(65), marginTop: hp(2)}}>
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <Formik
                  initialValues={{
                    ownerName: '',
                    ownerPhoneNumber: '',
                    ownerEmail: '',
                    linkedIn: '',
                    password: '',
                    confirmPassword: '',
                  }}
                  validationSchema={registerValidationSchema}
                  onSubmit={handleNext}>
                  {({handleChange, handleSubmit, values, errors, touched}) => (
                    <>
                      <Text style={styles.label}>Owner Name</Text>
                      <CustomTextInput
                        placeholder="Company Name"
                        value={values.ownerName}
                        onChangeText={text =>
                          handleChange('ownerName')(text as string)
                        }
                      />
                      {touched.ownerName && errors.ownerName && (
                        <Text style={styles.errorText}>{errors.ownerName}</Text>
                      )}

                      <Text style={styles.label}>Owner's Email</Text>
                      <CustomTextInput
                        placeholder="Company Email"
                        value={values.ownerEmail}
                        onChangeText={text =>
                          handleChange('ownerEmail')(text as string)
                        }
                      />
                      {touched.ownerEmail && errors.ownerEmail && (
                        <Text style={styles.errorText}>
                          {errors.ownerEmail}
                        </Text>
                      )}

                      <Text style={styles.label}>Owner's Phone Number</Text>
                      <CustomTextInput
                        placeholder="Company Phone Number"
                        value={values.ownerPhoneNumber}
                        onChangeText={text =>
                          handleChange('ownerPhoneNumber')(text as string)
                        }
                      />
                      {touched.ownerPhoneNumber && errors.ownerPhoneNumber && (
                        <Text style={styles.errorText}>
                          {errors.ownerPhoneNumber}
                        </Text>
                      )}

                      <Text style={styles.label}>
                        Owner's LinkedIn Profile (Optional)
                      </Text>
                      <CustomTextInput
                        placeholder="URL"
                        value={values.linkedIn}
                        onChangeText={text =>
                          handleChange('linkedIn')(text as string)
                        }
                      />
                      {touched.linkedIn && errors.linkedIn && (
                        <Text style={styles.errorText}>{errors.linkedIn}</Text>
                      )}

                      <Text style={styles.label}>Password</Text>
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

                      <Text style={styles.label}>Confirm Password</Text>
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

export default ServiceProviderRegister1;
