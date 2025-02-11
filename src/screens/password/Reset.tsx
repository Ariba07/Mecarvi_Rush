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
import CustomTextInput from '../../components/common/textInput/CustomTextInput';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
const {width, height} = Dimensions.get('window'); // Get screen dimensions

const Reset = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = () => {
    console.log('Login button pressed');
    navigation.navigate('Login');
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
            {/* Form Section */}
            <Text style={styles.title}>Reset Password</Text>
            <View style={{marginBottom: hp(1)}}>
              <Text style={styles.label}>New Password</Text>
              <CustomTextInput
                placeholder="New Password"
                secureTextEntry={true}
              />
              <Text style={styles.label}>Confirm Password</Text>
              <CustomTextInput
                placeholder="Confirm Password"
                secureTextEntry={true}
              />
            </View>

            {/* Login Button */}
            <CustomButton title="Reset Password" onPress={handleLogin} />
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: {
    width: width,
    height: height, // Ensure full coverage on all devices
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
    width: Platform.OS === 'ios' ? wp(45) : wp(50), // Responsive width
    height: hp(15), // Responsive height
    resizeMode: 'contain',
  },
  title: {
    fontSize: wp(7), // Responsive font size
    fontWeight: 'bold',
    color: '#ff00a7', // Different title colors for iOS and Android
    alignSelf: 'center',
    marginBottom: hp(2),
  },
  label: {
    fontSize: wp(3.5),
    color: '#333', // Darker text color for contrast
    marginTop: hp(1.5), // Space between label and input field
    fontWeight: '500', // Semi-bold for better visibility
    width: '80%',
    marginLeft: wp(5),
  },
});

export default Reset;
