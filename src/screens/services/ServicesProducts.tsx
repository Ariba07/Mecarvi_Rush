import {View, Platform, StyleSheet, SafeAreaView, FlatList} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/common/header/Header';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  Productss,
  RootStackParamList,
} from '../../components/types/screenTypes/ScreenTypes';
import OrderCard from '../../components/common/orderCard/OrderCard';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';

const ServicesProducts = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme
  const [products, setProducts] = useState<Productss[]>([]); // Type state with Product

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response: {data: Productss[]} = await apiHelper({
          method: 'GET',
          endpoint: 'products',
        });
        const fetchedProduct = response?.data || [];
        setProducts(fetchedProduct);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []); // Empty
  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header title="My Products" onBackPress={() => navigation.goBack()} />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={products}
          keyExtractor={item => item.product_uuid}
          renderItem={({item}) => (
            <OrderCard
              key={item.id}
              name={item.name}
              price={String(item.price)}
              image={require('../../assets/images/Orders.png')}
              status="Add Your Price"
              color="#ffffff"
              borderColor="#03A7A7"
              uuid={item.product_uuid}
              id={item.id}
            />
          )}
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
      ios: wp(6), // Slightly more padding on iOS
      android: wp(5),
    }),
    paddingBottom: Platform.select({
      ios: hp(1),
      android: hp(1),
    }),
  },
});

export default ServicesProducts;
