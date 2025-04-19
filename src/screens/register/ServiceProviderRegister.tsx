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
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Formik} from 'formik';
import {useDispatch} from 'react-redux';
import CustomButton from '../../components/common/buttons/CustomButton';
import CustomTextInput from '../../components/common/textInput/CustomTextInput';
import {registerValidationSchema} from '../../components/helperUtils/validations/validationSchema';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {updateBusinessField} from '../../slice/Slice';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

const {width, height} = Dimensions.get('window');

// Google API setup from AddressCreate
const GOOGLE_API_KEY = 'AIzaSyAU9bshzS-D9P2Equ-0HW9skO7Ro9wR9ZY';
const GEOCODE_API_URL = 'https://maps.google.com/maps/api/geocode/json';
const PLACES_API_URL =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';

const ServiceProviderRegister = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const {theme} = useContext(ThemeContext);

  // State for address suggestions and coordinates
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [coordinates, setCoordinates] = useState({lat: null, lng: null});

  // Determine the background image based on the theme
  const backgroundImage =
    theme.backgroundColor === '#ffffff'
      ? require('../../assets/images/BG.png') // Light theme
      : require('../../assets/images/dark.png'); // Dark theme

  // Function to fetch address suggestions from Google Places API
  const fetchAddressSuggestions = async (input: string) => {
    if (input.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `${PLACES_API_URL}?key=${GOOGLE_API_KEY}&input=${encodeURIComponent(
          input,
        )}&language=en`,
      );
      const data = await response.json();

      if (data.status === 'OK' && data.predictions.length > 0) {
        const suggestions = data.predictions.map(
          (prediction: any) => prediction.description,
        );
        setAddressSuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.warn('Error fetching address suggestions:', error);
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Function to fetch coordinates (from AddressCreate)
  const fetchCoordinates = async (fullAddress: string) => {
    try {
      const response = await fetch(
        `${GEOCODE_API_URL}?key=${GOOGLE_API_KEY}&address=${encodeURIComponent(
          fullAddress,
        )}`,
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const {lat, lng} = data.results[0].geometry.location;
        setCoordinates({lat, lng});
        return {latitude: lat, longitude: lng};
      } else {
        throw new Error('Unable to geocode address');
      }
    } catch (error) {
      console.warn('Geocoding Error:', error);
      Alert.alert('Error', 'Failed to get coordinates for the address');
      return null;
    }
  };

  const handleNext = (values: any) => {
    // Dispatch all business-related fields, including coordinates
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
      updateBusinessField({
        field: 'phoneNumber',
        value: values.phoneNumber,
      }),
    );
    dispatch(updateBusinessField({field: 'email', value: values.email}));
    dispatch(updateBusinessField({field: 'website', value: values.website}));
    // Dispatch latitude and longitude
    dispatch(
      updateBusinessField({
        field: 'latitude',
        value: coordinates.lat,
      }),
    );
    dispatch(
      updateBusinessField({
        field: 'longitude',
        value: coordinates.lng,
      }),
    );

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
            <Text style={[styles.subTitle, {color: theme.text}]}>
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
                  onSubmit={async values => {
                    // Fetch coordinates for the entered address before submitting
                    const coordinatesResult = await fetchCoordinates(
                      values.address,
                    );
                    if (coordinatesResult) {
                      handleNext(values);
                    }
                  }}>
                  {({
                    handleChange,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    setFieldValue,
                  }) => (
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
                      <View style={{position: 'relative'}}>
                        <View
                          style={[
                            styles.inputContainer,
                            {backgroundColor: theme.backgroundColor},
                          ]}>
                          <TextInput
                            style={[styles.input, {color: theme.input}]}
                            placeholder="Company Address"
                            value={values.address}
                            onChangeText={text => {
                              handleChange('address')(text as string);
                              fetchAddressSuggestions(text);
                            }}
                            placeholderTextColor={'#999'}
                          />
                        </View>

                        {showSuggestions && addressSuggestions.length > 0 && (
                          <View
                            style={[
                              styles.dropdownContainer,
                              {backgroundColor: theme.whole},
                            ]}>
                            <ScrollView
                              nestedScrollEnabled
                              style={styles.dropdownScroll}>
                              {addressSuggestions.map((suggestion, index) => (
                                <TouchableOpacity
                                  key={index}
                                  style={[
                                    styles.dropdownItem,
                                    {backgroundColor: theme.backgroundColor},
                                  ]}
                                  onPress={async () => {
                                    setFieldValue('address', suggestion);
                                    setShowSuggestions(false);
                                    // Fetch coordinates for the selected suggestion
                                    await fetchCoordinates(suggestion);
                                  }}>
                                  <Text
                                    style={[
                                      styles.dropdownText,
                                      {color: theme.input},
                                    ]}>
                                    {suggestion}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          </View>
                        )}
                      </View>

                      {touched.address && errors.address && (
                        <Text style={styles.errorText}>{errors.address}</Text>
                      )}

                      {/* Optional: Display latitude and longitude for debugging */}
                      {/* {coordinates.lat && coordinates.lng && (
                        <Text style={[styles.label, {color: theme.text}]}>
                          Latitude: {coordinates.lat}, Longitude:{' '}
                          {coordinates.lng}
                        </Text>
                      )} */}

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
  inputContainer: {
    marginVertical: hp(0.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? '#A9A9A9' : '#777 777',
    borderRadius: wp(2),
    paddingVertical: Platform.OS === 'ios' ? hp(1.5) : hp(0.2),
    paddingHorizontal: wp(2),
    alignSelf: 'center',
    marginHorizontal: wp(5),
  },
  input: {
    flex: 1,
    fontSize: wp(3.5),
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignSelf: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    maxHeight: hp(20),
    top: hp(6),
    width: wp(80),
    padding: wp(2),
  },
  dropdownScroll: {
    maxHeight: hp(20),
  },
  dropdownItem: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    margin: wp(1),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  dropdownText: {
    fontSize: wp(3.5),
    color: '#333',
  },
});

export default ServiceProviderRegister;
