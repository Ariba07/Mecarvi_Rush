/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
  ImageBackground,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {launchCamera, CameraOptions} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {
  ImageData,
  selectBusinessAuthState,
  selectCardImage,
  selectCnicImage,
  selectCustomerAuthState,
  selectOption,
  selectPhotoImage,
  updateCard,
  updateCnic,
  updatePhoto,
} from '../../slice/Slice';
import CustomButton from '../../components/common/buttons/CustomButton';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import {API_BASE_URL} from '../../components/helperUtils/apiHelper/ApiHelper';

const {width, height} = Dimensions.get('window');

interface VerifyScreenProps {
  title: string;
  label: string;
  imageSource: any;
}
const VerifyScreen: React.FC<VerifyScreenProps> = ({
  title,
  label,
  imageSource,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [cnicImage, setCnicImage] = useState<ImageData | null>(null);
  const [cardImage, setCardImage] = useState<ImageData | null>(null);
  const [photoImage, setPhotoImage] = useState<ImageData | null>(null);
  const customerData = useSelector(selectCustomerAuthState);
  const serviceData = useSelector(selectBusinessAuthState);
  const cnic = useSelector(selectCnicImage);
  const photo = useSelector(selectPhotoImage);
  const card = useSelector(selectCardImage);
  const dispatch = useDispatch();
  const option = useSelector(selectOption);
  console.log(serviceData.portfolio);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.CAMERA);
      return result === RESULTS.GRANTED;
    } else if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      console.log('Camera permission denied');
      return;
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: false,
      quality: 1.0,
      maxWidth: 4000,
      maxHeight: 3000,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
        return;
      }

      if (response.errorMessage) {
        console.log('Camera error:', response.errorMessage);
        return;
      }

      const image = response.assets?.[0]; // Get first image

      if (!image?.uri) {
        console.log('Image URI not found');
        return;
      }

      console.log('Image Size (bytes):', image.fileSize); // Log the image size
      if (image.fileSize) {
        console.log(
          'Image Size (MB):',
          (image.fileSize / (1024 * 1024)).toFixed(2),
          'MB',
        ); // Convert to MB
      }

      const imageObject: ImageData = {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || `image_${Date.now()}.jpg`,
        fileSize: image.fileSize,
        width: image.width,
        height: image.height,
      };

      console.log('IMage', imageObject);

      // Dispatch immediately with the imageObject instead of relying on state updates
      switch (label) {
        case 'CNIC Front Picture':
          setCnicImage(imageObject); // This updates local state
          dispatch(updateCnic(imageObject)); // This updates Redux store
          break;
        case 'Credit Card Picture':
          setCardImage(imageObject);
          dispatch(updateCard(imageObject));
          break;
        case 'Live Photo':
          setPhotoImage(imageObject);
          dispatch(updatePhoto(imageObject));
          break;
        default:
          console.log('Unknown label:', label);
      }
    });
  };

  const handleNext = async () => {
    if (label === 'CNIC Front Picture') {
      navigation.navigate('Card');
    } else if (label === 'Credit Card Picture') {
      navigation.navigate('Photo');
    } else if (label === 'Live Photo') {
      try {
        const endpoint =
          option === 'customer'
            ? 'customers/register/'
            : 'service-provider/register';
        const formData = new FormData();

        // Add text fields
        if (option === 'customer' && customerData) {
          formData.append('full_name', customerData.fullName);
          formData.append('email', customerData.email);
          formData.append('phone_number', customerData.phoneNumber);
          formData.append('password', customerData.password);
        } else if (option === 'service' && serviceData) {
          formData.append('password', serviceData.password);

          formData.append('service_provider_name', serviceData.name || '');
          formData.append(
            'registration_number',
            serviceData.registrationNumber || '',
          );
          formData.append(
            'state_registration',
            serviceData.stateRegistration || '',
          );
          formData.append('tax_identification_number', serviceData.tin || '');
          formData.append(
            'legal_structure',
            serviceData.businessStructure || '',
          );
          formData.append(
            'year_established',
            serviceData.yearEstablished || '',
          );
          formData.append('address', serviceData.address || '');
          formData.append('full_name', serviceData.ownerName || '');
          formData.append('service_provider_email', serviceData.email || '');

          formData.append(
            'service_provider_phone_number',
            serviceData.phoneNumber || '',
          );

          formData.append(
            'user_phone_number',
            serviceData.ownerPhoneNumber || '',
          );
          formData.append('email', serviceData.ownerEmail || '');
          formData.append('linkedin_link', serviceData.linkedIn || '');
          formData.append(
            'production_capacity',
            serviceData.productionCapacity || '',
          );
          formData.append(
            'average_turnaround_time',
            serviceData.turnaroundTime || '',
          );
          formData.append('specialization', serviceData.specialization || '');
          formData.append('target_market', serviceData.targetMarket || '');
          formData.append('facebook_link', serviceData.facebookLink || '');
          formData.append('instagram_link', serviceData.instagramLink || '');
          formData.append(
            'onboarding_call_availability',
            serviceData.onboardingAvailability || '',
          );
          formData.append('website_url', serviceData.website || '');

          // Append service offered as an array
          if (serviceData.serviceOffered?.length) {
            const servicesString = serviceData.serviceOffered.join(','); // Convert array to comma-separated string
            formData.append('services_offered', servicesString);
          }
        }

        // Function to handle both images & PDF uploads
        const appendFile = (
          fieldName: string,
          file: any,
          fileType: 'image' | 'pdf',
        ) => {
          if (file && file.uri) {
            formData.append(fieldName, {
              uri: file.uri,
              type: fileType === 'pdf' ? 'application/pdf' : 'image/jpeg',
              name:
                file.name ||
                `${fieldName}.${fileType === 'pdf' ? 'pdf' : 'jpg'}`,
            });
          }
        };

        // Append standard images
        appendFile('cnic_image', cnic, 'image');
        appendFile('credit_card_image', card, 'image');
        appendFile('security_image', photo, 'image');
        appendFile('logo', serviceData?.logoUpload, 'image');

        // Append PDF files
        appendFile('portfolio', serviceData?.portfolio, 'pdf');
        appendFile(
          'proof_of_business_registration',
          serviceData?.businessProof,
          'pdf',
        );
        appendFile(
          'verification_document',
          serviceData?.documentVerification,
          'pdf',
        );

        // Log the FormData to verify structure
        console.log('FormData:', formData);

        // const response = await apiHelper({
        //   method: 'POST',
        //   endpoint: 'customers/register/',
        //   data: formData,
        // });
        const response = await axios({
          method: 'POST',
          url: `${API_BASE_URL}${endpoint}`,
          data: formData,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: (data, _headers) => {
            return data; // Prevent axios from trying to transform FormData
          },
        });

        console.log('Upload successful:', response);
        navigation.replace('Verify');
      } catch (error: any) {
        console.error('Upload error:', error);
        if (error.response) {
          console.error('Server Response Data:', error.response.data);
          console.error('Server Response Status:', error.response.status);
          console.error('Server Response Headers:', error.response.headers);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error Message:', error.message);
        }
      }
    }
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
            <Text style={styles.title}>{title}</Text>
            <View>
              <Text style={styles.label}>{label}</Text>
              <TouchableOpacity onPress={openCamera}>
                <View style={styles.box}>
                  {label === 'CNIC Front Picture' && cnicImage ? (
                    <Image
                      source={{uri: cnicImage.uri}}
                      style={styles.imagePreview}
                    />
                  ) : label === 'Credit Card Picture' && cardImage ? (
                    <Image
                      source={{uri: cardImage.uri}}
                      style={styles.imagePreview}
                    />
                  ) : label === 'Live Photo' && photoImage ? (
                    <Image
                      source={{uri: photoImage.uri}}
                      style={styles.imagePreview}
                    />
                  ) : (
                    <Image style={styles.icon} source={imageSource} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <CustomButton
              title={label === 'Live Photo' ? 'Register' : 'Next'}
              onPress={handleNext}
            />
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Main Upload Screen
const Upload = () => (
  <VerifyScreen
    title="Verify identity"
    label="CNIC Front Picture"
    imageSource={require('../../assets/images/cnic.png')}
  />
);

export const Card = () => (
  <VerifyScreen
    title="Verify identity"
    label="Credit Card Picture"
    imageSource={require('../../assets/images/card.png')}
  />
);

export const Photo = () => (
  <VerifyScreen
    title="Verify identity"
    label="Live Photo"
    imageSource={require('../../assets/images/live.png')}
  />
);

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
  label: {
    fontSize: wp(4),
    color: '#333',
    marginVertical: hp(1.5),
    textAlign: 'center',
  },
  box: {
    width: '90%',
    height: hp(20),
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(4),
    alignSelf: 'center',
    borderColor: '#cccccc',
    borderWidth: 1,
  },
  icon: {
    width: wp(12),
    height: wp(12),
    resizeMode: 'contain',
    marginBottom: hp(1),
  },
  imagePreview: {
    width: '100%',
    height: hp(20),
    borderRadius: 10,
    resizeMode: 'cover',
  },
});

export default Upload;
