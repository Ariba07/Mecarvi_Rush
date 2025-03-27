/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
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
import {ThemeContext} from '../../helperUtils/theme/ThemeContext';

interface ProductCardProps {
  name: string;
  price: string;
  image: any;
  status: string;
  color: string;
  borderColor?: string;
  uuid?: string;
  id?: number;
}

const OrderCard: React.FC<ProductCardProps> = ({
  name,
  price,
  image,
  status,
  color,
  borderColor,
  uuid,
  id,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme

  return (
    <TouchableOpacity
      disabled={status === 'Add Your Price' || status === 'Add to cart'}
      style={[styles.card, {backgroundColor: theme.backgroundColor}]}
      onPress={() => {
        navigation.navigate('ServiceProviderOrderDetail');
      }}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="cover" />
      </View>

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={[styles.name, {color: theme.text}]}>{name}</Text>

        {/* Ratings */}
        {status !== 'Add Your Price' && status !== 'Add to cart' && (
          <View style={styles.ratingContainer}>
            <Text style={[styles.rating, {color: theme.text}]}>
              New York,USA .2m ago
            </Text>
          </View>
        )}

        {/* Add to Cart Button */}
        <TouchableOpacity
          disabled={status !== 'Add Your Price' && status !== 'Add to cart'}
          onPress={() => {
            if (status === 'Add Your Price') {
              if (uuid) {
                if (id !== undefined) {
                  navigation.navigate('ProductPrice', {
                    product_uuid: uuid,
                    id: id,
                  });
                } else {
                  console.error('ID is undefined');
                }
              } else {
                console.error('UUID is undefined');
              }
            }
          }}
          style={[
            styles.cartButton,
            {
              backgroundColor:
                status === 'Add Your Price' ? theme.whole : color,
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
      <Text style={[styles.price, {color: theme.text}]}>{price}</Text>
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
