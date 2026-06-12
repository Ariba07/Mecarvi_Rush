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
import * as Animatable from 'react-native-animatable';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomButton from '../../components/common/buttons/CustomButton';
import CustomTextInput from '../../components/common/textInput/CustomTextInput';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {apiHelper} from '../../services/api';
import {ThemeContext} from '../../context/ThemeContext';

const {width, height} = Dimensions.get('window'); // Get screen dimensions

const Forget: React.FC = () => {
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
        endpoint: 'authentication/forgot-password',
        data: {email: email},
      });
      navigation.replace('Login');
    } catch (error) {
      // Consider adding error handling (e.g., showing a modal like in Login.tsx)
    }
  };

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
            <Text style={styles.title}>Forget Password</Text>
            <Animatable.View animation="fadeIn" duration={800} delay={600}>
              <Text style={[styles.label, {color: theme.text}]}>Email</Text>
              <CustomTextInput
                placeholder="Email"
                value={email}
                onChangeText={text => setEmail(text as string)}
              />
            </Animatable.View>
            <Animatable.View
              animation="pulse"
              iterationCount={1}
              duration={1000}>
              <CustomButton title="Send Code" onPress={handleLogin} />
            </Animatable.View>
          </Animatable.View>
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
