import React, {useContext} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/screenTypes/ScreenTypes';
import {ThemeContext} from '../../helperUtils/theme/ThemeContext';
import {useDispatch} from 'react-redux';
import {setProductUuid} from '../../../slice/Slice';

interface ProductCardProps {
  productUuid: string; // Explicitly pass product_uuid as a prop
  name: string;
  price: number;
  image: any;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productUuid,
  name,
  price,
  image,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      style={[styles.card, {backgroundColor: theme.backgroundColor}]}
      onPress={() => {
        navigation.navigate('Product');
        dispatch(setProductUuid(productUuid)); // Use productUuid instead of key
      }}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="cover" />
      </View>

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={[styles.name, {color: theme.text}]}>{name}</Text>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => {
            navigation.navigate('Product');
            dispatch(setProductUuid(productUuid)); // Use productUuid instead of key
          }}>
          <Icon name="cart" size={wp('4%')} color="white" />
          <Text style={styles.cartText}>Add to cart</Text>
        </TouchableOpacity>
      </View>

      {/* Price */}
      <Text style={[styles.price, {color: theme.text}]}>$ {price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: wp('2%'),
    borderRadius: wp('4%'),
    marginVertical: hp('1%'),
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
    marginLeft: wp('2%'),
    fontSize: wp('3%'),
    fontWeight: '600',
    color: '#666',
  },
  cartButton: {
    flexDirection: 'row',
    backgroundColor: '#03A7A7',
    paddingVertical: hp('0.5%'),
    width: wp('27%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('1%'),
    justifyContent: 'center',
  },
  cartText: {
    color: 'white',
    fontSize: wp('3.5%'),
    fontWeight: '600',
    marginLeft: wp('2%'),
  },
  price: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-end',
    marginRight: wp(4),
  },
});

export default ProductCard;
