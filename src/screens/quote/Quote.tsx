import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Success from '../../assets/images/Success.svg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';

const Quote = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Success width={wp(15)} height={wp(15)} />
        </View>
        <Text style={styles.title}>Request Submitted Successfully</Text>
        <Text style={styles.subtitle}>
          Your request has been sent! We'll contact you soon.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Drawer')}>
          <Text style={styles.buttonText}>Back to home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: wp(85),
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: wp(5),
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: -hp(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#000000',
    marginTop: hp(3),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: wp(3.5),
    color: '#666',
    textAlign: 'center',
    marginTop: hp(1),
    marginBottom: hp(5),
    maxWidth: wp(60),
  },
  button: {
    backgroundColor: '#00A19D',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(20),
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
});

export default Quote;
