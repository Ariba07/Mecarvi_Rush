import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#F5F7FA'},
  container: {flex: 1, paddingHorizontal: wp(5)},
  containerWrapper: {
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: hp(3),
  },
  overlay: {position: 'absolute', width: '100%', paddingHorizontal: wp(5)},
  userName: {fontSize: wp(4.5), fontWeight: 'bold', color: '#fff'},
  pointsText: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: hp(1),
  },
  subText: {fontSize: wp(3), color: '#fff', marginBottom: hp(1)},
  conversionText: {
    fontSize: wp(4),
    color: '#fff',
    marginTop: hp(1),
    fontWeight: 'bold',
  },
  rewardsContainer: {backgroundColor: '#fff', borderRadius: 12, padding: wp(5)},
  rewardsTitle: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(2),
  },
  rewardItem: {flexDirection: 'row', alignItems: 'center', marginBottom: hp(2)},
  rewardTextContainer: {flex: 1, marginLeft: wp(3)},
  rewardTitle: {fontSize: wp(4), fontWeight: 'bold', color: '#333'},
  rewardPoints: {fontSize: wp(3.5), color: '#777'},
  redeemButton: {
    backgroundColor: '#03A7A7',
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
  },
  redeemText: {color: '#fff', fontSize: wp(4), fontWeight: 'bold'},
  redeemedButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#03A7A7',
  },
  redeemedText: {color: '#03A7A7'},
  statusText: {fontSize: wp(4), textAlign: 'center', marginVertical: hp(2)},
});
