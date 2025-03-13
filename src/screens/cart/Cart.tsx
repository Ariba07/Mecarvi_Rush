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
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import CustomButton from '../../components/common/buttons/CustomButton';

// Sample cart data (you can replace this with actual data from an API or state)
const cartItems = [
  {
    id: '1',
    name: 'Business Card',
    price: 220.0,
    quantity: 0,
    image: 'https://via.placeholder.com/50',
  },
  {
    id: '2',
    name: 'Sidewalk Sign Board',
    price: 220.0,
    quantity: 0,
    image: 'https://via.placeholder.com/50',
  },
  {
    id: '3',
    name: 'Signage',
    price: 220.0,
    quantity: 0,
    image: 'https://via.placeholder.com/50',
  },
  {
    id: '4',
    name: 'Signage',
    price: 220.0,
    quantity: 0,
    image: 'https://via.placeholder.com/50',
  },
];

const Cart = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // State to manage quantities (you can use a state management library like Redux if needed)
  const [items, setItems] = React.useState(cartItems);

  // Functions to handle quantity changes
  const increaseQuantity = (id: string) => {
    setItems(
      items.map(item =>
        item.id === id ? {...item, quantity: item.quantity + 1} : item,
      ),
    );
  };

  const decreaseQuantity = (id: string) => {
    setItems(
      items.map(item =>
        item.id === id && item.quantity > 0
          ? {...item, quantity: item.quantity - 1}
          : item,
      ),
    );
  };

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const loyaltyPoints = 0.0; // Replace with actual logic if needed
  const delivery = 1.0; // Fixed delivery fee as per screenshot
  const total = subtotal + delivery + loyaltyPoints;

  // Render each cart item
  const renderItem = ({item}: {item: (typeof cartItems)[0]}) => (
    <View style={styles.itemCard}>
      <Image source={{uri: item.image}} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>$ {item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          onPress={() => decreaseQuantity(item.id)}
          style={[styles.quantityButton, {backgroundColor: '#D3D3D380'}]}>
          <Text style={[styles.quantityText, {color: '#30a7a7'}]}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => increaseQuantity(item.id)}
          style={[styles.quantityButton, {backgroundColor: '#30a7a7'}]}>
          <Text style={[styles.quantityText, {color: '#ffffff'}]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Cart" onBackPress={() => navigation.goBack()} />
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
        <View style={styles.summaryContainer}>
          <View
            style={{
              borderBottomColor: '#5c5c5c',
              borderBottomWidth: 1,
              marginBottom: wp(2),
            }}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>SUB TOTAL</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>LOYALTY POINTS</Text>
              <Text style={styles.summaryValue}>
                ${loyaltyPoints.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>DELIVERY</Text>
              <Text style={styles.summaryValue}>${delivery.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.totalText}>TOTAL</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
          <CustomButton title="Schedule" onPress={() => {}} />
        </View>
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
    borderTopLeftRadius: wp(2),
    borderTopRightRadius: wp(2),
    padding: wp(4),
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
    color: '#FF00A7', // Pink color for total
  },
  scheduleButton: {
    backgroundColor: '#30a7a7', // Teal color for the button
    borderRadius: wp(2),
    paddingVertical: hp(2),
    alignItems: 'center',
    marginTop: hp(2),
  },
  scheduleButtonText: {
    fontSize: wp(4.5),
    color: '#fff',
    fontWeight: '600',
  },
});

export default Cart;
