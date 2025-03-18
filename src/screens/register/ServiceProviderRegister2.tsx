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
import {registerValidationSchema2} from '../../components/helperUtils/validations/validationSchema';
import {useDispatch} from 'react-redux';
import {updateBusinessField} from '../../slice/Slice';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const ServiceProviderRegister2 = () => {
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

  const navigateToUpload = (values: any) => {
    // Dispatch all business-related fields
    dispatch(
      updateBusinessField({field: 'targetMarket', value: values.targetMarket}),
    );
    dispatch(
      updateBusinessField({
        field: 'specialization',
        value: values.specialization,
      }),
    );
    dispatch(
      updateBusinessField({
        field: 'turnaroundTime',
        value: values.turnaroundTime,
      }),
    );
    dispatch(
      updateBusinessField({
        field: 'productionCapacity',
        value: values.productionCapacity,
      }),
    );
    dispatch(
      updateBusinessField({
        field: 'serviceOffered',
        value: values.serviceOffered,
      }),
    );

    navigation.navigate('ServiceProviderRegister3');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
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
            <Text style={styles.subTitle}>Service Details</Text>

            <View style={{height: hp(65), marginTop: hp(2)}}>
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <Formik
                  initialValues={{
                    serviceOffered: [], // Store multiple services as an array
                    productionCapacity: '',
                    turnaroundTime: '',
                    specialization: '',
                    targetMarket: '',
                  }}
                  onSubmit={navigateToUpload}
                  validationSchema={registerValidationSchema2}>
                  {({
                    handleChange,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    setFieldValue,
                  }) => (
                    <>
                      <Text style={[styles.label, {color: theme.text}]}>Service Offered</Text>
                      <CustomTextInput
                        placeholder="Select Services"
                        value={values.serviceOffered.join(', ')} // Convert array to a string for display
                        onChangeText={selectedOptions =>
                          setFieldValue('serviceOffered', selectedOptions)
                        } // Update array
                        isMultiSelect={true} // Pass a prop to indicate multi-select
                      />
                      {touched.serviceOffered && errors.serviceOffered && (
                        <Text style={styles.errorText}>
                          {errors.serviceOffered}
                        </Text>
                      )}

                      <Text style={[styles.label, {color: theme.text}]}>Production Capacity</Text>
                      <CustomTextInput
                        placeholder="Select Capacity"
                        value={values.productionCapacity}
                        onChangeText={text =>
                          handleChange('productionCapacity')(text as string)
                        }
                      />
                      {touched.productionCapacity &&
                        errors.productionCapacity && (
                          <Text style={styles.errorText}>
                            {errors.productionCapacity}
                          </Text>
                        )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        Average Turnaround Time for Orders
                      </Text>
                      <CustomTextInput
                        placeholder="In Days or Hours"
                        value={values.turnaroundTime}
                        onChangeText={text =>
                          handleChange('turnaroundTime')(text as string)
                        }
                      />
                      {touched.turnaroundTime && errors.turnaroundTime && (
                        <Text style={styles.errorText}>
                          {errors.turnaroundTime}
                        </Text>
                      )}

                      <Text style={[styles.label, {color: theme.text}]}>
                        Specialization (Optional)
                      </Text>
                      <CustomTextInput
                        placeholder="Tell Your Niche"
                        value={values.specialization}
                        onChangeText={text =>
                          handleChange('specialization')(text as string)
                        }
                      />
                      {touched.specialization && errors.specialization && (
                        <Text style={styles.errorText}>
                          {errors.specialization}
                        </Text>
                      )}

                      <Text style={[styles.label, {color: theme.text}]}>Target Market</Text>
                      <CustomTextInput
                        placeholder="Select Your Target Market"
                        value={values.targetMarket}
                        onChangeText={text =>
                          handleChange('targetMarket')(text as string)
                        }
                      />
                      {touched.targetMarket && errors.targetMarket && (
                        <Text style={styles.errorText}>
                          {errors.targetMarket}
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
    width: screenWidth,
    height: screenHeight,
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

export default ServiceProviderRegister2;
