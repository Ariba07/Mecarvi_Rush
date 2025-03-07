import {View, Platform, StyleSheet, SafeAreaView} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';

const ProductPrice = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          title="Product Pricing"
          onBackPress={() => navigation.goBack()}
        />
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
});

export default ProductPrice;
