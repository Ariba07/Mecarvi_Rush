/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Platform,
  ImageBackground,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomButton from '../../components/common/buttons/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {useSelector} from 'react-redux';
import {selectBusinessAuthState} from '../../slice/Slice';

const {width, height} = Dimensions.get('window'); // Get screen dimensions

const Verify = () => {
  const [code, setCode] = useState(Array(6).fill('')); // Array for 6-digit code
  const inputs = useRef<Array<TextInput | null>>([]); // Refs for each input field
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const number = useSelector(
    (state: {auth: {phoneNumber: string}}) => state.auth.phoneNumber,
  );
  const data = useSelector(selectBusinessAuthState);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Login'); // Navigate to Login screen
      return true; // Prevent default behavior (exiting the app)
    };

    // Add event listener
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    // Cleanup function
    return () => backHandler.remove();
  }, [navigation]);

  const handleLogin = () => {
    console.log('Login button pressed');
    navigation.navigate('Login');
  };

  const handleInputChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only accept the last entered character
    setCode(newCode);

    // Move to the next input field if not the last one
    if (value && index < inputs.current.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to move focus to the previous input
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !code[index]) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
        <ImageBackground
          style={styles.background}
          source={require('../../assets/images/BG.png')}>
          {/* Logo */}
          <View style={styles.logoView}>
            <Image
              source={require('../../assets/images/headerLogo.png')}
              style={styles.logo}
            />
          </View>

          <View style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>Verify Code</Text>
            <View style={{marginVertical: hp(2)}}>
              <Text style={styles.subtitle}>
                We have sent the code verification to
              </Text>
              <Text style={styles.phoneNumber}>{number}</Text>
            </View>

            {/* Code Input */}
            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={el => (inputs.current[index] = el)} // Assign ref for each input
                  style={styles.codeInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={value => handleInputChange(value, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                />
              ))}
            </View>
            {/* Verify Button */}
            <CustomButton title="Verify" onPress={handleLogin} />
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
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: hp(35),
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: wp(4),
    color: '#333', // Dark text
    textAlign: 'center',
  },
  phoneNumber: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(3),
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(80),
    marginBottom: hp(5),
  },
  codeInput: {
    width: wp(12),
    height: wp(12),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(2),
    textAlign: 'center',
    fontSize: wp(5),
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
  verifyButton: {
    backgroundColor: '#03A7A7', // Green button
    width: wp(80),
    paddingVertical: hp(1.8),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  verifyText: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Verify;
