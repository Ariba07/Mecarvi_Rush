/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
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
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

const {width, height} = Dimensions.get('window'); // Get screen dimensions

const Forget = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext); // Access theme

  // Determine the background image based on the theme
  const backgroundImage =
    theme.backgroundColor === '#ffffff'
      ? require('../../assets/images/BG.png') // Light theme
      : require('../../assets/images/dark.png'); // Dark theme

  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    try {
      await apiHelper({
        method: 'POST',
        endpoint: 'authentication/forgot-password/',
        data: {email: email},
      });

      navigation.replace('Login');
    } catch (error) {}
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
        <ImageBackground source={backgroundImage} style={styles.background}>
          <View style={styles.logoView}>
            <Image
              source={require('../../assets/images/headerLogo.png')}
              style={styles.logo}
            />
          </View>
          <View style={styles.container}>
            {/* Form Section */}
            <Text style={styles.title}>Forget Password</Text>
            <View>
              <Text style={[styles.label, {color: theme.text}]}>Email</Text>
              <CustomTextInput
                placeholder="Email"
                value={email}
                onChangeText={text => setEmail(text as string)}
              />
            </View>

            {/* Login Button */}
            <CustomButton title="Send Code" onPress={handleLogin} />
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
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: hp(2),
    alignSelf: 'center',
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

export default Forget;
