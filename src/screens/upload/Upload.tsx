/* eslint-disable react-native/no-inline-styles */
import React from 'react';
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
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomButton from '../../components/common/buttons/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';

const {width, height} = Dimensions.get('window'); // Get screen dimensions

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

  const handleNext = () => {
    navigation.navigate(nextScreen);
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
              <View style={styles.box}>
                <Image style={styles.icon} source={imageSource} />
              </View>
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

// Exporting screens from the same file
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
});

export default Upload;
