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

// Define the API response type
interface ApiResponse {
  data: Productss[];
}

const Products: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchedProducts, setFetchedProducts] = useState<Productss[]>([]); // Source data
  const [filteredProducts, setFilteredProducts] = useState<Productss[]>([]); // Filtered data
  const {theme} = useContext(ThemeContext);
  const serviceId = useSelector(selectServiceUuid);
  // Use featured_image if available, otherwise fall back to a dummy image

  // Fetch products when serviceId changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (!serviceId) {
        console.warn('No serviceId available to fetch products.');
        setFetchedProducts([]);
        setFilteredProducts([]);
        return;
      }

      try {
        // Format category_id as an array (category_id[]=value)
        const queryString = `category_id[]=${serviceId}`;
        const endpoint = `products?${queryString}`;

        console.log('Fetching products with endpoint:', endpoint);

        const response: ApiResponse = await apiHelper({
          method: 'GET',
          endpoint: endpoint, // e.g., products?category_id[]=83
        });

        const products = response?.data || [];
        setFetchedProducts(products); // Set source data
        setFilteredProducts(products); // Initialize filtered data
      } catch (error: any) {
        console.warn('Error fetching products:', error.message || error);
        setFetchedProducts([]);
        setFilteredProducts([]);
      }
    };

    fetchProducts();
  }, [serviceId]);

  // Filter products when searchQuery changes
  useEffect(() => {
    const filteredData = fetchedProducts.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredProducts(filteredData);
  }, [searchQuery, fetchedProducts]); // Depend on searchQuery and fetchedProducts

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

        {/* Product List */}
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.product_uuid}
          renderItem={({item}) => {
            // Use featured_image if available, otherwise fall back to a dummy image
            const imageSource = item.featured_image
              ? {uri: item.featured_image}
              : {
                  uri: 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
                };
            return (
              <ProductCard
                key={item.id}
                name={item.name}
                price={item.price}
                image={imageSource}
                productUuid={item.product_uuid}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.noResults}>
              <Icon name="search-off" size={50} color="#888" />
              <Text style={styles.noResultsText}>No products found</Text>
            </View>
          }
        />
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
