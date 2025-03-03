import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Text,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/common/header/Header';
import ProductCard from '../../components/common/productCard/ProductCard';
import {Icon} from 'react-native-elements';

const products = [
  {
    id: '1',
    name: 'Aluminium Sign',
    price: '$220',
    image: require('../../assets/images/s1.png'),
  },
  {
    id: '2',
    name: 'SideWalk Sign Board',
    price: '$220',
    image: require('../../assets/images/s1.png'),
  },
  {
    id: '3',
    name: 'Custom Banner',
    price: '$180',
    image: require('../../assets/images/s1.png'),
  },
  {
    id: '4',
    name: 'Vinyl Sticker',
    price: '$150',
    image: require('../../assets/images/s1.png'),
  },
];

const Products: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    const filteredData = products.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredProducts(filteredData);
  }, [searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Search" onBackPress={() => navigation.goBack()} />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.inputWrapper}>
            <Icon name="search" size={20} color={'#333333'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={text => setSearchQuery(text)}
            />
          </View>
        </View>

        {/* Product List */}
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <ProductCard
              key={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          )}
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
