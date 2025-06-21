/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Text,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  Productss,
  RootStackParamList,
} from '../../components/types/screenTypes/ScreenTypes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/common/header/Header';
import ProductCard from '../../components/common/productCard/ProductCard';
import {Icon} from 'react-native-elements';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {selectServiceUuid} from '../../slice/Slice';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {useSelector} from 'react-redux';
import * as Animatable from 'react-native-animatable';

// Define the API response type
interface ApiResponse {
  data: Productss[];
}

const Products: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchedProducts, setFetchedProducts] = useState<Productss[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Productss[]>([]);
  const {theme} = useContext(ThemeContext);
  const serviceId = useSelector(selectServiceUuid);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!serviceId) {
        console.warn('No serviceId available to fetch products.');
        setFetchedProducts([]);
        setFilteredProducts([]);
        return;
      }

      try {
        const queryString = `category_id[]=${serviceId}`;
        const endpoint = `products?${queryString}`;
        console.log('Fetching products with endpoint:', endpoint);

        const response: ApiResponse = await apiHelper({
          method: 'GET',
          endpoint: endpoint,
        });

        const products = response?.data || [];
        setFetchedProducts(products);
        setFilteredProducts(products);
      } catch (error: any) {
        console.warn('Error fetching products:', error.message || error);
        setFetchedProducts([]);
        setFilteredProducts([]);
      }
    };

    fetchProducts();
  }, [serviceId]);

  useEffect(() => {
    const filteredData = fetchedProducts.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredProducts(filteredData);
  }, [searchQuery, fetchedProducts]);

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: theme.whole || '#F5F7FA'}]}>
      <View style={styles.container}>
        <Header title="Search" onBackPress={() => navigation.goBack()} />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.inputWrapper,
              {backgroundColor: theme.backgroundColor || '#fff'},
            ]}>
            <Icon name="search" size={20} color={theme.text || '#888'} />
            <TextInput
              style={[styles.searchInput, {color: theme.input || '#333'}]}
              placeholder="Search products..."
              placeholderTextColor={theme.text ? theme.text + '80' : '#888'}
              value={searchQuery}
              onChangeText={text => setSearchQuery(text)}
            />
          </View>
        </View>

        {/* Product List with animation */}
        <Animatable.View
          animation="fadeIn"
          duration={400}
          useNativeDriver
          style={{flex: 1}}>
          <FlatList
            data={filteredProducts}
            keyExtractor={item => item.product_uuid}
            renderItem={({item, index}) => {
              const imageSource = item.featured_image
                ? {uri: item.featured_image}
                : {
                    uri: 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
                  };

              return (
                <Animatable.View
                  animation="fadeInUp"
                  delay={index * 100}
                  duration={500}
                  useNativeDriver>
                  <ProductCard
                    key={item.id}
                    name={item.name}
                    price={item.price}
                    image={imageSource}
                    productUuid={item.product_uuid}
                  />
                </Animatable.View>
              );
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Animatable.View
                animation="fadeIn"
                duration={600}
                useNativeDriver
                style={styles.noResults}>
                <Icon name="search-off" size={50} color="#888" />
                <Text style={styles.noResultsText}>No products found</Text>
              </Animatable.View>
            }
          />
        </Animatable.View>
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
    paddingHorizontal: Platform.select({ios: wp(6), android: wp(5)}),
    paddingBottom: Platform.select({ios: hp(4), android: hp(3)}),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    height: hp(6),
  },
  searchInput: {
    flex: 1,
    marginLeft: wp(2),
    fontSize: wp(4),
    color: '#333',
  },
  noResults: {
    alignItems: 'center',
    marginTop: hp(5),
  },
  noResultsText: {
    fontSize: wp(4),
    color: '#888',
    marginTop: hp(1),
  },
});

export default Products;
