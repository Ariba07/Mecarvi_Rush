import {View, Platform, StyleSheet, SafeAreaView, FlatList} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/common/header/Header';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {products} from '../../components/helperUtils/orderTypes/Types';
import OrderCard from '../../components/common/orderCard/OrderCard';

const ServicesProducts = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="My Products" onBackPress={() => navigation.goBack()} />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={products}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <OrderCard
              key={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              status="Add Your Price"
              color="#ffffff"
              borderColor="#03A7A7"
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
