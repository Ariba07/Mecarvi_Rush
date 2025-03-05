import {StyleSheet, Platform, Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const tabs = ['Specification', 'Policy', 'Reviews'];
const screenWidth = Dimensions.get('window').width;
const tabWidth = screenWidth / tabs.length;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
  },
  imageSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  productImage: {
    width: wp(70),
    height: hp(30),
    resizeMode: 'contain',
  },
  navigationButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(2),
  },
  productDetailsContainer: {
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
  },
  bestSellerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#03A7A7',
    borderRadius: wp(2),
    padding: wp(0.5),
    width: Platform.OS === 'ios' ? wp(25) : wp(22),
    justifyContent: 'center',
  },
  bestSellerText: {
    fontSize: wp(3.2),
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: wp(1),
  },
  productInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: wp(3),
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#000000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(0.5),
    justifyContent: 'space-between',
  },
  ratingText: {
    fontSize: wp(3),
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: wp(1),
  },
  productPrice: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#FF0080',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'relative',
  },
  tabButton: {
    paddingVertical: wp(2),
    width: tabWidth,
    alignItems: 'center',
  },
  tabText: {
    fontSize: wp(4),
    color: 'grey',
    fontWeight: 'bold',
    marginBottom: Platform.OS === 'ios' ? hp(1) : hp(0.5),
  },
  activeTabText: {
    color: 'black',
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: tabWidth * 0.6,
    height: hp(0.3),
    backgroundColor: '#FF0080',
    borderRadius: 5,
    marginLeft: tabWidth * 0.2,
    marginBottom: Platform.OS === 'ios' ? hp(1) : hp(0.5),
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#9c9c9c',
    borderTopWidth: 1,
    borderTopColor: '#9c9c9c',
  },
  contentText: {
    fontSize: wp(5),
    color: '#FF0080',
    fontWeight: 'bold',
  },
  policyText: {
    fontSize: wp(3.5),
    color: '#9c9c9c',
    textAlign: 'justify',
  },
  specRow: {
    flexDirection: 'row',
    paddingVertical: wp(1),
  },
  specLabel: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#333',
    width: '50%',
  },
  specValue: {
    fontSize: wp(3.8),
    color: '#666',
    width: '50%',
  },
  attributeContainer: {
    flex: 1,
    alignSelf: 'center',
    width: wp(100),
    padding: wp(5),
  },
  label: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(0.5),
  },
  input: {
    height: hp(15),
    borderWidth: 1,
    borderColor: '#5c5c5c',
    borderRadius: 8,
    padding: wp(2),
    fontSize: wp(3.5),
    backgroundColor: '#FAFAFA',
    textAlignVertical: 'top',
    color: '#333',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingTop: hp(2),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(90),
  },
  button: {
    backgroundColor: '#03A7A7',
    paddingVertical: Platform.OS === 'ios' ? hp(1.5) : hp(1.8),
    paddingHorizontal: wp(5),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(40),
  },
  fullWidthButton: {
    marginTop: hp(2),
    width: wp(90),
  },
  buttonText: {
    color: '#fff',
    fontSize: hp(1.6),
    fontWeight: 'bold',
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
    marginBottom: hp(2),
  },
  colorOption: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(2),
  },
  selectedBorder: {
    borderColor: '#FF0080', // Highlight selected color
    borderWidth: 1,
  },

  // Upload Section
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
    marginBottom: hp(2),
  },
  uploadBox: {
    alignItems: 'center',
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#333',
    width: wp('43%'),
    height: wp('27%'),
    justifyContent: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 8,
  },
  fileIcon: {
    marginBottom: wp(2),
  },
  uploadText: {
    fontSize: wp(3.5),
    color: '#333333',
  },
});
