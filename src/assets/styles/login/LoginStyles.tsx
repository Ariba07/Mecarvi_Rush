import {StyleSheet, Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  background: {width, height},
  container: {flex: 1, paddingHorizontal: wp(5)},
  logoView: {alignSelf: 'center', marginTop: hp(5), marginBottom: hp(13)},
  logo: {width: wp(50), height: hp(15), resizeMode: 'contain'},
  title: {
    fontSize: wp(7),
    fontWeight: 'bold',
    color: '#ff00a7',
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
  rememberText: {fontSize: wp(4), color: '#333'},
  forgotText: {fontSize: wp(3), color: '#333', textDecorationLine: 'underline'},
  footer: {flexDirection: 'row', justifyContent: 'center', marginTop: hp(1)},
  footerText: {fontSize: wp(3), color: '#333'},
  registerText: {
    color: '#ff00a7',
    fontSize: wp(3),
    textDecorationLine: 'underline',
  },
  checkboxContainer: {flexDirection: 'row', alignItems: 'center'},
  checkbox: {
    width: hp(2),
    height: hp(2),
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: wp(1),
    marginRight: wp(2),
  },
  checkboxChecked: {backgroundColor: '#03A7A7'},
  label: {
    fontSize: wp(3.5),
    color: '#333',
    marginTop: hp(1.5),
    fontWeight: '500',
    marginLeft: wp(5),
  },
  errorText: {
    color: 'red',
    fontSize: wp(3),
    marginLeft: wp(5),
    marginTop: hp(0.5),
  },
});
