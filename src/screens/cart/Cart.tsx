/* eslint-disable react-native/no-inline-styles */
import {
  View,
  SafeAreaView,
  Platform,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useContext} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import Header from '../../components/common/header/Header';
import CustomButton from '../../components/common/buttons/CustomButton';
import {ThemeContext} from '../../context/ThemeContext';
import {useSelector, useDispatch} from 'react-redux';
import {
  selectCart,
  incrementQuantity,
  decrementQuantity,
  setTotalPrice,
} from '../../store/authSlice';
import * as Animatable from 'react-native-animatable'; // Import react-native-animatable

const Cart = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const dispatch = useDispatch();

  // Get cart items directly from Redux store
  const cartItems = useSelector(selectCart);

  console.log(cartItems);

  // Functions to handle quantity changes and dispatch to Redux
  const increaseQuantity = (productUuid: string) => {
    dispatch(incrementQuantity(productUuid));
  };

  const decreaseQuantity = (productUuid: string) => {
    dispatch(decrementQuantity(productUuid));
  };

  // Calculate totals using quantity from Redux store
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity ?? 0),
    0,
  );
  const loyaltyPoints = 0.0; // Replace with actual logic if needed
  const delivery = cartItems.reduce(
    (sum, item) => sum + (item.deliveryPrice ?? 0),
    0,
  );
  const total = subtotal + delivery + loyaltyPoints;

  // Render each cart item
  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof cartItems)[0];
    index: number;
  }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={600}
      delay={index * 100} // Staggered animation for each item
      style={[styles.itemCard, {backgroundColor: theme.backgroundColor}]}>
      <Image
        source={{
          uri:
            item.frontFile?.uri ||
            'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
        }}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, {color: theme.text}]}>{item.name}</Text>
        <Text style={styles.itemPrice}>$ {item.price.toFixed(2)}</Text>
        {item.selectedColor && (
          <Text style={styles.itemPrice}>Color: {item.selectedColor}</Text>
        )}
        {item.orderNotes && (
          <Text style={styles.itemPrice}>Notes: {item.orderNotes}</Text>
        )}
        {item.deliveryPrice !== undefined && (
          <Text style={styles.itemPrice}>
            Delivery: ${item.deliveryPrice.toFixed(2)}
          </Text>
        )}
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          onPress={() => decreaseQuantity(item.productUuid)}
          style={[styles.quantityButton, {backgroundColor: '#D3D3D380'}]}>
          <Animatable.View>
            <Text style={[styles.quantityText, {color: '#30a7a7'}]}>-</Text>
          </Animatable.View>
        </TouchableOpacity>
        <Text style={[styles.quantity, {color: theme.text}]}>
          {item.quantity}
        </Text>
        <TouchableOpacity
          onPress={() => increaseQuantity(item.productUuid)}
          style={[styles.quantityButton, {backgroundColor: '#30a7a7'}]}>
          <Animatable.View>
            <Text style={[styles.quantityText, {color: '#ffffff'}]}>+</Text>
          </Animatable.View>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header title="Cart" onBackPress={() => navigation.goBack()} />
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={item => item.productUuid}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Animatable.View animation="bounceIn" duration={800}>
              <Text style={{textAlign: 'center', color: theme.text}}>
                Your cart is empty
              </Text>
            </Animatable.View>
          }
        />
        {cartItems.length > 0 && (
          <Animatable.View
            animation="slideInUp"
            duration={600}
            style={[
              styles.summaryContainer,
              {backgroundColor: theme.backgroundColor},
            ]}>
            <View
              style={{
                borderBottomColor: '#5c5c5c',
                borderBottomWidth: 1,
                marginBottom: wp(2),
              }}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>SUB TOTAL</Text>
                <Text style={[styles.summaryValue, {color: theme.text}]}>
                  ${subtotal.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>LOYALTY POINTS</Text>
                <Text style={[styles.summaryValue, {color: theme.text}]}>
                  ${loyaltyPoints.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>DELIVERY</Text>
                <Text style={[styles.summaryValue, {color: theme.text}]}>
                  ${delivery.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.totalText, {color: theme.text}]}>TOTAL</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            <Animatable.View animation="bounceIn" duration={800}>
              <CustomButton
                title="Schedule"
                onPress={() => {
                  navigation.navigate('Schedule');
                  dispatch(setTotalPrice(total));
                }}
              />
            </Animatable.View>
          </Animatable.View>
        )}
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
      ios: wp(6),
      android: wp(5),
    }),
  },
  list: {
    paddingBottom: hp(2),
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: wp(3),
    marginBottom: hp(2),
    alignItems: 'center',
  },
  itemImage: {
    width: wp(12),
    height: wp(12),
    borderRadius: 5,
  },
  itemDetails: {
    flex: 1,
    marginLeft: wp(3),
  },
  itemName: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#333',
  },
  itemPrice: {
    fontSize: wp(3.5),
    color: '#666',
    marginTop: hp(0.5),
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    borderRadius: wp(1),
    height: wp(4.5),
    width: wp(4.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: wp(4),
    color: '#333',
  },
  quantity: {
    marginHorizontal: wp(3),
    fontSize: wp(4),
    color: '#333',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: wp(2),
    padding: wp(4),
    marginBottom: wp(25),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  summaryText: {
    fontSize: wp(3.5),
    color: '#666',
  },
  summaryValue: {
    fontSize: wp(3.5),
    color: '#333',
  },
  totalText: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#FF00A7',
  },
});

export default Cart;
