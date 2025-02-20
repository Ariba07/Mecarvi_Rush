import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
import React from 'react';
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
    name: 'SideWalk Sign Board',
    price: '$220',
    image: require('../../assets/images/s1.png'),
  },
  {
    id: '4',
    name: 'SideWalk Sign Board',
    price: '$220',
    image: require('../../assets/images/s1.png'),
  },
];

const Product: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
              placeholder="Search"
              placeholderTextColor="#888"
            />
          </View>
        </View>

        <FlatList
          data={products}
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
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
    paddingBottom: Platform.select({
      ios: hp(4),
      android: hp(8),
    }),
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
  filterButton: {
    width: hp(6),
    height: hp(6),
    backgroundColor: '#FF00A6',
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(2),
  },
});

export default Product;
