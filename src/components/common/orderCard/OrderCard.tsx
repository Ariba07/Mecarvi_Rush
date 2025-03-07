/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/screenTypes/ScreenTypes';

interface ProductCardProps {
  name: string;
  price: string;
  image: any;
  status: string;
  color: string;
  borderColor?: string;
}

const OrderCard: React.FC<ProductCardProps> = ({
  name,
  price,
  image,
  status,
  color,
  borderColor,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity
      disabled={status === 'Add Your Price' || status === 'Add to cart'}
      style={styles.card}
      onPress={() => {
        navigation.navigate('Product');
      }}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="cover" />
      </View>

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>

        {/* Ratings */}
        {status !== 'Add Your Price' && status !== 'Add to cart' && (
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>New York,USA .2m ago</Text>
          </View>
        )}

        {/* Add to Cart Button */}
        <TouchableOpacity
          disabled={status !== 'Add Your Price' && status !== 'Add to cart'}
          onPress={() => {
            status === 'Add Your Price' && navigation.navigate('ProductPrice');
          }}
          style={[
            styles.cartButton,
            {
              backgroundColor: color,
              borderColor: borderColor,
              borderWidth: borderColor ? 1 : 0,
            },
          ]}>
          <Text
            style={[
              styles.cartText,
              {color: status === 'Add Your Price' ? borderColor : 'white'},
            ]}>
            {status}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Price */}
      <Text style={styles.price}>{price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: wp('2%'),
    borderRadius: wp('4%'),
    marginBottom: hp('1%'),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('2%'),
    overflow: 'hidden',
    backgroundColor: '#cccccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: wp('2%'),
  },
  info: {
    flex: 1,
    marginLeft: wp('4%'),
  },
  name: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: wp('3%'),
    fontWeight: '600',
    color: '#333333',
  },
  cartButton: {
    flexDirection: 'row',
    paddingVertical: hp('0.5%'),
    width: wp('27%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('1%'),
    justifyContent: 'center',
  },
  cartText: {
    fontSize: Platform.OS === 'ios' ? wp('3%') : wp('3.5%'),
    fontWeight: '600',
  },
  price: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-end',
    marginRight: wp(4),
  },
});

export default OrderCard;
