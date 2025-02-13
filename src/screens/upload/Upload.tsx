/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomButton from '../../components/common/buttons/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {launchCamera, CameraOptions} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  AuthState,
  selectOption,
  updateBusinessField,
  updateCustomerField,
} from '../../slice/Slice';
import ImageResizer from 'react-native-image-resizer';

const {width, height} = Dimensions.get('window');

interface VerifyScreenProps {
  title: string;
  label: string;
  imageSource: any;
  nextScreen: keyof RootStackParamList;
}

const VerifyScreen: React.FC<VerifyScreenProps> = ({
  title,
  label,
  imageSource,
  nextScreen,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const role = useSelector(selectOption);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.CAMERA);
      return result === RESULTS.GRANTED;
    }
    return true;
  };

  const openCamera = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission denied');
        return;
      }
    }

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      console.log('Camera permission denied');
      return;
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: false,
      quality: 1.0, // Maximum quality before compression
      maxWidth: 4000,
      maxHeight: 3000,
    };

    launchCamera(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorMessage) {
        console.log('Camera error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const image = response.assets[0];

        if (image.uri && image.fileSize) {
          let fileSizeKB = image.fileSize / 1024;
          let fileSizeMB = fileSizeKB / 1024;
          console.log(`Original Size: ${fileSizeMB.toFixed(2)} MB`);

          // Increase threshold to 1MB (1024 KB)
          if (fileSizeKB > 1024) {
            try {
              const compressedImage = await ImageResizer.createResizedImage(
                image.uri,
                image.width ? image.width / 2 : 2000,
                image.height ? image.height / 2 : 1500,
                'WEBP',
                95, // Quality reduction
                0,
                undefined,
                false,
              );

              console.log('Compressed Image URI:', compressedImage.uri);
              console.log(
                'Compressed File Size:',
                compressedImage.size / 1024,
                'KB',
              );

              setImageUri(compressedImage.uri);
            } catch (error) {
              console.log('Image compression error:', error);
            }
          } else {
            console.log('Image is already within the 1MB limit.');
            setImageUri(image.uri);
          }
        } else {
          console.log('File size unknown');
        }
      }
    });
  };

  const handleNext = () => {
    if (imageUri) {
      let fieldName: keyof AuthState | null = null;

      if (label === 'CNIC Front Picture') {
        fieldName = 'cnic';
      } else if (label === 'Credit Card Picture') {
        fieldName = 'card';
      } else if (label === 'Live Photo') {
        fieldName = 'photo';
      }

      if (fieldName) {
        if (role === 'customer') {
          dispatch(updateCustomerField({field: fieldName, value: imageUri}));
        } else if (role === 'service') {
          dispatch(updateBusinessField({field: fieldName, value: imageUri}));
        }
      }
    }
    if (label === 'Live Photo') {
      navigation.replace(nextScreen);
    } else {
      navigation.navigate(nextScreen);
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
                  {imageUri ? (
                    <Image
                      source={{uri: imageUri}}
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
    nextScreen="Card"
  />
);

export const Card = () => (
  <VerifyScreen
    title="Verify identity"
    label="Credit Card Picture"
    imageSource={require('../../assets/images/card.png')}
    nextScreen="Photo"
  />
);

export const Photo = () => (
  <VerifyScreen
    title="Verify identity"
    label="Live Photo"
    imageSource={require('../../assets/images/live.png')}
    nextScreen="Verify"
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
