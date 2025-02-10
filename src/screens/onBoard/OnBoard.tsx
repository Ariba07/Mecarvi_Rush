/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const OnboardingScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const buttonFill = useRef(new Animated.Value(0)).current;

  const screens = [
    {
      image: require('../../assets/images/1st.png'), // Add the correct path to your image
      title: 'Welcome to Macarvi!',
      description:
        'All your printing needs in one place – business cards, flyers, t-shirts, embroidery & more!',
    },
    {
      image: require('../../assets/images/2nd.png'),
      title: 'Design & Customize with Ease',
      description:
        'Upload your designs or choose from our templates. Get exactly what you need!',
    },
    {
      image: require('../../assets/images/3rd.png'),
      title: 'Fast, Secure & Reliable',
      description:
        'Seamless order process with secure payments & doorstep delivery.',
    },
  ];

  const handleContinue = () => {
    if (currentIndex < screens.length - 1) {
      Animated.timing(buttonFill, {
        toValue: (currentIndex + 1) / (screens.length - 1),
        duration: 300,
        useNativeDriver: false,
      }).start();
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Login'); // Change "Home" to your main screen route
    }
  };

  const buttonWidth = buttonFill.interpolate({
    inputRange: [0, 1],
    outputRange: ['33%', '100%'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => {
          navigation.replace('Login');
        }}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Image source={screens[currentIndex].image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{screens[currentIndex].title}</Text>
        <Text style={styles.description}>
          {screens[currentIndex].description}
        </Text>
      </View>

      <View style={styles.pagination}>
        {screens.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>

      <View style={styles.buttonContainerWrapper}>
        <Animated.View style={[styles.buttonFill, {width: buttonWidth}]} />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleContinue}>
          <Text />
          <Text
            style={[
              styles.buttonText,
              currentIndex === 0 && {color: '#ff00a7'},
            ]}>
            Continue
          </Text>
          {currentIndex !== 2 ? (
            <Icon
              name="chevron-forward"
              type="ionicon"
              color={currentIndex === 0 ? '#ff00a7' : '#00C5D1'}
              size={20}
              style={{marginRight: 8}}
            />
          ) : (
            <View />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(8),
    paddingTop: Platform.OS === 'ios' ? hp(6) : hp(4), // More padding for iOS due to notch
  },
  skipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp(6) : hp(5), // Adjust for status bar differences
    right: wp(8),
  },
  skipText: {
    fontSize: wp(4.5),
    color: '#ff00a7',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  image: {
    width: wp(80),
    height: hp(30),
    resizeMode: 'cover',
    marginBottom: hp(2),
  },
  textContainer: {
    marginVertical: hp(3),
  },
  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#00C5D1',
    textAlign: 'center',
    marginBottom: hp(1),
  },
  description: {
    fontSize: wp(3.5),
    color: '#001F3F',
    textAlign: 'center',
    maxWidth: wp(70),
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: hp(3),
  },
  dot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: '#CCCCCC',
    marginHorizontal: wp(1),
  },
  activeDot: {
    backgroundColor: '#ff00a7',
  },
  buttonContainerWrapper: {
    width: '100%',
    height: hp(6),
    borderRadius: wp(2),
    overflow: 'hidden',
    backgroundColor: '#E9EEF2',
    position: 'relative',
    top: hp(Platform.OS === 'ios' ? 8 : 6), // Adjust for platform differences
    flexDirection: 'row',
  },
  buttonFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#00C5D1',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: wp(Platform.OS === 'ios' ? 5 : 4),
  },
  buttonText: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default OnboardingScreen;
