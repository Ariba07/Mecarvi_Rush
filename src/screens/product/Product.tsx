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
} from '../../components/types/screenTypes/ScreenTypes';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useSelector} from 'react-redux';
import {selectProductUuid} from '../../slice/Slice';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import Header from '../../components/common/header/Header';

import {styles} from '../../assets/styles/product/Product';
import {Animated} from 'react-native';
import AttributesSection from './AttributeSection';
import ImageSlider from './ImageSlider';
import ProductDetails from './ProductDetails';
import TabContent from './TabContent';
import TabNavigation from './TabNavigation';

export const tabs = ['Specification', 'Policy', 'Reviews'];

const Product = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const productUuid = useSelector(selectProductUuid);
  const [productData, setProductData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [frontFile, setFrontFile] = useState<any | null>(null);
  const [backFile, setBackFile] = useState<any | null>(null);
  const [attributeValues, setAttributeValues] = useState<{
    [key: string]: string;
  }>({});
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productUuid) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response: ApiResponse = await apiHelper({
          method: 'GET',
          endpoint: `products/${productUuid}`,
        });
        setProductData(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productUuid]);

  const attributes: Attribute[] =
    productData?.specific_attributes.map((attr: any) => ({
      label:
        attr.attribute_values[0]?.additional_info || `Attribute ${attr.id}`,
      placeholder: attr.attribute_values[0]?.value || 'Select',
      key: attr.specific_attribute_uuid,
      options: attr.attribute_values.map((val: any) => val.value),
    })) || [];

  const dynamicSpecifications = productData
    ? [
        {
          label: 'Frame Material',
          value: productData.specifications?.size || 'N/A',
        },
        {
          label: 'Sign Material',
          value: productData.specifications?.color || 'N/A',
        },
        {label: 'Base Type', value: productData.type || 'N/A'},
        {
          label: 'Display (Printed Side)',
          value: productData.description || 'N/A',
        },
        {
          label: 'Sign Size',
          value:
            productData.size_variations
              .map((v: any) => v.size_name)
              .join(', ') || 'N/A',
        },
        {
          label: 'Color',
          value:
            productData.specific_attributes
              .map((attr: any) =>
                attr.attribute_values.map((val: any) => val.value).join(', '),
              )
              .join(', ') || 'N/A',
        },
        {label: 'Weight', value: 'N/A'},
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
            keyboardShouldPersistTaps="handled">
            <ImageSlider
              productData={productData}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
            <ProductDetails productData={productData} theme={theme} />
            <TabNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              translateX={translateX}
              theme={theme}
            />
            <TabContent
              activeTab={activeTab}
              dynamicSpecifications={dynamicSpecifications}
              refundPolicy={productData?.refund_policy}
              theme={theme}
            />
            <AttributesSection
              attributes={attributes}
              attributeValues={attributeValues}
              setAttributeValues={setAttributeValues}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              frontFile={frontFile}
              setFrontFile={setFrontFile}
              backFile={backFile}
              setBackFile={setBackFile}
              reviewText={reviewText}
              setReviewText={setReviewText}
              theme={theme}
              navigation={navigation}
            />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Product;
