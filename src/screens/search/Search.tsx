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
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  ApiResponse,
  Productss,
  RootStackParamList,
} from '../../types/navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/common/header/Header';
import ProductCard from '../../components/common/productCard/ProductCard';
import {Icon} from 'react-native-elements';
import {ThemeContext} from '../../context/ThemeContext';
import {apiHelper} from '../../services/api';

const Search: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchedProducts, setFetchedProducts] = useState<Productss[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Productss[]>([]);

  const {theme} = useContext(ThemeContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response: ApiResponse = await apiHelper({
          method: 'GET',
          endpoint: 'products',
        });
        const product = Array.isArray(response?.data) ? response.data : [];
        setFetchedProducts(product);
        setFilteredProducts(product);
      } catch (error: any) {
        setFetchedProducts([]);
        setFilteredProducts([]);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(fetchedProducts);
    } else {
      const filteredData = fetchedProducts.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredProducts(filteredData);
    }
  }, [searchQuery, fetchedProducts]);

  const displayedProducts = React.useMemo(() => {
    if (searchQuery.trim() === '') {
      return fetchedProducts.slice(0, 7);
    } else {
      return filteredProducts.slice(0, 7);
    }
  }, [filteredProducts, fetchedProducts, searchQuery]);

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Animatable.View animation="fadeInDown" duration={1000}>
          <Header title="Search" onBackPress={() => navigation.goBack()} />
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          duration={1000}
          delay={300}
          style={styles.searchContainer}>
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
          {/* <Animatable.View animation="pulse" iterationCount={1} duration={1000}>
            <TouchableOpacity style={styles.filterButton}>
              <FilterIcon width={24} height={24} />
            </TouchableOpacity>
          </Animatable.View> */}
        </Animatable.View>

        <FlatList
          data={displayedProducts}
          keyExtractor={item => item.id.toString()}
          renderItem={({item, index}) => {
            const imageSource = item.featured_image
              ? {uri: item.featured_image}
              : {
                  uri: 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
                };
            return (
              <Animatable.View
                animation="fadeInUp"
                duration={800}
                delay={600 + index * 200}>
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
              duration={800}
              delay={600}
              style={styles.noResults}>
              <Icon name="search-off" size={50} color="#888" />
              <Text style={styles.searchInput}>No Result Found</Text>
            </Animatable.View>
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
