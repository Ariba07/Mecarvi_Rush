/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {
  View,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  Image,
} from 'react-native';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {launchCamera, CameraOptions} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {
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
import axios from 'axios';
import {API_BASE_URL} from '../../components/helperUtils/apiHelper/ApiHelper';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import ImageCapture from './ImageCapture';
import {VerifyScreenProps, ImageData} from './types';
import {Platform, PermissionsAndroid} from 'react-native';
import {styles} from '../../assets/styles/verifyScreen/VerifyScreenStyles';

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
  const {theme} = useContext(ThemeContext);

  const backgroundImage =
    theme.backgroundColor === '#ffffff'
      ? require('../../assets/images/BG.png')
      : require('../../assets/images/dark.png');

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

  const compressImage = async (
    uri: string,
    targetSizeMB: number = 1,
  ): Promise<ImageData | null> => {
    try {
      const maxDimension = 1920;
      let quality = 80;
      let compressedUri: string | null = null;
      let fileSize: number | undefined;
      const response = await ImageResizer.createResizedImage(
        uri,
        maxDimension,
        maxDimension,
        'JPEG',
        quality,
        0,
        undefined,
        false,
        {mode: 'contain', onlyScaleDown: true},
      );
      compressedUri = response.uri;
      fileSize = response.size;
      const targetSizeBytes = targetSizeMB * 1024 * 1024;
      if (fileSize && fileSize > targetSizeBytes && quality > 10) {
        while (fileSize > targetSizeBytes && quality > 10) {
          quality -= 10;
          const newResponse = await ImageResizer.createResizedImage(
            uri,
            maxDimension,
            maxDimension,
            'JPEG',
            quality,
            0,
            undefined,
            false,
            {mode: 'contain', onlyScaleDown: true},
          );
          compressedUri = newResponse.uri;
          fileSize = newResponse.size;
        }
      }
      if (!compressedUri || !fileSize) {
        return null;
      }
      return {
        uri: compressedUri,
        type: 'image/jpeg',
        name: `image_${Date.now()}.jpg`,
        fileSize: fileSize,
        width: response.width,
        height: response.height,
      };
    } catch (error) {
      return null;
    }
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
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
    launchCamera(options, async response => {
      if (
        response.didCancel ||
        response.errorMessage ||
        !response.assets?.[0]?.uri
      ) {
        return;
      }
      const image = response.assets[0];
      if (!image.uri) {
        return;
      }
      const compressedImage = await compressImage(image.uri, 1);
      if (!compressedImage) {
        return;
      }
      switch (label) {
        case 'CNIC Front Picture':
          setCnicImage(compressedImage);
          dispatch(updateCnic(compressedImage));
          break;
        case 'Credit Card Picture':
          setCardImage(compressedImage);
          dispatch(updateCard(compressedImage));
          break;
        case 'Live Photo':
          setPhotoImage(compressedImage);
          dispatch(updatePhoto(compressedImage));
          break;
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
          if (serviceData.serviceOffered?.length) {
            serviceData.serviceOffered.forEach(service =>
              formData.append('services_offered[]', service),
            );
          }
        }
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
        appendFile('cnic_image', cnic, 'image');
        appendFile('credit_card_image', card, 'image');
        appendFile('security_image', photo, 'image');
        appendFile('logo', serviceData?.logoUpload, 'image');
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
        await axios({
          method: 'POST',
          url: `${API_BASE_URL}${endpoint}`,
          data: formData,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: data => data,
        });
        navigation.replace('Verify');
      } catch (error: any) {
        console.warn('Upload error:', error);
      }
    }
  };

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
            <Text style={styles.title}>{title}</Text>
            <ImageCapture
              label={label}
              cnicImage={cnicImage}
              cardImage={cardImage}
              photoImage={photoImage}
              imageSource={imageSource}
              onCapture={openCamera}
            />
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

export default VerifyScreen;
