/* eslint-disable @typescript-eslint/no-unused-vars */
import {View, Platform, StyleSheet, SafeAreaView} from 'react-native';
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
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {selectServicesOffered} from '../../slice/Slice';
import {useSelector} from 'react-redux';

const ServicesProducts = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const [products, setProducts] = useState<Productss[]>([]);
  const services = useSelector(selectServicesOffered); // Array of service IDs

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Construct the query string with multiple category_id[] parameters
        const queryString = (services || [])
          .map(serviceId => `category_id[]=${serviceId}`)
          .join('&');
        const endpoint = `products${queryString ? `?${queryString}` : ''}`;

        const response: {data: Productss[]} = await apiHelper({
          method: 'GET',
          endpoint: endpoint, // e.g., products?category_id[]=1&category_id[]=2
        });

        const fetchedProducts = response?.data || [];
        setProducts(fetchedProducts);
      } catch (error) {
        console.warn('Error fetching products:', error);
      }
    };

    // Only fetch products if services array is not empty
    if (services && services.length > 0) {
      fetchProducts();
    }
  }, [services]); // Re-run when services change

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header title="My Products" onBackPress={() => navigation.goBack()} />
        {/* <FlatList
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
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No products found for the selected services
            </Text>
          }
        /> */}
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
      ios: hp(1),
      android: hp(1),
    }),
  },
  emptyText: {
    fontSize: wp(4),
    color: '#666',
    textAlign: 'center',
    marginTop: hp(5),
  },
});

export default ServicesProducts;
