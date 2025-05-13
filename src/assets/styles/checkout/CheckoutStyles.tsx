import {StyleSheet, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
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
  paymentSection: {
    marginTop: hp(2),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(4),
    gap: wp(3),
  },
  sectionTitle: {
    fontSize: wp(5),
    color: '#666',
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: wp(3.5),
    color: '#999',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: wp(2),
    marginBottom: hp(1.5),
  },
  selectedPaymentOption: {
    borderWidth: 1,
    borderColor: '#FF00A7',
  },
  radioCircle: {
    height: wp(5),
    width: wp(5),
    borderRadius: wp(2.5),
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
  },
  selectedRadio: {
    height: wp(3),
    width: wp(3),
    borderRadius: wp(1.5),
    backgroundColor: '#FF00A7',
  },
  paymentText: {
    fontSize: wp(4),
    color: '#333',
    flex: 1,
  },
  paymentLogo: {
    width: wp(15),
    height: wp(5),
    marginLeft: wp(2),
  },
  balanceContainer: {
    backgroundColor: '#FF00A71A',
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
  },
  balanceText: {
    fontSize: wp(3.5),
    color: '#FF00A7',
    fontWeight: 'bold',
  },
  payButton: {
    position: 'absolute',
    bottom: Platform.select({ios: hp(4), android: hp(8)}),
    left: Platform.select({ios: wp(6), android: wp(5)}),
    right: Platform.select({ios: wp(6), android: wp(5)}),
  },
});
