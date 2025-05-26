import {
  View,
  SafeAreaView,
  Alert,
  Modal,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
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
import PaymentOptions from './PaymentOptions';
import {convertTo24HourFormat} from '../../components/helperUtils/timeFormat/TimeUtils';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/checkout/CheckoutStyles';
import CardPaymentBottomSheet from '../../components/cardPayment/CardPaymentModal';

const STORAGE_KEY = '@login_credentials';

interface UserCard {
  id: number; // Keeping id for internal reference, but using user_card_uuid as the key
  user_card_uuid: string;
  user_id: number;
  card_name: string;
  brand: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

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
  const [cardName, setCardName] = useState('');

  const [selectedPayment, setSelectedPayment] = useState<string>('paypal');
  const [isCardModalVisible, setIsCardModalVisible] = useState<boolean>(false);
  const [isAddCardModalVisible, setIsAddCardModalVisible] =
    useState<boolean>(false);
  const [orderUuid, setOrderUuid] = useState<string | null>(null);
  const [wallet, setWallet] = useState<number>(0);
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const delivery = cart.reduce(
    (sum, item) => sum + (item.deliveryPrice ?? 0),
    0,
  );

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

  const fetchUserCards = async () => {
    try {
      const response = (await apiHelper({
        method: 'GET',
        endpoint: 'user-cards',
      })) as {data: UserCard[]};
      setUserCards(response.data || []);
      return response.data || [];
    } catch (error) {
      console.warn('Error fetching user cards:', error);
      Alert.alert('Error', 'Failed to fetch user cards. Please try again.');
      setUserCards([]);
      return [];
    }
  };

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
          price:
            addressType === 'delivery'
              ? (item.price + (item.deliveryPrice ?? 0)).toString()
              : item.price.toString(),
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

      console.log('Order Data:', orderData);

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

  const createPayment = async (cardId: string) => {
    if (!orderUuid) {
      Alert.alert('Error', 'Order UUID is missing. Payment cannot proceed.');
      return;
    }
    console.log(cardId);

    try {
      await apiHelper({
        method: 'POST',
        endpoint: `orders/${orderUuid}/stripe-payment`,
        data: {user_card_uuid: cardId}, // Use user_card_uuid instead of id
      });
      navigation.navigate('Receipt');
      dispatch(clearCart());
    } catch (error) {
      console.warn('Error creating payment:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
  };

  const createCard = async (paymentMethodId: string) => {
    try {
      await apiHelper({
        method: 'POST',
        endpoint: 'user-cards/create',
        data: {
          stripe_payment_method_id: paymentMethodId,
          card_name: cardName,
        },
      });
      // After creating the card, fetch the updated card list
      await fetchUserCards();
      // Reopen the card selection modal
      setIsCardModalVisible(true);
    } catch (error) {
      console.warn('Error creating card:', error);
      Alert.alert('Error', 'Failed to create card. Please try again.');
    }
  };

  const handlePayNow = async () => {
    try {
      const orderUuidFromCreation = await createOrder();
      if (orderUuidFromCreation) {
        if (selectedPayment === 'stripe') {
          await fetchUserCards();
          setIsCardModalVisible(true);
        } else {
          try {
            await apiHelper({
              method: 'POST',
              endpoint: `orders/${orderUuidFromCreation}/wallet-payment`,
              data: {
                balance:
                  addressType !== 'delivery'
                    ? orderPrice - delivery
                    : orderPrice,
              },
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

  const handleAddNewCard = () => {
    setIsCardModalVisible(false);
    setIsAddCardModalVisible(true);
  };

  const renderCardItem = ({item}: {item: UserCard}) => (
    <TouchableOpacity
      style={[
        styles.cardItem,
        {backgroundColor: theme.backgroundColor},
        selectedCardId === item.user_card_uuid && styles.selectedCardItem,
      ]}
      onPress={() => setSelectedCardId(item.user_card_uuid)}>
      <View style={styles.cardDetails}>
        <Text style={[styles.cardText, {color: theme.text}]}>
          {item.brand} ending in {item.last4}
        </Text>
        <Text style={[styles.cardSubText, {color: theme.text}]}>
          Expires {item.exp_month}/{item.exp_year}
        </Text>
      </View>
      {selectedCardId === item.user_card_uuid && (
        <Icon name="check-circle" size={wp(6)} color="#FF00A7" />
      )}
    </TouchableOpacity>
  );

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
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCardModalVisible}
          onRequestClose={() => setIsCardModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View
              style={[styles.modalContainer, {backgroundColor: theme.whole}]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, {color: theme.text}]}>
                  Select Payment Card
                </Text>
                <TouchableOpacity onPress={() => setIsCardModalVisible(false)}>
                  <Icon name="close" size={wp(7)} color={theme.text} />
                </TouchableOpacity>
              </View>
              {userCards.length > 0 ? (
                <>
                  <FlatList
                    data={userCards}
                    renderItem={renderCardItem}
                    keyExtractor={item => item.user_card_uuid} // Use user_card_uuid as the key
                    style={styles.cardList}
                  />
                  <View>
                    <CustomButton
                      title="Choose"
                      onPress={() => {
                        if (selectedCardId) {
                          setIsCardModalVisible(false);
                          createPayment(selectedCardId);
                        } else {
                          Alert.alert(
                            'Error',
                            'Please select a card to proceed.',
                          );
                        }
                      }}
                    />
                    <CustomButton
                      title="Add New Card"
                      onPress={handleAddNewCard}
                    />
                  </View>
                </>
              ) : (
                <View style={styles.noCardsContainer}>
                  <Text style={[styles.noCardsText, {color: theme.text}]}>
                    No cards available
                  </Text>
                  <CustomButton
                    title="Add New Card"
                    onPress={handleAddNewCard}
                  />
                </View>
              )}
            </View>
          </View>
        </Modal>
        <CardPaymentBottomSheet
          isVisible={isAddCardModalVisible}
          onClose={() => setIsAddCardModalVisible(false)}
          onSubmit={createCard}
          setCardName={setCardName}
          cardName={cardName}
          isCard={true}
        />
      </View>
    </SafeAreaView>
  );
};

export default Checkout;
