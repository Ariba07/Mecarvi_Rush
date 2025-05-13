import {StyleSheet, Platform, Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  background: {width, height},
  container: {flex: 1, paddingHorizontal: wp(5)},
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
  imagePreview: {
    width: '100%',
    height: hp(20),
    borderRadius: 10,
    resizeMode: 'cover',
  },
});
