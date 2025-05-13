import {View, SafeAreaView, Alert} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  PaymentOption,
  RootStackParamList,
} from '../../components/types/screenTypes/ScreenTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import Header from '../../components/common/header/Header';
import CustomButton from '../../components/common/buttons/CustomButton';
import CardPaymentBottomSheet from '../../components/cardPayment/CardPaymentModal';
import PaymentOptions from './PaymentOptions';
import {convertTo24HourFormat} from '../../components/helperUtils/timeFormat/TimeUtils';
import {styles} from '../../assets/styles/checkout/CheckoutStyles';

const STORAGE_KEY = '@login_credentials';

const Checkout: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const addressType = useSelector(selectAddressType);
  const sourceType = useSelector(selectSourceType);
  const Time = useSelector(selectDeliveryTime);
  const date = useSelector(selectDeliveryDate);
  const addressId = useSelector(selectAddressId);
  const serviceProviderId = useSelector(selectDispatchId);
  const marketPlaceUuid = useSelector(selectMarketplaceUuid);
  const reduxWallet = useSelector(selectWalletBalance);
  const subscribed = useSelector(selectSubscriptionStatus);
  const orderPrice = useSelector(selectTotalPrice) || 0;
  const quoteOrder = useSelector(selectAcceptedBidDetails);
  const quote_uuid = useSelector(selectQuoteUuid);

  const [selectedPayment, setSelectedPayment] = useState<string>('paypal');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [orderUuid, setOrderUuid] = useState<string | null>(null);
  const [wallet, setWallet] = useState<number>(0);

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
        setWallet(reduxWallet || 0);
      }
    };
    getUserId();
  }, [reduxWallet]);

  const createOrder = async () => {
    try {
      const formattedTime = Time ? convertTo24HourFormat(Time) : '';
      if (addressType === 'delivery' && !addressId) {
        Alert.alert('Please select a delivery address before proceeding.');
        throw new Error('User address ID is required for delivery');
      }

      const baseOrderData = {
        items: cart.map(item => ({
          product_id: item.id.toString(),
          quantity: item.quantity,
          price: item.price.toString(),
          name: item.name,
          ...(item.attributes && Object.keys(item.attributes).length > 0
            ? {attributes: item.attributes}
            : {}),
        })),
        fulfillment_type: addressType,
        source_type: sourceType,
        fulfillment_time: formattedTime,
        fulfillment_date: date,
        user_address_id: addressType === 'delivery' ? addressId : undefined,
      };

      const orderData =
        sourceType === 'cart'
          ? baseOrderData
          : {
              ...baseOrderData,
              service_provider_id:
                sourceType === 'quote' &&
                quoteOrder &&
                quoteOrder.length > 0 &&
                quoteOrder[0]?.servicer_id
                  ? quoteOrder[0].servicer_id
                  : serviceProviderId,
              ...(sourceType === 'quote' &&
                quoteOrder &&
                quoteOrder.length > 0 && {
                  items: quoteOrder.map(item => ({
                    product_id: item.product_id.toString(),
                    quantity: item.quantity,
                    price: item.bid_price.toString(),
                  })),
                }),
            };

      const endpoint =
        sourceType === 'quote'
          ? `orders/quote/${quote_uuid}/`
          : sourceType === 'cart'
          ? 'orders/cart'
          : `orders/marketplace/${marketPlaceUuid}`;

      const response = (await apiHelper({
        method: 'POST',
        endpoint,
        data: orderData,
      })) as {data: {order_uuid: string}};

      if (response.data.order_uuid) {
        setOrderUuid(response.data.order_uuid);
        return response.data.order_uuid;
      }
      throw new Error('No valid order_uuid in response');
    } catch (error: any) {
      console.warn('Error creating order:', error);
      Alert.alert(
        error.response?.status === 500 ? 'Server Error' : 'Error',
        error.response?.status === 500
          ? 'An error occurred on the server while creating your order. Please try again later or contact support.'
          : error.message || 'Failed to create order. Please try again.',
      );
      throw error;
    }
  };

  const createPayment = async (paymentId: string) => {
    if (!orderUuid) {
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
      // Error handled in createOrder
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

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header title="Checkout" onBackPress={() => navigation.goBack()} />
        <PaymentOptions
          paymentOptions={paymentOptions}
          selectedPayment={selectedPayment}
          onSelectPayment={setSelectedPayment}
          orderPrice={orderPrice}
          wallet={wallet}
        />
        <View style={styles.payButton}>
          <CustomButton title="Pay Now" onPress={handlePayNow} />
        </View>
        <CardPaymentBottomSheet
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSubmit={createPayment}
        />
      </View>
    </SafeAreaView>
  );
};

export default Checkout;
