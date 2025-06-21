import {
  View,
  Platform,
  StyleSheet,
  SafeAreaView,
  Image,
  Text,
  TextInput,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  ApiResponse,
  RootStackParamList,
} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import {renderStars} from '../../components/common/review/RenderStars';
import CustomButton from '../../components/common/buttons/CustomButton';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {useSelector} from 'react-redux';
import {selectToken} from '../../slice/Slice';

type ProductRouteProp = RouteProp<RootStackParamList, 'ProductPrice'>;

const ProductPrice = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [price, setPrice] = useState<string>('');
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme
  const route = useRoute<ProductRouteProp>();
  const {product_uuid, id} = route.params;
  const [productData, setProductData] = useState<any | null>(null);
  const token = useSelector(selectToken);

  // Fetch products when product_uuid changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response: ApiResponse = await apiHelper({
          method: 'GET',
          endpoint: `products/${product_uuid}`,
        });
        const product = response?.data || [];
        setProductData(product); // Set product data
      } catch (error) {
        console.warn('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [product_uuid]);

  // Fetch products when product_uuid changes
  const updatePrice = async () => {
    try {
      await apiHelper({
        method: 'POST',
        endpoint: '/service-provider/marketplace',
        data: {price: price, product_id: id},
        token: token,
      });
      navigation.goBack();
    } catch (error) {
      console.warn('Error updating Price:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header
          title="Product Pricing"
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.imageSliderContainer}>
          <Image
            source={require('../../assets/images/Orders.png')} // Placeholder, as no image URL is in the data
            style={styles.productImage}
          />
        </View>
        {/* Product Title & Rating */}
        <View style={styles.productInfoContainer}>
          <View>
            <Text style={[styles.productTitle, {color: theme.input}]}>
              {productData?.name || 'Loading...'} {/* Use product name */}
            </Text>
            <View style={styles.ratingContainer}>
              {renderStars(Number('4.5'))}
              {/* Static rating as no rating in data */}
              <Text style={[styles.ratingText, {color: theme.input}]}>4.5</Text>
            </View>
          </View>
          {/* Price */}
          <Text style={styles.productPrice}>
            ${productData?.price?.toFixed(2) || '0.00'}
            {/* Use product price */}
          </Text>
        </View>

        <View style={{marginVertical: wp(3)}}>
          <Text style={[styles.label, {color: theme.text}]}>
            Add Your Price
          </Text>
          <TextInput
            style={[styles.input, {color: theme.input}]}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="Enter price"
            placeholderTextColor={'#999'}
          />
        </View>
        <CustomButton title="Submit" onPress={() => updatePrice()} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6), // Slightly more padding on iOS
      android: wp(5),
    }),
    paddingBottom: Platform.select({
      ios: hp(4),
      android: hp(8),
    }),
  },
  imageSliderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: wp(6),
  },
  productImage: {
    width: wp(70),
    height: hp(30),
    resizeMode: 'contain',
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
  label: {
    fontSize: wp(3.5),
    fontWeight: '500',
    marginBottom: hp(0.5),
    color: '#333',
  },
  input: {
    height: hp(5.5),
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    fontSize: wp(3.5),
    color: '#333',
    marginBottom: hp(1.5),
  },
});

export default ProductPrice;
