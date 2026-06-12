import {StyleSheet, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {flex: 1},
  title: {fontSize: wp('5%'), fontWeight: 'bold'},
  bannerContainer: {
    marginHorizontal: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    width: wp('90%'),
    height: hp('20%'),
    borderRadius: 10,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: Platform.OS === 'android' ? hp(1) : undefined,
  },
  dot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    marginHorizontal: wp('1%'),
  },
  section: {marginHorizontal: wp('4%'), marginVertical: hp('1%')},
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
  serviceCard: {
    alignItems: 'center',
    marginRight: wp('8.5%'),
    backgroundColor: 'white',
    borderRadius: wp('3%'),
    width: wp('25%'),
    height: wp('25%'),
    justifyContent: 'center',
  },
  serviceImage: {
    width: wp('10%'),
    height: wp('15%'),
    borderRadius: wp('2%'),
  },
  serviceName: {
    marginTop: hp('1%'),
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    maxWidth: wp('20%'),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Platform.OS === 'ios' ? hp(0.5) : hp(5),
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? undefined : hp(2),
    paddingHorizontal: hp(2.5),
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
  },
  tab: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTabStyle: {
    borderBottomColor: '#03A7A7',
    borderBottomWidth: 2,
  },
  selectedTabText: {
    color: '#03A7A7',
  },
  availTxt: {
    color: '#03A7A7',
    fontWeight: 'bold',
    fontSize: wp(12),
    textAlign: 'center',
  },
  availContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wp('4%'),
    marginBottom: Platform.OS === 'ios' ? wp(2) : wp(3),
    marginTop: Platform.OS === 'ios' ? wp(2) : undefined,
  },
  locationContainer: {
    backgroundColor: '#ffffff',
    width: wp(48),
    paddingVertical: hp(1),
    borderRadius: 8,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wp(1),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    backgroundColor: '#ffffff',
    padding: wp(2),
    borderRadius: 8,
    marginRight: wp(2),
  },
});
