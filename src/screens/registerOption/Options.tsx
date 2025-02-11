import React, {useState} from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
const {width, height} = Dimensions.get('window'); // Get screen dimensions

const Options = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (selected !== option) {
      setSelected(option);
    } else {
      setSelected('');
    }

    if (option === 'customer') {
      navigation.navigate('Register'); // Change 'Register' to the actual screen name
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/BG.png')}
      style={styles.background}>
      {/* Logo */}
      <View style={styles.logoView}>
        <Image
          source={require('../../assets/images/headerLogo.png')}
          style={styles.logo}
        />
      </View>

      {/* Options Section - 2x2 Grid */}
      <View style={styles.container}>
        <View style={styles.grid}>
          <TouchableOpacity
            style={[
              styles.optionBox,
              selected === 'customer' && styles.selectedBox,
            ]}
            onPress={() => handleSelect('customer')}>
            <Image
              source={require('../../assets/images/customer.png')}
              style={styles.icon}
            />
            <Text
              style={[
                styles.optionText,
                selected === 'customer' && styles.selectedText,
              ]}>
              Continue as customer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionBox,
              selected === 'business' && styles.selectedBox,
            ]}
            onPress={() => handleSelect('business')}>
            <Image
              source={require('../../assets/images/business.png')}
              style={styles.icon}
            />
            <Text
              style={[
                styles.optionText,
                selected === 'business' && styles.selectedText,
              ]}>
              Register as business
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionBox,
              selected === 'service' && styles.selectedBox,
            ]}
            onPress={() => handleSelect('service')}>
            <Image
              source={require('../../assets/images/service.png')}
              style={styles.icon}
            />
            <Text
              style={[
                styles.optionText,
                selected === 'service' && styles.selectedText,
              ]}>
              Register as Service Provider
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: width,
    height: height, // Ensure full coverage on all devices
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
  container: {
    flex: 1,
    alignItems: 'center',
  },
  grid: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: wp(3),
  },
  optionBox: {
    width: wp(38),
    height: hp(14),
    backgroundColor: 'white',
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(3),
    shadowColor: '#5c5c5c',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  selectedBox: {
    borderWidth: 1,
    borderColor: '#ff00a7',
  },
  icon: {
    width: wp(9),
    height: hp(5),
    resizeMode: 'contain',
    marginBottom: hp(1),
  },
  optionText: {
    fontSize: Platform.OS === 'ios' ? wp(3.2) : wp(3.6),
    fontWeight: Platform.OS === 'ios' ? 600 : 'bold',
    color: '#ff00a7',
    textAlign: 'center',
    width: wp(32),
  },
  selectedText: {
    color: '#ff00a7',
  },
});

export default Options;
