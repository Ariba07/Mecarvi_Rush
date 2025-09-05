import {StyleSheet, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  safeArea: {flex: 1},
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({ios: wp(5), android: wp(4)}),
    paddingBottom: Platform.select({ios: hp(8), android: hp(10)}),
  },
  tabWrapper: {
    borderRadius: wp(3),
    marginVertical: hp(2),
    padding: hp(1.5),
  },
  tabContainer: {
    paddingHorizontal: wp(2),
    alignItems: 'center',
  },
  tabButton: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    marginRight: wp(1.5),
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: '#00C4B4',
  },
  tabText: {
    fontSize: wp(4.2),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  listContainer: {
    paddingBottom: hp(2),
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(10),
  },
  noOrdersText: {
    fontSize: wp(5),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    textAlign: 'center',
    marginBottom: hp(2),
    opacity: 0.8,
  },
  cardContainer: {
    marginBottom: hp(2),
    borderRadius: wp(3),
  },
  card: {
    borderRadius: wp(3),
    padding: wp(4),
    flexDirection: 'column',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailsContainer: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  orderNumber: {
    fontSize: wp(4.8),
    fontWeight: '700',
  },
  statusPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  status: {
    fontSize: wp(4.2),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  dateText: {
    fontSize: wp(3.8),
    marginBottom: hp(1.5),
    opacity: 0.8,
  },
  priceText: {
    fontSize: wp(4.5),
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  actionButton: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
    alignSelf: 'flex-start',
  },
  trackingButton: {},
  trackingButtonText: {
    color: '#ffffff',
    fontSize: wp(3.8),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  ratingButton: {},
  ratingButtonText: {
    color: '#ffffff',
    fontSize: wp(3.8),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  feedbackButton: {},
  feedbackButtonText: {
    color: '#ffffff',
    fontSize: wp(3.8),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  menuButton: {
    padding: wp(2),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: wp(3),
    padding: wp(5),
    width: wp(90),
    maxHeight: hp(80),
  },
  modalTitle: {
    fontSize: wp(5.5),
    fontWeight: '700',
    marginBottom: hp(2.5),
    textAlign: 'center',
  },
  itemsContainer: {
    flexGrow: 0,
    marginBottom: hp(2),
  },
  itemCard: {
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(1.5),
  },
  itemTitle: {
    fontSize: wp(4.8),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginBottom: hp(1),
  },
  itemDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(0.5),
  },
  itemDetailLabel: {
    fontSize: wp(4),
    fontWeight: '500',
  },
  itemDetailValue: {
    fontSize: wp(4),
    fontWeight: '500',
  },
  statusCirclesContainer: {
    marginBottom: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(4),
  },
  statusCircleWrapper: {
    alignItems: 'center',
    marginVertical: hp(1),
    flexDirection: 'row',
    gap: wp(2),
  },
  statusCircle: {
    width: wp(3.5),
    height: wp(3.5),
    borderRadius: wp(2),
    borderWidth: 2,
  },
  statusCircleText: {
    fontSize: wp(4.2),
    fontWeight: '500',
  },
  trackingStatusText: {
    fontSize: wp(4.8),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginBottom: hp(2),
    textAlign: 'center',
  },
  // Unified button styles
  cancelButton: {
    width: wp(40), // Same width for all buttons
    paddingVertical: hp(1.5), // Same height via padding
    paddingHorizontal: wp(4),
    borderRadius: wp(3),
    alignItems: 'center',
    justifyContent: 'center', // Ensure content is centered
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: wp(4.2),
    fontWeight: '700',
  },
  disputeButton: {
    width: wp(40), // Same width for all buttons
    paddingVertical: hp(1.5), // Same height via padding
    paddingHorizontal: wp(4),
    borderRadius: wp(3),
    alignItems: 'center',
    justifyContent: 'center', // Ensure content is centered
  },
  disputeButtonText: {
    color: '#ffffff',
    fontSize: wp(4.2),
    fontWeight: '700',
  },
  closeButton: {
    width: wp(40), // Same width for all buttons
    paddingVertical: hp(1.5), // Same height via padding
    paddingHorizontal: wp(4),
    borderRadius: wp(3),
    alignItems: 'center',
    justifyContent: 'center', // Ensure content is centered
  },
  closeButtonText: {
    fontSize: wp(4.2),
    fontWeight: '700',
    color: '#ffffff',
  },
  actionButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: wp(4),
    marginBottom: hp(2),
  },
  footerContainer: {
    padding: hp(2),
    alignItems: 'center',
  },
  footerText: {
    fontSize: wp(4),
    marginBottom: hp(1),
    opacity: 0.8,
  },
  retryButton: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: wp(2),
    backgroundColor: '#00C4B4',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: wp(4),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  buttonText: {
    fontSize: wp(4.2),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
});
