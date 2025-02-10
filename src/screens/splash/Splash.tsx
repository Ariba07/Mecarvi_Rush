import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import * as Animatable from 'react-native-animatable';

const Splash = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('OnBoard'); // Navigate to OnBoard screen after 3 seconds
    }, 3000);
  }, [navigation]);

  return (
    <View style={styles.backgroundContainer}>
      {/* Polygon animation */}
      <Animatable.Image
        source={require('../../assets/images/part.png')}
        style={styles.polygon}
        animation="slideInRight"
        duration={2000}
        iterationCount={1}
        useNativeDriver
      />
      {/* Logo animation */}
      <Animatable.Image
        source={require('../../assets/images/MainLogo.png')}
        style={styles.logo}
        animation="fadeIn" // Animation for the logo
        duration={2000}
        iterationCount={1}
        useNativeDriver
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#03A7A7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  polygon: {
    position: 'absolute',
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
    zIndex: 0,
    right: -30,
  },
  logo: {
    width: '60%',
    height: 200,
    resizeMode: 'contain',
    zIndex: 1,
  },
});

export default Splash;
