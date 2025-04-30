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
import React, {useContext, useEffect, useState} from 'react';
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
  selectAcceptedBidDetails,
  selectAddressId,
  selectAddressType,
  selectCart,
  selectDeliveryDate,
  selectDeliveryTime,
  selectDispatchId,
  selectMarketplaceUuid,
  selectQuoteUuid,
  selectSourceType,
  selectSubscriptionStatus,
  selectTotalPrice,
  selectWalletBalance,
} from '../../slice/Slice';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import CardPaymentBottomSheet from '../../components/cardPayment/CardPaymentModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@login_credentials';

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
  const serviceProviderId = useSelector(selectDispatchId);
  const marketPlaceUuid = useSelector(selectMarketplaceUuid);
  const reduxWallet = useSelector(selectWalletBalance);
  const [wallet, setWallet] = useState<number>(0);
  const subscribed = useSelector(selectSubscriptionStatus);
  const orderPrice = useSelector(selectTotalPrice) || 0;
  const quoteOrder = useSelector(selectAcceptedBidDetails);
  const quote_uuid = useSelector(selectQuoteUuid);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const credentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (credentials) {
          const parsedCredentials = JSON.parse(credentials);

          if (parsedCredentials.walletBalance) {
            setWallet(parsedCredentials.walletBalance);
            return;
          }
        }
        setWallet(reduxWallet || 0);
      } catch (error) {
        console.warn('Error retrieving user ID from AsyncStorage:', error);
        // Fallback to Redux on error
        setWallet(reduxWallet || 0);
      }
    };

    getUserId();
  }, [reduxWallet]);

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
      const formattedTime = Time ? convertTo24HourFormat(Time) : '';

      if (addressType === 'delivery' && !addressId) {
        console.warn('Error: User address ID is required for delivery.');
        Alert.alert('Please select a delivery address before proceeding.');
        throw new Error('User address ID is required for delivery');
      }

      // Log state for debugging
      console.log('sourceType:', sourceType);
      console.log('quoteOrder:', quoteOrder);

      const orderData = {
        items: cart.map(item => ({
          product_id: item.id.toString(), // Convert to string
          quantity: item.quantity,
          price: item.price.toString(), // Convert to string
          name: item.name,
          ...(item.attributes && Object.keys(item.attributes).length > 0
            ? {attributes: item.attributes}
            : {}), // Omit attributes if empty
        })),
        fulfillment_type: addressType,
        source_type: sourceType,
        fulfillment_time: formattedTime,
        fulfillment_date: date,
        user_address_id: addressType === 'delivery' ? addressId : undefined,
      };

      const marketOrderData = {
        items: cart.map(item => ({
          product_id: item.id.toString(), // Convert to string
          quantity: item.quantity,
          price: item.price.toString(), // Convert to string
          name: item.name,
          ...(item.attributes && Object.keys(item.attributes).length > 0
            ? {attributes: item.attributes}
            : {}), // Omit attributes if empty
        })),
        fulfillment_type: addressType,
        source_type: sourceType,
        fulfillment_time: formattedTime,
        fulfillment_date: date,
        user_address_id: addressType === 'delivery' ? addressId : undefined,
        service_provider_id: serviceProviderId,
      };

      const quoteOrderData = {
        source_type: sourceType,
        service_provider_id:
          quoteOrder && quoteOrder.length > 0 && quoteOrder[0]?.servicer_id
            ? quoteOrder[0].servicer_id
            : undefined,
        items:
          quoteOrder && quoteOrder.length > 0
            ? quoteOrder.map(item => ({
                product_id: item.product_id.toString(), // Convert to string
                quantity: item.quantity,
                price: item.bid_price.toString(), // Convert to string
              }))
            : [],
        fulfillment_type: addressType,
        fulfillment_time: formattedTime,
        fulfillment_date: date,
        user_address_id: addressType === 'delivery' ? addressId : undefined,
      };

      let endpoint;
      let data;

      // Determine endpoint and data based on sourceType
      if (sourceType === 'quote') {
        if (!quoteOrder || quoteOrder.length === 0) {
          throw new Error('No valid quote order data available');
        }
        endpoint = `orders/quote/${quote_uuid}/`;
        data = quoteOrderData;
      } else if (sourceType === 'cart') {
        endpoint = 'orders/cart/';
        data = orderData;
      } else {
        endpoint = `orders/marketplace/${marketPlaceUuid}/`;
        data = marketOrderData;
      }

      console.log('Sending Order Data:', JSON.stringify(data, null, 2));
      console.log('Endpoint:', endpoint);

      const response = (await apiHelper({
        method: 'POST',
        endpoint: endpoint,
        data: data,
      })) as {data: {order_uuid: string; id?: number}};
      console.log('Order Response:', response);

      if (response.data.order_uuid) {
        setOrderUuid(response.data.order_uuid);

        return response.data.order_uuid;
      } else {
        throw new Error('No valid order_uuid in response');
      }
    } catch (error: any) {
      console.warn('Error creating order:', error);
      if (error.response?.status === 500) {
        console.log('Server Error Details:', error.response.data);
        Alert.alert(
          'Server Error',
          'An error occurred on the server while creating your order. Please try again later or contact support.',
        );
      } else {
        Alert.alert(
          'Error',
          error.message || 'Failed to create order. Please try again.',
        );
      }
      throw error;
    }
  };

  const createPayment = async (paymentId: string) => {
    if (!orderUuid) {
      console.warn('Error: orderUuid is not set');
      Alert.alert('Error', 'Order UUID is missing. Payment cannot proceed.');
      return;
    }

    try {
      await apiHelper({
        method: 'POST',
        endpoint: `orders/${orderUuid}/stripe-payment`,
        data: {payment_method_id: paymentId},
      });
      navigation.navigate('Receipt');

      dispatch(clearCart());
    } catch (error) {
      console.warn('Error creating payment:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
  };

  const handlePayNow = async () => {
    try {
      const orderUuidFromCreation = await createOrder();
      if (orderUuidFromCreation) {
        if (selectedPayment === 'stripe') {
          setIsModalVisible(true);
        } else {
          try {
            await apiHelper({
              method: 'POST',
              endpoint: `orders/${orderUuidFromCreation}/wallet-payment`,
              data: {balance: orderPrice},
            });

            navigation.navigate('Receipt');

            dispatch(clearCart());
          } catch (error) {
            console.warn('Error initiating wallet payment:', error);
            Alert.alert(
              'Error',
              'Failed to initiate wallet payment. Please try again.',
            );
          }
        }
      }
    } catch (error) {
      // Error already handled in createOrder
    }
  };

  const handleStripePaymentSubmit = async (paymentMethodId: string) => {
    try {
      if (orderUuid) {
        await createPayment(paymentMethodId);
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
    ...(subscribed === 'active'
      ? [
          {
            id: 'wallet',
            label: 'Wallet',
            logoUrl: 'https://img.icons8.com/color/48/000000/wallet.png',
            selected: false,
            balance: `$ ${wallet || 0}`,
          },
        ]
      : []),
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
                option.id === 'wallet' && wallet < orderPrice && {opacity: 0.5},
              ]}
              onPress={() => handleSelectPayment(option.id)}
              disabled={option.id === 'wallet' && wallet < orderPrice}>
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

// Styles
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
