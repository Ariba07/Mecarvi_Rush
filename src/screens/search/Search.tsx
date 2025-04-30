import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  ApiResponse,
  Productss,
  RootStackParamList,
} from '../../components/types/screenTypes/ScreenTypes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/common/header/Header';
import ProductCard from '../../components/common/productCard/ProductCard';
import FilterIcon from '../../assets/images/FilterIcon.svg';
import {Icon} from 'react-native-elements';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';

const Search: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchedProducts, setFetchedProducts] = useState<Productss[]>([]); // Source data
  const [filteredProducts, setFilteredProducts] = useState<Productss[]>([]); // Filtered data
  const {theme} = useContext(ThemeContext);

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response: ApiResponse = await apiHelper({
          method: 'GET',
          endpoint: 'products',
        });
        const product = Array.isArray(response?.data) ? response.data : [];
        setFetchedProducts(product); // Set source data
        setFilteredProducts(product); // Initialize filtered data
      } catch (error) {
        console.warn('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // If search is empty, show all products (will be sliced later)
      setFilteredProducts(fetchedProducts);
    } else {
      // Filter based on search query
      const filteredData = fetchedProducts.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredProducts(filteredData);
    }
  }, [searchQuery, fetchedProducts]);

  // Determine displayed products: prioritize search matches, limit to 7
  const displayedProducts = React.useMemo(() => {
    if (searchQuery.trim() === '') {
      // No search query: show first 7 products
      return fetchedProducts.slice(0, 7);
    } else {
      // With search query: show up to 7 matching products
      return filteredProducts.slice(0, 7);
    }
  }, [filteredProducts, fetchedProducts, searchQuery]);

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header title="Search" onBackPress={() => navigation.goBack()} />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.inputWrapper,
              {backgroundColor: theme.backgroundColor},
            ]}>
            <Icon name="search" size={20} color={'#333333'} />
            <TextInput
              style={[styles.searchInput, {color: theme.input}]}
              placeholder="Search items..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={text => setSearchQuery(text)}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <FilterIcon width={24} height={24} />
          </TouchableOpacity>
        </View>

        {/* Product List */}
        <FlatList
          data={displayedProducts} // Use prioritized displayed products
          keyExtractor={item => item.id.toString()}
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
              <Text style={styles.searchInput}>No Result Found</Text>
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
    marginBottom: hp(2),
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
  filterButton: {
    width: hp(6),
    height: hp(6),
    backgroundColor: '#FF00A6',
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(2),
  },
  noResults: {
    alignItems: 'center',
    marginTop: hp(5),
  },
});

export default Search;
