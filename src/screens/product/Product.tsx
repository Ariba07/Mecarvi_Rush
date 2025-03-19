/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  Platform,
  Image,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  ScrollView,
  TextInput,
  Dimensions,
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
import CustomTextInput from '../../components/common/textInput/CustomTextInput';
import File from '../../assets/images/File.svg';
import {styles} from '../../assets/styles/product/Product';
import DocumentPicker from 'react-native-document-picker';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

const images = [
  require('../../assets/images/product.png'),
  require('../../assets/images/s1.png'),
  require('../../assets/images/Orders.png'),
];

const attributes = [
  {
    label: 'Sidewalk Sign Size',
    placeholder: 'Sidewalk Sign Size',
    key: 'size',
    isMultiSelect: false,
  },
  {
    label: 'Sidewalk Sign Material',
    placeholder: 'Sidewalk Sign Material',
    key: 'material',
    isMultiSelect: false,
  },
  {
    label: 'Sidewalk Sign Hardware',
    placeholder: 'Sidewalk Sign Hardware',
    key: 'hardware',
    isMultiSelect: false,
  },
  {
    label: 'Sidewalk Sign Artwork',
    placeholder: 'Sidewalk Sign Artwork',
    key: 'artwork',
    isMultiSelect: true,
  }, // Example Multi-Select
];

const tabs = ['Specification', 'Policy', 'Reviews'];
const screenWidth = Dimensions.get('window').width;
const tabWidth = screenWidth / tabs.length;

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
  const [reviewText, setReviewText] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [frontFile, setFrontFile] = useState<any | null>(null);
  const [backFile, setBackFile] = useState<any | null>(null);
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme

  const colors = ['grey', '#cccccc'];

  const [attributeValues, setAttributeValues] = useState<{
    [key: string]: string;
  }>({});

  const handleChange = (key: string, value: string | string[]) => {
    if (Array.isArray(value)) {
      value = value.join(', ');
    }
    setAttributeValues(prevValues => ({...prevValues, [key]: value}));
  };

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

  const pickDocument = async (setFile: Function) => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images], // Allow only images
      });

      console.log('Selected File:', res); // Debugging: check selected file details
      setFile(res); // Set the entire file object in state
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the document picker');
      } else {
        console.log('Error picking document:', err);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Header title="Detail" onBackPress={() => navigation.goBack()} />
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? undefined : hp(1),
          }} // Add extra padding
          keyboardShouldPersistTaps="handled">
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
              <Text style={[styles.bestSellerText, {color: theme.bottom}]}>
                Best Seller
              </Text>
            </View>

            {/* Product Title & Rating */}
            <View style={styles.productInfoContainer}>
              <View>
                <Text style={[styles.productTitle, {color: theme.input}]}>
                  Signage
                </Text>
                <View style={styles.ratingContainer}>
                  {renderStars(Number('4.5'))}
                  <Text style={[styles.ratingText, {color: theme.input}]}>
                    4.5
                  </Text>
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
                    activeTab === index && [
                      styles.activeTabText,
                      {color: theme.input},
                    ],
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
                    <Text style={[styles.specLabel, {color: theme.text}]}>
                      {item.label}:
                    </Text>
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
              <Text style={styles.contentText}>No Reviews Found</Text>
            )}
          </View>

          {/** Attributes */}
          <View style={styles.attributeContainer}>
            {attributes.map(attr => (
              <View key={attr.key} style={{marginBottom: hp(2)}}>
                <Text style={[styles.label, {color: theme.text}]}>
                  {attr.label}
                </Text>
                <CustomTextInput
                  placeholder={attr.placeholder}
                  value={attributeValues[attr.key] || ''}
                  width={wp(90)}
                  onChangeText={text => handleChange(attr.key, text)}
                />
              </View>
            ))}

            {/* Color Options */}
            <Text style={[styles.label, {color: theme.text}]}>Color</Text>
            <View style={styles.colorOptionsContainer}>
              {colors.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorOption,
                    {backgroundColor: color},
                    selectedColor === color && styles.selectedBorder,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            {/* Upload Logo/Artwork */}
            <Text style={[styles.label, {color: theme.text}]}>
              Upload Logo/Artwork
            </Text>
            <View style={styles.uploadContainer}>
              <TouchableOpacity
                style={styles.uploadBox}
                onPress={() => pickDocument(setFrontFile)}>
                {frontFile ? (
                  <Image
                    source={{uri: frontFile.uri}}
                    style={styles.uploadedImage}
                  />
                ) : (
                  <>
                    <File
                      width={wp(10)}
                      height={wp(10)}
                      style={styles.fileIcon}
                    />
                    <Text style={[styles.uploadText, {color: theme.text}]}>
                      Front Image
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadBox}
                onPress={() => pickDocument(setBackFile)}>
                {backFile ? (
                  <Image
                    source={{uri: backFile.uri}}
                    style={styles.uploadedImage}
                  />
                ) : (
                  <>
                    <File
                      width={wp(10)}
                      height={wp(10)}
                      style={styles.fileIcon}
                    />
                    <Text style={[styles.uploadText, {color: theme.text}]}>
                      Back Image
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, {color: theme.text}]}>Order Notes</Text>
            <TextInput
              style={[
                styles.input,
                {color: theme.input, backgroundColor: theme.backgroundColor},
              ]}
              placeholder="Write description"
              multiline
              value={reviewText}
              onChangeText={setReviewText}
              placeholderTextColor={'#9c9c9c'}
            />
            <View style={styles.buttonContainer}>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('Cart')}>
                  <Text
                    style={[styles.buttonText, {color: theme.backgroundColor}]}>
                    Choose for me
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('Quote')}>
                  <Text
                    style={[styles.buttonText, {color: theme.backgroundColor}]}>
                    Request a Quote
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.button, styles.fullWidthButton]}
                onPress={() =>
                  navigation.navigate('MarketPlace', {fromProduct: true})
                }>
                <Text
                  style={[styles.buttonText, {color: theme.backgroundColor}]}>
                  Add Marketplace
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Product;
