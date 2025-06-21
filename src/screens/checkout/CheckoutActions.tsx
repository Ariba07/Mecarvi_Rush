import {Alert} from 'react-native';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {convertTo24HourFormat} from '../../components/helperUtils/timeFormat/TimeUtils';
import {UserCard} from './types';

interface CreateOrderParams {
  cart: any[];
  addressType: string;
  sourceType: string;
  Time: string;
  date: string;
  addressId: number | null;
  serviceProviderId: number | null;
  marketPlaceUuid: string | null;
  quoteOrder: any[];
  quote_uuid: string | null;
}

export const createOrder = async ({
  cart,
  addressType,
  sourceType,
  Time,
  date,
  addressId,
  serviceProviderId,
  marketPlaceUuid,
  quoteOrder,
  quote_uuid,
}: CreateOrderParams): Promise<string | null> => {
  try {
    const formattedTime = Time ? convertTo24HourFormat(Time) : '';
    if (addressType === 'delivery' && !addressId) {
      Alert.alert(
        'Error',
        'Please select a delivery address before proceeding.',
      );
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
      return response.data.order_uuid;
    }
    throw new Error('No valid order_uuid in response');
  } catch (error: any) {
    console.warn('Error creating order:', error);
    const message =
      error.response?.status === 500
        ? 'An error occurred on the server while creating your order. Please try again later or contact support.'
        : error.response?.data?.message ||
          error.message ||
          'Failed to create order. Please try again.';
    Alert.alert(
      error.response?.status === 500 ? 'Server Error' : 'Error',
      message,
    );
    return null;
  }
};

export const fetchUserCards = async (): Promise<UserCard[]> => {
  try {
    const response = (await apiHelper({
      method: 'GET',
      endpoint: 'user-cards',
    })) as {data: UserCard[]};
    return response.data || [];
  } catch (error) {
    console.warn('Error fetching user cards:', error);
    Alert.alert('Error', 'Failed to fetch user cards. Please try again.');
    return [];
  }
};

export const createPayment = async (
  orderUuid: string | null,
  cardId: string | null,
  navigation: any,
  dispatch: any,
  addressType: string,
  location: {latitude: number; longitude: number} | null,
  paymentMethod: string,
  orderPrice: number,
  delivery: number,
) => {
  if (!orderUuid) {
    Alert.alert('Error', 'Order UUID is missing. Payment cannot proceed.');
    return false;
  }

  if (
    addressType === 'pickup' &&
    (paymentMethod === 'stripe' || paymentMethod === 'wallet') &&
    !location
  ) {
    Alert.alert('Error', 'Location is required for pickup payment.');
    return false;
  }

  try {
    const endpoint =
      paymentMethod === 'stripe'
        ? `orders/${orderUuid}/stripe-payment`
        : paymentMethod === 'wallet'
        ? `orders/${orderUuid}/wallet-payment`
        : `orders/${orderUuid}/paypal-payment`;

    const data =
      paymentMethod === 'stripe'
        ? {
            user_card_uuid: cardId,
            ...(addressType === 'pickup' && {
              pickup_location: {
                latitude: location?.latitude,
                longitude: location?.longitude,
              },
            }),
          }
        : {
            balance:
              addressType !== 'delivery' ? orderPrice - delivery : orderPrice,
            ...(addressType === 'pickup' && {
              pickup_location: {
                latitude: location?.latitude,
                longitude: location?.longitude,
              },
            }),
          };

    await apiHelper({
      method: 'POST',
      endpoint,
      data,
    });

    return true;
  } catch (error) {
    console.warn(`Error initiating ${paymentMethod} payment:`, error);
    Alert.alert(
      'Error',
      `Failed to initiate ${paymentMethod} payment. Please try again.`,
    );
    return false;
  }
};

export const createCard = async (
  paymentMethodId: string,
  cardName: string,
  fetchUserCardsFn: () => Promise<UserCard[]>,
  setIsCardModalVisible: (visible: boolean) => void,
): Promise<string | null> => {
  try {
    const response = (await apiHelper({
      method: 'POST',
      endpoint: 'user-cards/create',
      data: {
        stripe_payment_method_id: paymentMethodId,
        card_name: cardName || 'Default Card',
      },
    })) as {data: {user_card_uuid: string}};

    await fetchUserCardsFn();
    setIsCardModalVisible(true);

    return response.data.user_card_uuid || null;
  } catch (error) {
    console.warn('Error creating card:', error);
    Alert.alert('Error', 'Failed to create card. Please try again.');
    return null;
  }
};
