/* eslint-disable react-native/no-inline-styles */
import {
  View,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  Modal,
  ActivityIndicator,
  Text,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  PaymentOption,
  RootStackParamList,
} from '../../types/navigation';
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
} from '../../store/authSlice';
import {ThemeContext} from '../../context/ThemeContext';
import Header from '../../components/common/header/Header';
import CustomButton from '../../components/common/buttons/CustomButton';
import PaymentOptions from './PaymentOptions';
import {CardSelectionModal} from './CheckoutModals';
import CardPaymentBottomSheet from '../../components/cardPayment/CardPaymentModal';
import Geolocation from 'react-native-geolocation-service';
import {
  createOrder,
  fetchUserCards,
  createPayment,
  createCard,
} from './CheckoutActions';
import {styles} from '../../assets/styles/checkout/CheckoutStyles';
import {UserCard} from './types';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomModal from '../../components/common/errorModal/CustomModal';

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
  const [cardName, setCardName] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<string>('paypal');
  const [isCardModalVisible, setIsCardModalVisible] = useState<boolean>(false);
  const [isAddCardModalVisible, setIsAddCardModalVisible] =
    useState<boolean>(false);
  const [orderUuid, setOrderUuid] = useState<string | null>(null);
  const [wallet, setWallet] = useState<number>(0);
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [isPayButtonDisabled, setIsPayButtonDisabled] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('Error');

  const delivery = cart.reduce(
    (sum, item) => sum + (item.deliveryPrice ?? 0),
    0,
  );

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location for pickup.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    } else {
      const result = await Geolocation.requestAuthorization('whenInUse');
      return result === 'granted';
    }
  };

  const getCurrentLocation = useCallback(async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setModalTitle('Permission Denied');
      setModalMessage('Location access is required for pickup.');
      setModalVisible(true);
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
      },
      error => {
        console.warn('Location error:', error);
        setModalTitle('Error');
        setModalMessage('Unable to fetch location. Please try again.');
        setModalVisible(true);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  useEffect(() => {
    if (
      addressType === 'pickup' &&
      (selectedPayment === 'stripe' || selectedPayment === 'wallet')
    ) {
      getCurrentLocation();
    } else {
      setLocation(null);
    }
  }, [addressType, getCurrentLocation, selectedPayment]);

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

  const handlePayNow = async () => {
    if (isPaying || isPayButtonDisabled) {
      return;
    }
    setIsPaying(true);
    setIsPayButtonDisabled(true);

    if (selectedPayment === 'wallet' && wallet < orderPrice) {
      setModalTitle('Error');
      setModalMessage(
        'Insufficient wallet balance. Please choose another payment method.',
      );
      setModalVisible(true);
      setIsPaying(false);
      setIsPayButtonDisabled(false);
      return;
    }

    try {
      let currentOrderUuid = orderUuid;
      if (!currentOrderUuid) {
        const orderResult = await createOrder({
          cart,
          addressType: addressType || '',
          sourceType: sourceType || '',
          Time: Time || '',
          date: date || '',
          addressId: addressId ?? null,
          serviceProviderId: serviceProviderId ?? null,
          marketPlaceUuid: marketPlaceUuid ?? null,
          quoteOrder,
          quote_uuid: quote_uuid ?? null,
        });
        if (!orderResult.success) {
          setModalTitle(orderResult.error?.title || 'Error');
          setModalMessage(
            orderResult.error?.message || 'Failed to create order.',
          );
          setModalVisible(true);
          setIsPaying(false);
          setIsPayButtonDisabled(false);
          return;
        }
        currentOrderUuid = orderResult.data;
        setOrderUuid(currentOrderUuid);
      }

      if (selectedPayment === 'stripe') {
        const cardsResult = await fetchUserCards();
        if (!cardsResult.success) {
          setModalTitle(cardsResult.error?.title || 'Error');
          setModalMessage(
            cardsResult.error?.message || 'Failed to fetch cards.',
          );
          setModalVisible(true);
          setIsPaying(false);
          setIsPayButtonDisabled(false);
          return;
        }
        setUserCards(cardsResult.data);
        setIsCardModalVisible(true);
      } else {
        setIsLoading(true);
        const paymentResult = await createPayment(
          currentOrderUuid,
          null,
          addressType || '',
          location,
          selectedPayment,
          orderPrice,
          delivery,
        );
        if (paymentResult.success) {
          await new Promise<void>(resolve => setTimeout(() => resolve(), 3000));
          navigation.navigate('Receipt');
          dispatch(clearCart());
        } else {
          setModalTitle(paymentResult.error?.title || 'Error');
          setModalMessage(
            paymentResult.error?.message || 'Failed to process payment.',
          );
          setModalVisible(true);
          setIsPayButtonDisabled(false);
        }
        setIsLoading(false);
      }
    } catch (error) {
      setModalTitle('Error');
      setModalMessage('An unexpected error occurred. Please try again.');
      setModalVisible(true);
      setIsPayButtonDisabled(false);
      setIsLoading(false);
    } finally {
      setIsPaying(false);
    }
  };

  const handleAddNewCard = () => {
    setIsAddCardModalVisible(true);
  };

  const handleCardSubmit = async (paymentMethodId: string) => {
    const cardResult = await createCard(
      paymentMethodId,
      cardName,
      async () => {
        const cardsResult = await fetchUserCards();
        return cardsResult.success ? cardsResult.data : [];
      },
      setIsCardModalVisible,
    );
    if (cardResult.success && cardResult.data) {
      setSelectedCardId(cardResult.data);
      setIsAddCardModalVisible(false);
      setIsCardModalVisible(true);
    } else {
      setModalTitle(cardResult.error?.title || 'Error');
      setModalMessage(cardResult.error?.message || 'Failed to create card.');
      setModalVisible(true);
      setIsPayButtonDisabled(false);
    }
  };

  const handleCardSelection = async () => {
    if (selectedCardId) {
      setIsCardModalVisible(false);
      setIsPaying(true);
      setIsLoading(true);
      const paymentResult = await createPayment(
        orderUuid,
        selectedCardId,
        addressType || '',
        location,
        selectedPayment,
        orderPrice,
        delivery,
      );
      if (paymentResult.success) {
        await new Promise<void>(resolve => setTimeout(() => resolve(), 3000));
        navigation.navigate('Receipt');
        dispatch(clearCart());
      } else {
        setModalTitle(paymentResult.error?.title || 'Error');
        setModalMessage(
          paymentResult.error?.message || 'Failed to process payment.',
        );
        setModalVisible(true);
        setIsPayButtonDisabled(false);
      }
      setIsPaying(false);
      setIsLoading(false);
    } else {
      setModalTitle('Error');
      setModalMessage('Please select a card to proceed.');
      setModalVisible(true);
      setIsPayButtonDisabled(false);
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
          <CustomButton
            title="Pay Now"
            onPress={handlePayNow}
            disabled={isPaying || isPayButtonDisabled}
          />
        </View>
        <CardSelectionModal
          isVisible={isCardModalVisible}
          onClose={() => {
            setIsCardModalVisible(false);
            setIsPayButtonDisabled(false);
          }}
          userCards={userCards}
          selectedCardId={selectedCardId}
          setSelectedCardId={setSelectedCardId}
          onChoose={handleCardSelection}
          onAddNewCard={handleAddNewCard}
          theme={theme}
        />
        <CardPaymentBottomSheet
          isVisible={isAddCardModalVisible}
          onClose={() => {
            setIsAddCardModalVisible(false);
            setIsPayButtonDisabled(false);
          }}
          onSubmit={handleCardSubmit}
          setCardName={setCardName}
          cardName={cardName}
          isCard={true}
        />
        <Modal
          transparent={true}
          visible={isLoading}
          animationType="fade"
          onRequestClose={() => {}}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: theme.backgroundColor,
                padding: wp(5),
                borderRadius: wp(3),
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color="#FF00A7" />
              <Text
                style={{
                  marginTop: hp(2),
                  fontSize: wp(4.5),
                  fontWeight: '600',
                  color: theme.text,
                }}>
                Processing Payment
              </Text>
            </View>
          </View>
        </Modal>
        <CustomModal
          visible={modalVisible}
          title={modalTitle}
          message={modalMessage}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default Checkout;
