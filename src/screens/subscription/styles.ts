import {StyleSheet, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
    paddingBottom: Platform.select({
      ios: hp(4),
      android: hp(8),
    }),
  },
  heading: {
    fontSize: Platform.select({
      ios: wp(6.5),
      android: wp(7),
    }),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF0080',
    marginVertical: Platform.select({
      ios: hp(5),
      android: hp(6),
    }),
  },
  card: {
    backgroundColor: '#FFF',
    padding: Platform.select({
      ios: wp(3),
      android: wp(2.5),
    }),
    borderRadius: wp(3),
    marginBottom: Platform.select({
      ios: hp(2.5),
      android: hp(2),
    }),
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: '#FF0080',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Platform.select({
      ios: hp(1.5),
      android: hp(1),
    }),
  },
  planTitle: {
    fontSize: Platform.select({
      ios: wp(4),
      android: wp(4.5),
    }),
    fontWeight: 'bold',
    color: '#333',
    maxWidth: wp(50),
  },
  planPrice: {
    fontSize: Platform.select({
      ios: wp(4),
      android: wp(4.5),
    }),
    fontWeight: 'bold',
    color: '#00A6A6',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Platform.select({
      ios: hp(0.3),
      android: hp(0.2),
    }),
  },
  featureText: {
    marginLeft: wp(2),
    fontSize: Platform.select({
      ios: wp(3),
      android: wp(3.5),
    }),
    color: '#555',
    maxWidth: wp('100%'),
  },
  errorText: {
    color: '#FF3333',
    fontSize: wp(3.5),
    textAlign: 'center',
  },
});
