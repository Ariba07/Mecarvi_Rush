/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  Platform,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
  Easing,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/common/header/Header';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {Icon} from 'react-native-elements';
import BestSeller from '../../assets/images/BestSeller.svg';
import {renderStars} from '../../components/common/review/RenderStars';

const images = [
  require('../../assets/images/product.png'),
  require('../../assets/images/s1.png'),
  require('../../assets/images/Orders.png'),
];

const tabs = ['Specification', 'Policy', 'Reviews'];
const screenWidth = Dimensions.get('window').width;
const tabWidth = screenWidth / tabs.length; // Adjust tab width dynamically

const specifications = [
  {label: 'Frame Material', value: 'Aluminum, Plastic'},
  {
    label: 'Sign Material',
    value: 'PVC Board, 4mm/10mm Corrugated Plastic Cardboard or 0.040 Aluminum',
  },
  {label: 'Base Type', value: 'Water Base'},
  {label: 'Display (Printed Side)', value: 'Single Sided, Double Sided'},
  {label: 'Printing Technology', value: 'UV Printing (longer durability)'},
  {label: 'Placement Type', value: 'Floor Standing'},
  {label: 'Orientation', value: 'Portrait'},
  {label: 'Loading Type', value: 'Snap-Open'},
  {
    label: 'Features',
    value:
      'Scratch-Free, Water & Weather Resistant, Outdoor Sign, Portable, Sturdy',
  },
  {
    label: 'Sign Size',
    value: '20W x 28H inches, 24W x 36H inches, 30W x 40H inches',
  },
  {label: 'Color', value: 'Silver, Black'},
  {label: 'Weight', value: '75 lbs'},
];

const Product = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0); // Default selected tab
  const translateX = useRef(new Animated.Value(activeTab * tabWidth)).current; // Initial position

  const animateUnderline = (index: number) => {
    setActiveTab(index);
    Animated.timing(translateX, {
      toValue: index * tabWidth,
      duration: 300, // Smooth animation
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
  };

  const goToNextImage = () => {
    setCurrentIndex(prevIndex =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0,
    );
  };

  const goToPreviousImage = () => {
    setCurrentIndex(prevIndex =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1,
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Header title="Detail" onBackPress={() => navigation.goBack()} />
        </View>

        <ScrollView>
          {/* Image Slider Section */}
          <View style={styles.imageSliderContainer}>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={goToPreviousImage}>
              <Icon
                name="chevron-back"
                size={wp(5)}
                color={'grey'}
                type="ionicon"
              />
            </TouchableOpacity>

            <Image source={images[currentIndex]} style={styles.productImage} />

            <TouchableOpacity
              style={styles.navigationButton}
              onPress={goToNextImage}>
              <Icon
                name="chevron-forward"
                size={wp(5)}
                color={'grey'}
                type="ionicon"
              />
            </TouchableOpacity>
          </View>
          {/* Product Details Section */}
          <View style={styles.productDetailsContainer}>
            {/* Best Seller Tag */}
            <View style={styles.bestSellerBadge}>
              <BestSeller width={wp(3)} height={hp(3)} />
              <Text style={styles.bestSellerText}>Best Seller</Text>
            </View>

            {/* Product Title & Rating */}
            <View style={styles.productInfoContainer}>
              <View>
                <Text style={styles.productTitle}>Signage</Text>
                <View style={styles.ratingContainer}>
                  {renderStars(Number('4.5'))}
                  <Text style={styles.ratingText}>4.5</Text>
                </View>
              </View>
              {/* Price */}
              <Text style={styles.productPrice}>$250</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tabButton}
                onPress={() => animateUnderline(index)}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === index && styles.activeTabText,
                  ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
            {/* Animated Underline */}
            <Animated.View
              style={[styles.underline, {transform: [{translateX}]}]}
            />
          </View>

          {/* Tab Content */}
          <View style={styles.contentContainer}>
            {activeTab === 0 && (
              <View>
                {specifications.map((item, index) => (
                  <View key={index} style={styles.specRow}>
                    <Text style={styles.specLabel}>{item.label}:</Text>
                    <Text style={styles.specValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 1 && (
              <Text style={styles.policyText}>
                Customer satisfaction is our priority. Our goal is to always
                exceed your expectation with our quality of service so that
                you’ll be happy with your purchase. We accept returns on all our
                blank or hardware products except customized products. Items
                that you wish to return must be unused and must be returned in
                its original packaging within ten (10) days after your order was
                delivered. Please be advised that custom products cannot be
                returned for a refund, store credit, or replacement, unless the
                product has a manufacturer defect, or we’ve made a mistake
                in the production process. If there is an issue with the
                products you receive, please send us an email with your order
                number and photos of the defective items to
                <Text style={{textDecorationLine: 'underline'}}>
                  customerservice@mecarviprints.com
                </Text>
                . Rest assured, we'll provide you with options to resolve the
                issue as quickly as possible.
              </Text>
            )}
            {activeTab === 2 && (
              <Text style={styles.contentText}>Reviews Content</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    width: wp(22),
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
});

export default Product;
