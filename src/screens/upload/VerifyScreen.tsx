/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useContext, useState, useMemo} from 'react';
import {View, ImageBackground, Image, Platform} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
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
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import axios from 'axios';
import {API_BASE_URL} from '../../components/helperUtils/apiHelper/ApiHelper';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import ImageCapture from './ImageCapture';
import {styles} from '../../assets/styles/verifyScreen/VerifyScreenStyles';
import {VerifyScreenProps} from './types';
import CustomModal from '../../components/common/errorModal/CustomModal';

interface ActionResult {
  success: boolean;
  data?: any;
  error?: {
    title: string;
    message: string;
  };
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
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('Error');
  const customerData = useSelector(selectCustomerAuthState);
  const cnic = useSelector(selectCnicImage);
  const card = useSelector(selectCardImage);
  const photo = useSelector(selectPhotoImage);
  const dispatch = useDispatch();
  const {theme} = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const backgroundImage = useMemo(
    () =>
      theme.backgroundColor === '#ffffff'
        ? require('../../assets/images/BG.png')
        : require('../../assets/images/dark.png'),
    [theme.backgroundColor],
  );

  const requestCameraPermission =
    useCallback(async (): Promise<ActionResult> => {
      console.log('Requesting camera permission...');
      try {
        const permission =
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.CAMERA
            : PERMISSIONS.ANDROID.CAMERA;
        const status = await check(permission);
        console.log('Permission status:', status);

        if (status === RESULTS.BLOCKED || status === RESULTS.DENIED) {
          const result = await request(permission);
          console.log('Permission result:', result);
          if (result === RESULTS.BLOCKED) {
            return {
              success: false,
              error: {
                title: 'Permission Blocked',
                message:
                  'Camera access is blocked. Please enable it in your device settings to continue.',
              },
            };
          }
          return {success: result === RESULTS.GRANTED};
        }
        return {success: status === RESULTS.GRANTED};
      } catch (error) {
        console.error('Permission request failed:', error);
        return {
          success: false,
          error: {
            title: 'Error',
            message: 'Failed to request camera permission.',
          },
        };
      }
    }, []);

  const compressImage = useCallback(
    async (
      uri: string,
      targetSizeMB: number = 2,
    ): Promise<ImageData | null> => {
      console.log('Compressing image:', uri);
      try {
        const maxDimension = 2560;
        let quality = 90;
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
        console.log('Compression response:', response);
        compressedUri = response.uri;
        fileSize = response.size;
        const targetSizeBytes = targetSizeMB * 1024 * 1024;
        if (fileSize && fileSize > targetSizeBytes && quality > 50) {
          while (fileSize > targetSizeBytes && quality > 50) {
            quality -= 5;
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
          console.warn('Compression failed: No URI or file size');
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
        console.error('Image compression failed:', error);
        return null;
      }
    },
    [],
  );

  const openCamera = useCallback(async (): Promise<ActionResult> => {
    console.log('Attempting to open camera for label:', label);
    const permissionResult = await requestCameraPermission();
    if (!permissionResult.success) {
      if (permissionResult.error?.title === 'Permission Blocked') {
        return {
          success: false,
          error: {
            title: permissionResult.error.title,
            message: permissionResult.error.message,
          },
        };
      }
      return permissionResult;
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: false,
      quality: 1,
      maxWidth: 2560,
      maxHeight: 1440,
    };
    console.log('Launching camera with options:', options);

    return new Promise<ActionResult>(resolve => {
      launchCamera(options, async response => {
        console.log('Camera response:', response);
        if (response.didCancel) {
          console.log('User cancelled camera');
          resolve({success: false});
        } else if (response.errorCode || response.errorMessage) {
          resolve({
            success: false,
            error: {
              title: 'Error',
              message: `Camera error: ${response.errorCode || 'Unknown'} - ${
                response.errorMessage || 'No message'
              }`,
            },
          });
        } else if (!response.assets?.[0]?.uri) {
          resolve({
            success: false,
            error: {
              title: 'Error',
              message: 'Failed to capture image.',
            },
          });
        } else {
          const image = response.assets[0];
          const imageData = image.uri
            ? await compressImage(image.uri, 2)
            : null;
          if (!imageData) {
            resolve({
              success: false,
              error: {
                title: 'Error',
                message: 'Failed to process image.',
              },
            });
          } else {
            console.log('Processed image:', imageData);
            switch (label) {
              case 'CNIC Front Picture':
                setCnicImage(imageData as ImageData);
                dispatch(updateCnic(imageData as ImageData));
                break;
              case 'Credit Card Picture':
                setCardImage(imageData as ImageData);
                dispatch(updateCard(imageData as ImageData));
                break;
              case 'Live Photo':
                setPhotoImage(imageData as ImageData);
                dispatch(updatePhoto(imageData as ImageData));
                break;
            }
            resolve({success: true, data: imageData});
          }
        }
      });
    });
  }, [requestCameraPermission, compressImage, label, dispatch]);

  const onCapture = async () => {
    const result = await openCamera();
    if (!result.success && result.error) {
      setModalTitle(result.error.title);
      setModalMessage(result.error.message);
      setModalVisible(true);
    }
  };

  const handleNext = useCallback(async (): Promise<ActionResult> => {
    console.log('HandleNext called for label:', label);
    if (label === 'CNIC Front Picture' && !cnicImage) {
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Please capture a CNIC image before proceeding.',
        },
      };
    } else if (label === 'Credit Card Picture' && !cardImage) {
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Please capture a credit card image before proceeding.',
        },
      };
    } else if (label === 'Live Photo' && !photoImage) {
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Please capture a live photo before proceeding.',
        },
      };
    }

    if (label === 'CNIC Front Picture') {
      navigation.navigate('Card');
      return {success: true};
    } else if (label === 'Credit Card Picture') {
      navigation.navigate('Photo');
      return {success: true};
    } else if (label === 'Live Photo') {
      try {
        setIsLoading(true);
        console.log('Submitting registration data...');
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

        const response = await axios({
          method: 'POST',
          url: `${API_BASE_URL}${endpoint}`,
          data: formData,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: data => data,
        });
        console.log('Registration response:', response.data);
        navigation.replace('Verify');
        return {success: true, data: response.data};
      } catch (error: any) {
        console.error('Registration failed:', error);
        return {
          success: false,
          error: {
            title: 'Error',
            message:
              error.response?.data?.message ||
              'Failed to register. Please try again.',
          },
        };
      } finally {
        setIsLoading(false);
      }
    }
    return {success: true};
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

  const onNext = async () => {
    const result = await handleNext();
    if (!result.success && result.error) {
      setModalTitle(result.error.title);
      setModalMessage(result.error.message);
      setModalVisible(true);
    }
  };

  return (
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
              onCapture={onCapture}
            />
          </Animatable.View>
          <Animatable.View animation="pulse" iterationCount={1} duration={1000}>
            <CustomButton
              title={label === 'Live Photo' ? 'Register' : 'Next'}
              onPress={onNext}
              disabled={isLoading}
              isLoading={isLoading}
            />
          </Animatable.View>
        </Animatable.View>
        <Animatable.View
          animation={modalVisible ? 'fadeIn' : 'fadeOut'}
          duration={300}>
          <CustomModal
            visible={modalVisible}
            title={modalTitle}
            message={modalMessage}
            onClose={() => setModalVisible(false)}
            buttonText={
              modalTitle === 'Permission Blocked' ? 'Open Settings' : 'OK'
            }
          />
        </Animatable.View>
      </ImageBackground>
    </View>
  );
};

export default VerifyScreen;
