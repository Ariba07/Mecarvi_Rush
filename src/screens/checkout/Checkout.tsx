/* eslint-disable react-native/no-inline-styles */
import {
  View,
  SafeAreaView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../../components/common/buttons/CustomButton';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearCart,
  selectAddressId,
  selectAddressType,
  selectCart,
  selectDeliveryDate,
  selectDeliveryTime,
  selectSourceType,
} from '../../slice/Slice';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import CardPaymentBottomSheet from '../../components/cardPayment/CardPaymentModal';

interface PaymentOption {
  id: string;
  label: string;
  logoUrl: string;
  selected: boolean;
  balance?: string;
}

const Checkout: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const cart = useSelector(selectCart);
  const addressType = useSelector(selectAddressType);
  const sourceType = useSelector(selectSourceType);
  const Time = useSelector(selectDeliveryTime);
  const date = useSelector(selectDeliveryDate);
  const addressId = useSelector(selectAddressId);
  const dispatch = useDispatch();

  const [selectedPayment, setSelectedPayment] = useState<string>('paypal');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [orderUuid, setOrderUuid] = useState<string | null>(null);

  // Function to convert "4:00 PM" to "16:00" format
  const convertTo24HourFormat = (timeStr: string) => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');
    let hourNum = parseInt(hours, 10);

    if (period === 'PM' && hourNum !== 12) {
      hourNum += 12;
    } else if (period === 'AM' && hourNum === 12) {
      hourNum = 0;
    }

    return `${hourNum.toString().padStart(2, '0')}:${minutes}`;
  };

  const createOrder = async () => {
    try {
      // Convert time to 24-hour format
      const formattedTime = Time ? convertTo24HourFormat(Time) : '';

      // Validate user_address_id for delivery
      if (addressType === 'delivery' && !addressId) {
        console.error('Error: User address ID is required for delivery.');
        Alert.alert('Please select a delivery address before proceeding.');
        throw new Error('User address ID is required for delivery');
      }

      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          attributes: item.attributes || {},
        })),
        fulfillment_type: addressType,
        source_type: sourceType,
        fulfillment_time: formattedTime,
        fulfillment_date: date,
        user_address_id: addressType === 'delivery' ? addressId : undefined,
      };

      console.log('Order Data:', orderData);

      const response = (await apiHelper({
        method: 'POST',
        endpoint: 'orders/cart/',
        data: orderData,
      })) as {data: {order_uuid: string}};

      if (response.data.order_uuid) {
        setOrderUuid(response.data.order_uuid); // Store order_uuid
        return response.data.order_uuid; // Return order_uuid for further processing
      } else {
        throw new Error('No valid order_uuid in response');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Failed to create order. Please try again.');
      throw error; // Re-throw to handle in the calling function
    }
  };

  const createPayment = async (paymentId: string) => {
    if (!orderUuid) {
      console.error('Error: orderUuid is not set');
      Alert.alert('Error', 'Order UUID is missing. Payment cannot proceed.');
      return;
    }

    try {
      await apiHelper({
        method: 'POST',
        endpoint: `orders/${orderUuid}/stripe-payment`,
        data: {payment_method_id: paymentId},
      });
      navigation.navigate('Receipt'); // Navigate to Receipt after payment
      dispatch(clearCart());
    } catch (error) {
      console.error('Error creating payment:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
  };

  const handlePayNow = async () => {
    try {
      const orderUuidFromCreation = await createOrder(); // Create order first
      if (orderUuidFromCreation) {
        if (selectedPayment === 'stripe') {
          setIsModalVisible(true); // Open CardPaymentBottomSheet for Stripe after order creation
        } else {
          // Handle other payment methods (e.g., PayPal, Wallet)
          navigation.navigate('Receipt');
          dispatch(clearCart());
        }
      }
    } catch (error) {
      // Error already handled in createOrder
    }
  };

  const handleStripePaymentSubmit = async (paymentMethodId: string) => {
    try {
      if (orderUuid) {
        await createPayment(paymentMethodId); // Create payment with existing orderUuid
      }
    } catch (error) {
      // Error already handled in createPayment
    }
  };

  const paymentOptions: PaymentOption[] = [
    {
      id: 'paypal',
      label: 'Paypal',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PayPal_logo.svg/1200px-PayPal_logo.svg.png',
      selected: true,
    },
    {
      id: 'stripe',
      label: 'Stripe',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1200px-Stripe_Logo%2C_revised_2016.svg.png',
      selected: false,
    },
    {
      id: 'wallet',
      label: 'Wallet',
      logoUrl: 'https://img.icons8.com/color/48/000000/wallet.png',
      selected: false,
      balance: '$5.00',
    },
  ];

  const handleSelectPayment = (id: string) => {
    setSelectedPayment(id);
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header title="Checkout" onBackPress={() => navigation.goBack()} />

        {/* Payment Option Section */}
        <View style={styles.paymentSection}>
          <View style={styles.sectionHeader}>
            <Icon name="credit-card" size={wp(8)} color="#666" />
            <View>
              <Text style={[styles.sectionTitle, {color: theme.text}]}>
                Payment Option
              </Text>
              <Text style={[styles.sectionSubtitle, {color: theme.text}]}>
                Select Your Preferred Payment mode
              </Text>
            </View>
          </View>

          {/* Payment Options */}
          {paymentOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.paymentOption,
                selectedPayment === option.id && styles.selectedPaymentOption,
                {backgroundColor: theme.backgroundColor},
              ]}
              onPress={() => handleSelectPayment(option.id)}>
              <View
                style={[
                  styles.radioCircle,
                  {
                    borderColor:
                      selectedPayment === option.id ? '#FF00A7' : '#333333',
                    borderWidth: 1,
                  },
                ]}>
                {selectedPayment === option.id && (
                  <View style={styles.selectedRadio} />
                )}
              </View>
              <Text style={[styles.paymentText, {color: theme.input}]}>
                {option.label}
              </Text>
              {option.balance ? (
                <View style={styles.balanceContainer}>
                  <Text style={styles.balanceText}>{option.balance}</Text>
                </View>
              ) : (
                <Image
                  source={{uri: option.logoUrl}}
                  style={styles.paymentLogo}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Pay Now Button */}
        <View style={styles.payButton}>
          <CustomButton title="Pay Now" onPress={handlePayNow} />
        </View>

        {/* Stripe Card Payment Bottom Sheet */}
        <CardPaymentBottomSheet
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSubmit={handleStripePaymentSubmit}
        />
      </View>
    </SafeAreaView>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
  },
  paymentSection: {
    marginTop: hp(2),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(4),
    gap: wp(3),
  },
  sectionTitle: {
    fontSize: wp(5),
    color: '#666',
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: wp(3.5),
    color: '#999',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: wp(2),
    marginBottom: hp(1.5),
  },
  selectedPaymentOption: {
    borderWidth: 1,
    borderColor: '#FF00A7',
  },
  radioCircle: {
    height: wp(5),
    width: wp(5),
    borderRadius: wp(2.5),
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
  },
  selectedRadio: {
    height: wp(3),
    width: wp(3),
    borderRadius: wp(1.5),
    backgroundColor: '#FF00A7',
  },
  paymentText: {
    fontSize: wp(4),
    color: '#333',
    flex: 1,
  },
  paymentLogo: {
    width: wp(15),
    height: wp(5),
    marginLeft: wp(2),
  },
  balanceContainer: {
    backgroundColor: '#FF00A71A',
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
  },
  balanceText: {
    fontSize: wp(3.5),
    color: '#FF00A7',
    fontWeight: 'bold',
  },
  payButton: {
    position: 'absolute',
    bottom: Platform.select({ios: hp(4), android: hp(8)}),
    left: Platform.select({ios: wp(6), android: wp(5)}),
    right: Platform.select({ios: wp(6), android: wp(5)}),
  },
});

export default Checkout;
