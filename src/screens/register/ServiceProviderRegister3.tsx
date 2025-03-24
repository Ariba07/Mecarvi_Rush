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
  TouchableOpacity,
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
import DocumentPicker from 'react-native-document-picker';
import {registerValidationSchema3} from '../../components/helperUtils/validations/validationSchema';
import {Icon} from 'react-native-elements';
import {updateBusinessField} from '../../slice/Slice';
import {useDispatch} from 'react-redux';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

const {width, height} = Dimensions.get('window');

const ServiceProviderRegister3 = () => {
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
    dispatch(
      updateBusinessField({
        field: 'facebookLink',
        value: values.facebookLink,
      }),
    );
    dispatch(
      updateBusinessField({
        field: 'instagramLink',
        value: values.instagramLink,
      }),
    );
    dispatch(
      updateBusinessField({field: 'logoUpload', value: values.logoUpload}),
    );
    dispatch(
      updateBusinessField({
        field: 'portfolio',
        value: values.portfolio,
      }),
    );
    dispatch(
      updateBusinessField({
        field: 'businessProof',
        value: values.businessProof,
      }),
    );
    dispatch(
      updateBusinessField({
        field: 'documentVerification',
        value: values.documentVerification,
      }),
    );
    dispatch(
      updateBusinessField({
        field: 'onboardingAvailability',
        value: values.onboardingAvailability,
      }),
    );

    // Navigate to the next screen
    navigation.navigate('Upload');
  };

  // Function to handle file selection
  const pickDocument = async (setFieldValue: Function, fieldName: string) => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      setFieldValue(fieldName, res);
      console.log(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the document picker');
      } else {
        console.log('Unknown Error: ', err);
      }
    }
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
            <Text style={styles.subTitle}>Business Social Media Links</Text>

            <View style={{height: hp(65), marginTop: hp(2)}}>
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <Formik
                  initialValues={{
                    facebookLink: '',
                    instagramLink: '',
                    logoUpload: null as any,
                    portfolio: null as any,
                    businessProof: null as any,
                    documentVerification: null as any,
                    onboardingAvailability: '',
                  }}
                  validationSchema={registerValidationSchema3}
                  onSubmit={handleNext}>
                  {({
                    handleChange,
                    handleSubmit,
                    values,
                    setFieldValue,
                    errors,
                    touched,
                  }) => (
                    <>
                      <Text style={[styles.label, {color: theme.text}]}>
                        Facebook link
                      </Text>
                      <CustomTextInput
                        placeholder="Enter Facebook Link"
                        value={values.facebookLink}
                        onChangeText={text =>
                          handleChange('facebookLink')(text as string)
                        }
                      />
                      {touched.facebookLink && errors.facebookLink && (
                        <Text style={styles.errorText}>
                          {errors.facebookLink}
                        </Text>
                      )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        Instagram Link
                      </Text>
                      <CustomTextInput
                        placeholder="Enter Instagram Link"
                        value={values.instagramLink}
                        onChangeText={text =>
                          handleChange('instagramLink')(text as string)
                        }
                      />
                      {touched.instagramLink && errors.instagramLink && (
                        <Text style={styles.errorText}>
                          {errors.instagramLink}
                        </Text>
                      )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        Upload Logo
                      </Text>
                      <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={() =>
                          pickDocument(setFieldValue, 'logoUpload')
                        }>
                        <Text style={styles.uploadButtonText}>
                          {values.logoUpload
                            ? values.logoUpload.name
                            : 'Upload Company Logo'}
                        </Text>
                        <Icon
                          name="document"
                          size={15}
                          color="#333333"
                          type="ionicon"
                        />
                      </TouchableOpacity>

                      <Text style={[styles.label, {color: theme.text}]}>
                        Portfolio (Optional)
                      </Text>
                      <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={() =>
                          pickDocument(setFieldValue, 'portfolio')
                        }>
                        <Text style={styles.uploadButtonText}>
                          {values.portfolio
                            ? values.portfolio.name
                            : 'Upload Portfolio'}
                        </Text>
                        <Icon
                          name="document"
                          size={15}
                          color="#333333"
                          type="ionicon"
                        />
                      </TouchableOpacity>

                      <Text style={[styles.label, {color: theme.text}]}>
                        Proof of Business Registration
                      </Text>
                      <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={() =>
                          pickDocument(setFieldValue, 'businessProof')
                        }>
                        <Text style={styles.uploadButtonText}>
                          {values.businessProof
                            ? values.businessProof.name
                            : 'Upload Business Proof'}
                        </Text>
                        <Icon
                          name="document"
                          size={15}
                          color="#333333"
                          type="ionicon"
                        />
                      </TouchableOpacity>

                      <Text style={[styles.label, {color: theme.text}]}>
                        Document Verification (Optional)
                      </Text>
                      <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={() =>
                          pickDocument(setFieldValue, 'documentVerification')
                        }>
                        <Text style={styles.uploadButtonText}>
                          {values.documentVerification
                            ? values.documentVerification.name
                            : 'Upload Verification Document'}
                        </Text>
                        <Icon
                          name="document"
                          size={15}
                          color="#333333"
                          type="ionicon"
                        />
                      </TouchableOpacity>

                      <Text style={[styles.label, {color: theme.text}]}>
                        Availability for Onboarding Call
                      </Text>
                      <CustomTextInput
                        placeholder="Select Availability"
                        value={values.onboardingAvailability}
                        onChangeText={text =>
                          handleChange('onboardingAvailability')(text as string)
                        }
                      />
                      {touched.onboardingAvailability &&
                        errors.onboardingAvailability && (
                          <Text style={styles.errorText}>
                            {errors.onboardingAvailability}
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
  uploadButton: {
    marginVertical: hp(0.5), // Responsive margin
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? '#A9A9A9' : '#777', // Different border color for iOS & Android
    borderRadius: wp(2), // Responsive border radius
    paddingVertical: Platform.OS === 'ios' ? hp(1.5) : hp(1.6), // Responsive padding
    paddingHorizontal: wp(3),
    width: wp(80), // Responsive width
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  uploadButtonText: {
    flex: 1, // Take available space
    fontSize: wp(3.5), // Responsive font size
    color: '#999999',
  },
});

export default ServiceProviderRegister3;
