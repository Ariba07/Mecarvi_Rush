import {StyleSheet, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles remain unchanged
export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
  },
  section: {
    marginTop: hp(2),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: wp(4.5),
    color: '#333',
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: 8,
  },
  locationText: {
    fontSize: wp(4),
    color: '#000',
    flex: 1,
    marginLeft: wp(2),
  },
  dateList: {
    marginTop: hp(2),
  },
  dateSlot: {
    width: wp(15),
    height: hp(8),
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2),
  },
  selectedDateSlot: {
    backgroundColor: '#03A7A71A',
  },
  dateText: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#333',
  },
  dayText: {
    fontSize: wp(3.5),
    color: '#666',
  },
  timeList: {
    marginTop: hp(2),
  },
  timeSlot: {
    width: wp(20),
    height: hp(6),
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2),
  },
  selectedTimeSlot: {
    backgroundColor: '#03A7A71A',
  },
  timeText: {
    fontSize: wp(4),
    color: '#333',
  },
  selectedTimeText: {
    color: '#03A7A7',
  },
  payButton: {
    position: 'absolute',
    bottom: Platform.select({ios: hp(4), android: hp(4)}),
    left: Platform.select({ios: wp(6), android: wp(5)}),
    right: Platform.select({ios: wp(6), android: wp(5)}),
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
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
  title: {fontSize: wp('5%'), fontWeight: 'bold'},
});
