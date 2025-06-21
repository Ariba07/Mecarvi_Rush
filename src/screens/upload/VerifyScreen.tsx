/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useContext, useState, useMemo} from 'react';
import {
  View,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {launchCamera, CameraOptions} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {
  ImageData,
  selectCardImage,
  selectCnicImage,
  selectCustomerAuthState,
  selectPhotoImage,
  updateCard,
  updateCnic,
  updatePhoto,
} from '../../slice/Slice';
import CustomButton from '../../components/common/buttons/CustomButton';
import CustomErrorModal from '../../components/common/errorModal/CustomErrorModal';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import axios from 'axios';
import {API_BASE_URL} from '../../components/helperUtils/apiHelper/ApiHelper';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import ImageCapture from './ImageCapture';
import {Platform, PermissionsAndroid} from 'react-native';
import {styles} from '../../assets/styles/verifyScreen/VerifyScreenStyles';
import {VerifyScreenProps} from './types';

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
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const customerData = useSelector(selectCustomerAuthState);
  const cnic = useSelector(selectCnicImage);
  const photo = useSelector(selectPhotoImage);
  const card = useSelector(selectCardImage);
  const dispatch = useDispatch();
  const {theme} = useContext(ThemeContext);

  const backgroundImage = useMemo(
    () =>
      theme.backgroundColor === '#ffffff'
        ? require('../../assets/images/BG.png')
        : require('../../assets/images/dark.png'),
    [theme.backgroundColor],
  );

  const requestCameraPermission = useCallback(async () => {
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
  }, []);

  const compressImage = useCallback(
    async (
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
          fileSize,
          width: response.width,
          height: response.height,
        };
      } catch (error) {
        console.warn('Image compression failed:', error);
        return null;
      }
    },
    [],
  );

  const openCamera = useCallback(async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      setErrorMessage(
        'Camera permission denied. Please enable it in settings.',
      );
      setModalVisible(true);
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
        if (response.errorMessage) {
          setErrorMessage(`Camera error: ${response.errorMessage}`);
          setModalVisible(true);
        }
        return;
      }
      const image = response.assets[0];
      if (!image.uri) {
        setErrorMessage('Failed to capture image.');
        setModalVisible(true);
        return;
      }
      const compressedImage = await compressImage(image.uri, 1);
      if (!compressedImage) {
        setErrorMessage('Failed to process image.');
        setModalVisible(true);
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
  }, [requestCameraPermission, compressImage, label, dispatch]);

  const handleNext = useCallback(async () => {
    if (label === 'CNIC Front Picture' && !cnicImage) {
      setErrorMessage('Please capture a CNIC image before proceeding.');
      setModalVisible(true);
      return;
    } else if (label === 'Credit Card Picture' && !cardImage) {
      setErrorMessage('Please capture a credit card image before proceeding.');
      setModalVisible(true);
      return;
    } else if (label === 'Live Photo' && !photoImage) {
      setErrorMessage('Please capture a live photo before proceeding.');
      setModalVisible(true);
      return;
    }

    if (label === 'CNIC Front Picture') {
      navigation.navigate('Card');
    } else if (label === 'Credit Card Picture') {
      navigation.navigate('Photo');
    } else if (label === 'Live Photo') {
      try {
        const endpoint = 'customers/register';
        const formData = new FormData();
        if (customerData) {
          formData.append('full_name', customerData.fullName);
          formData.append('email', customerData.email);
          formData.append('phone_number', customerData.phoneNumber);
          formData.append('password', customerData.password);
        }
        const appendFile = (fieldName: string, file: any) => {
          if (file && file.uri) {
            formData.append(fieldName, {
              uri: file.uri,
              type: 'image/jpeg',
              name: file.name || `${fieldName}.${'jpg'}`,
            });
          }
        };
        appendFile('cnic_image', cnic);
        appendFile('credit_card_image', card);
        appendFile('security_image', photo);

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
        setErrorMessage(
          error.response?.data?.message ||
            'Failed to register. Please try again.',
        );
        setModalVisible(true);
      }
    }
  }, [
    label,
    cnicImage,
    cardImage,
    photoImage,
    cnic,
    card,
    photo,
    navigation,
    customerData,
  ]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
        <ImageBackground source={backgroundImage} style={styles.background}>
          <Animatable.View
            animation="bounceInDown"
            duration={1000}
            style={styles.logoView}>
            <Image
              source={require('../../assets/images/headerLogo.png')}
              style={styles.logo}
            />
          </Animatable.View>
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={300}
            style={styles.container}>
            <Animatable.Text
              animation="fadeIn"
              duration={800}
              delay={600}
              style={styles.title}>
              {title}
            </Animatable.Text>
            <Animatable.View animation="fadeIn" duration={800} delay={900}>
              <ImageCapture
                label={label}
                cnicImage={cnicImage}
                cardImage={cardImage}
                photoImage={photoImage}
                imageSource={imageSource}
                onCapture={openCamera}
              />
            </Animatable.View>
            <Animatable.View
              animation="pulse"
              iterationCount={1}
              duration={1000}>
              <CustomButton
                title={label === 'Live Photo' ? 'Register' : 'Next'}
                onPress={handleNext}
              />
            </Animatable.View>
          </Animatable.View>
          <Animatable.View
            animation={modalVisible ? 'fadeIn' : 'fadeOut'}
            duration={300}>
            <CustomErrorModal
              visible={modalVisible}
              message={errorMessage}
              onClose={() => setModalVisible(false)}
              theme={theme}
            />
          </Animatable.View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default VerifyScreen;
