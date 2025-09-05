/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useRef, useState} from 'react';
import {SafeAreaView, ScrollView, Platform, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  RootStackParamList,
  ApiResponse,
  Attribute,
  Products,
} from '../../components/types/screenTypes/ScreenTypes';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useSelector} from 'react-redux';
import {selectProductUuid} from '../../slice/Slice';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import Header from '../../components/common/header/Header';
import {styles} from '../../assets/styles/product/Product';
import {Animated} from 'react-native';
import * as Animatable from 'react-native-animatable';
import AttributesSection from './AttributeSection';
import ImageSlider from './ImageSlider';
import ProductDetails from './ProductDetails';
import TabContent from './TabContent';
import TabNavigation from './TabNavigation';

export const tabs = ['Specification', 'Policy'];

const Product = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const productUuid = useSelector(selectProductUuid);
  const [productData, setProductData] = useState<Products | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false); // Added to prevent duplicate API calls
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [frontFile, setFrontFile] = useState<any | null>(null);
  const [backFile, setBackFile] = useState<any | null>(null);
  const [attributeValues, setAttributeValues] = useState<{
    [key: string]: string;
  }>({});
  const [finalPrice, setFinalPrice] = useState<number>(0);

  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productUuid || hasFetched) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        console.log('Fetching product for UUID:', productUuid);
        const response: ApiResponse = await apiHelper({
          method: 'GET',
          endpoint: `products/${productUuid}`,
        });
        console.log('Product Data Response:', response.data);
        setProductData(response.data);
        setHasFetched(true); // Set flag after successful fetch
      } catch (error) {
        console.warn('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productUuid, hasFetched]);

  // Reset hasFetched when productUuid changes
  useEffect(() => {
    setHasFetched(false);
  }, [productUuid]);

  const attributes: Attribute[] =
    productData?.attributes.map((attr: any) => ({
      label:
        attr.general_attribute.name || `Attribute ${attr.general_attribute.id}`,
      placeholder: attr.attribute_values[0]?.attribute_name || 'Select',
      key: attr.general_attribute.name,
      options: attr.attribute_values.map((val: any) => val.attribute_name),
    })) || [];

  const dynamicSpecifications = productData
    ? [
        {
          label: 'Specifications',
          value: productData.specifications || 'N/A',
        },
        {
          label: 'Category',
          value: productData.category?.name || 'N/A',
        },
        {
          label: 'Type',
          value: productData.type || 'N/A',
        },
        {
          label: 'Description',
          value: productData.description || 'N/A',
        },
        {
          label: 'Size Variations',
          value:
            productData.size_variations
              .map((v: any) => v.size_name)
              .join(', ') || 'N/A',
        },
        {
          label: 'Attributes',
          value:
            productData.attributes
              .map((attr: any) =>
                attr.attribute_values
                  .map((val: any) => val.attribute_name)
                  .join(', '),
              )
              .join(', ') || 'N/A',
        },
        {
          label: 'Manufacturer',
          value: productData.manufacturer || 'N/A',
        },
      ]
    : [];

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header title="Detail" onBackPress={() => navigation.goBack()} />
        </View>
        {loading ? (
          <Text style={{color: theme.text, textAlign: 'center'}}>
            Loading...
          </Text>
        ) : (
          <ScrollView
            contentContainerStyle={{
              paddingBottom: Platform.OS === 'ios' ? undefined : hp(1),
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Animatable.View animation="fadeIn" duration={800}>
              <ImageSlider
                productData={productData}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            </Animatable.View>
            <Animatable.View animation="fadeIn" duration={800} delay={200}>
              <ProductDetails
                productData={productData}
                theme={theme}
                attributeValues={attributeValues}
                selectedSize={selectedSize}
                setFinalPrice={setFinalPrice}
              />
            </Animatable.View>
            <Animatable.View animation="fadeIn" duration={800} delay={400}>
              <TabNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                translateX={translateX}
                theme={theme}
              />
            </Animatable.View>
            <Animatable.View animation="fadeIn" duration={800} delay={600}>
              <TabContent
                activeTab={activeTab}
                dynamicSpecifications={dynamicSpecifications}
                refundPolicy={productData?.refund_policy}
                theme={theme}
              />
            </Animatable.View>
            <Animatable.View animation="fadeIn" duration={800} delay={800}>
              <AttributesSection
                attributes={attributes}
                attributeValues={attributeValues}
                setAttributeValues={setAttributeValues}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                frontFile={frontFile}
                setFrontFile={setFrontFile}
                backFile={backFile}
                setBackFile={setBackFile}
                reviewText={reviewText}
                setReviewText={setReviewText}
                theme={theme}
                navigation={navigation}
                productData={productData}
                productUuid={productUuid}
                finalPrice={finalPrice}
              />
            </Animatable.View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Product;
