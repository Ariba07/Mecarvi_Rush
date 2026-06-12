import {apiHelper} from '../../services/api';
import {convertTo24HourFormat} from '@/utils/timeUtils';
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

interface ActionResult {
  success: boolean;
  data?: any;
  error?: {
    title: string;
    message: string;
  };
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
}: CreateOrderParams): Promise<ActionResult> => {
  try {
    const formattedTime = Time ? convertTo24HourFormat(Time) : '';
    if (addressType === 'delivery' && !addressId) {
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Please select a delivery address before proceeding.',
        },
      };
    }

    const formData = new FormData();

    // Append items array
    cart.forEach((item, index) => {
      formData.append(`items[${index}][product_id]`, item.id.toString());
      formData.append(`items[${index}][quantity]`, item.quantity.toString());
      formData.append(
        `items[${index}][price]`,
        addressType === 'delivery'
          ? (item.price + (item.deliveryPrice ?? 0)).toString()
          : item.price.toString(),
      );
      formData.append(`items[${index}][name]`, item.name);

      // Append variation_detail if it exists
      if (item.attributes && Object.keys(item.attributes).length > 0) {
        Object.entries(item.attributes).forEach(([key, value]) => {
          formData.append(`items[${index}][variation_detail][${key}]`, value);
        });
      }

      // Append images directly under items[${index}][images]
      if (item.frontFile) {
        formData.append(`items[${index}][images][front_image]`, {
          uri: item.frontFile.uri,
          type: item.frontFile.type || 'image/jpeg',
          name: item.frontFile.name || 'front_image.jpg',
        });
      }
      if (item.backFile) {
        formData.append(`items[${index}][images][back_image]`, {
          uri: item.backFile.uri,
          type: item.backFile.type || 'image/png',
          name: item.backFile.name || 'back_image.png',
        });
      }
    });

    // Append other order data
    formData.append('fulfillment_type', addressType);
    formData.append('source_type', sourceType);
    if (formattedTime) {
      formData.append('fulfillment_time', formattedTime);
    }
    if (date) {
      formData.append('fulfillment_date', date);
    }
    if (addressType === 'delivery' && addressId) {
      formData.append('user_address_id', addressId);
    }

    // Handle quote-specific data
    if (sourceType === 'quote' && quoteOrder && quoteOrder.length > 0) {
      formData.append(
        'service_provider_id',
        quoteOrder[0]?.servicer_id || serviceProviderId,
      );
      quoteOrder.forEach((item, index) => {
        formData.append(
          `items[${index}][product_id]`,
          item.product_id.toString(),
        );
        formData.append(`items[${index}][quantity]`, item.quantity.toString());
        formData.append(`items[${index}][price]`, item.bid_price.toString());
      });
    } else if (sourceType !== 'cart' && serviceProviderId) {
      formData.append('service_provider_id', serviceProviderId);
    }

    console.log(formData, 'FormData:');

    const endpoint =
      sourceType === 'quote'
        ? `orders/quote/${quote_uuid}/`
        : sourceType === 'cart'
        ? 'orders/cart'
        : `orders/marketplace/${marketPlaceUuid}`;

    const response = (await apiHelper({
      method: 'POST',
      endpoint,
      data: formData,
    })) as {data: {order_uuid: string}};

    if (response.data.order_uuid) {
      return {
        success: true,
        data: response.data.order_uuid,
      };
    }
    return {
      success: false,
      error: {
        title: 'Error',
        message: 'No valid order_uuid in response',
      },
    };
  } catch (error: any) {
    console.warn('Error creating order:', error);
    const message =
      error.response?.status === 500
        ? 'An error occurred on the server while creating your order. Please try again later or contact support.'
        : error.response?.data?.message ||
          error.message ||
          'Failed to create order. Please try again.';
    return {
      success: false,
      error: {
        title: error.response?.status === 500 ? 'Server Error' : 'Error',
        message,
      },
    };
  }
};

export const fetchUserCards = async (): Promise<ActionResult> => {
  try {
    const response = (await apiHelper({
      method: 'GET',
      endpoint: 'user-cards',
    })) as {data: UserCard[]};
    return {
      success: true,
      data: response.data || [],
    };
  } catch (error) {
    console.warn('Error fetching user cards:', error);
    return {
      success: false,
      error: {
        title: 'Error',
        message: 'Failed to fetch user cards. Please try again.',
      },
    };
  }
};

export const createPayment = async (
  orderUuid: string | null,
  cardId: string | null,
  addressType: string,
  location: {latitude: number; longitude: number} | null,
  paymentMethod: string,
  orderPrice: number,
  delivery: number,
): Promise<ActionResult> => {
  if (!orderUuid) {
    return {
      success: false,
      error: {
        title: 'Error',
        message: 'Order UUID is missing. Payment cannot proceed.',
      },
    };
  }

  if (
    addressType === 'pickup' &&
    (paymentMethod === 'stripe' || paymentMethod === 'wallet') &&
    !location
  ) {
    return {
      success: false,
      error: {
        title: 'Error',
        message: 'Location is required for pickup payment.',
      },
    };
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

    return {
      success: true,
    };
  } catch (error) {
    console.warn(`Error initiating ${paymentMethod} payment:`, error);
    return {
      success: false,
      error: {
        title: 'Error',
        message: `Failed to initiate ${paymentMethod} payment. Please try again.`,
      },
    };
  }
};

export const createCard = async (
  paymentMethodId: string,
  cardName: string,
  fetchUserCardsFn: () => Promise<UserCard[]>,
  setIsCardModalVisible: (visible: boolean) => void,
): Promise<ActionResult> => {
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

    return {
      success: true,
      data: response.data.user_card_uuid || null,
    };
  } catch (error) {
    console.warn('Error creating card:', error);
    return {
      success: false,
      error: {
        title: 'Error',
        message: 'Failed to create card. Please try again.',
      },
    };
  }
};
