import {
  View,
  Platform,
  StyleSheet,
  SafeAreaView,
  Image,
  Text,
  TextInput,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import {renderStars} from '../../components/common/review/RenderStars';
import CustomButton from '../../components/common/buttons/CustomButton';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

const ProductPrice = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [price, setPrice] = useState<string>('');
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header
          title="Product Pricing"
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.imageSliderContainer}>
          <Image
            source={require('../../assets/images/Orders.png')}
            style={styles.productImage}
          />
        </View>
        {/* Product Title & Rating */}
        <View style={styles.productInfoContainer}>
          <View>
            <Text style={[styles.productTitle, {color: theme.input}]}>
              Signage Sign Board
            </Text>
            <View style={styles.ratingContainer}>
              {renderStars(Number('4.5'))}
              <Text style={[styles.ratingText, {color: theme.input}]}>4.5</Text>
            </View>
          </View>
          {/* Price */}
          <Text style={styles.productPrice}>$250</Text>
        </View>

        <View style={{marginVertical: wp(3)}}>
          <Text style={[styles.label, {color: theme.text}]}>
            Add Your Price
          </Text>
          <TextInput
            style={[styles.input, {color: theme.input}]}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="Enter price"
            placeholderTextColor={'#999'}
          />
        </View>
        <CustomButton title="Submit" onPress={() => navigation.goBack()} />
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
  imageSliderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: wp(6),
  },
  productImage: {
    width: wp(70),
    height: hp(30),
    resizeMode: 'contain',
  },
  productInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: wp(3),
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#000000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(0.5),
  },
  ratingText: {
    fontSize: wp(3),
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: wp(1),
  },
  productPrice: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#FF0080',
  },
  label: {
    fontSize: wp(3.5),
    fontWeight: '500',
    marginBottom: hp(0.5),
    color: '#333',
  },
  input: {
    height: hp(5.5),
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    fontSize: wp(3.5),
    color: '#333',
    marginBottom: hp(1.5),
  },
});

export default ProductPrice;
