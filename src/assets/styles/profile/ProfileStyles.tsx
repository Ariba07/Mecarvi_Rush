import {StyleSheet, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#F5F7FA'},
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Platform.select({ios: wp(6), android: wp(5)}),
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: Platform.select({ios: wp(6), android: wp(5)}),
  },
  imageWrapper: {position: 'relative'},
  profileImage: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(15),
    resizeMode: 'cover',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#03A7A7',
    borderRadius: wp(10),
    padding: wp(1),
    borderWidth: 2,
    borderColor: '#fff',
  },
  storeName: {fontSize: wp(5), fontWeight: 'bold', marginTop: hp(2)},
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: wp(5),
    borderRadius: 12,
  },
  label: {
    fontSize: wp(3.5),
    fontWeight: '500',
    marginBottom: hp(0.5),
    color: '#333',
  },
  input: {
    height: hp(5.5),
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    fontSize: wp(3.5),
    color: '#333',
    marginBottom: hp(1.5),
  },
});
