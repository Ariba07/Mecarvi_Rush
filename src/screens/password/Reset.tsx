import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  Platform,
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

const Reset = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = () => {
    console.log('Login button pressed');
    navigation.navigate('Login');
  };

  return (
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
        <View>
          <Text style={styles.label}>New Password</Text>
          <CustomTextInput placeholder="New Password" secureTextEntry={true} />
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
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: wp(5), // Responsive padding
  },
  logoView: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp(8) : hp(6), // Different spacing for iOS and Android
    alignSelf: 'center',
  },
  logo: {
    width: Platform.OS === 'ios' ? wp(40) : wp(50), // Responsive width
    height: hp(15), // Responsive height
    resizeMode: 'contain',
  },
  title: {
    fontSize: wp(7), // Responsive font size
    fontWeight: 'bold',
    color: '#ff00a7', // Different title colors for iOS and Android
    alignSelf: 'center',
    marginVertical: hp(3),
    marginTop: hp(8),
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: hp(2),
    alignSelf: 'center',
  },
  rememberText: {
    fontSize: wp(4), // Responsive font size
    color: '#333',
  },
  forgotText: {
    fontSize: wp(3), // Responsive font size
    color: '#333333',
    textDecorationLine: 'underline',
    top: wp(-5),
  },
  footerText: {
    marginTop: hp(1), // Responsive margin-top
    fontSize: wp(3), // Responsive font size
    alignSelf: 'center',
  },
  registerText: {
    color: '#ff00a7', // Different register link colors for iOS and Android
    textDecorationLine: 'underline',
    fontSize: wp(3), // Responsive font size
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: hp(2),
    height: hp(2),
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: wp(1),
    marginRight: wp(2), // Space between checkbox and text
    backgroundColor: '#FFF',
    marginLeft: wp(1),
  },
  checkboxChecked: {
    backgroundColor: '#03A7A7',
  },
  label: {
    fontSize: wp(4),
    color: '#333', // Darker text color for contrast
    marginTop: hp(1.5), // Space between label and input field
    fontWeight: '500', // Semi-bold for better visibility
    width: '80%',
    marginLeft: wp(5),
  },
});

export default Reset;
