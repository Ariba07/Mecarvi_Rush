/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {Order, formatDate} from './types';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/orders/OrderStyles';

interface OrderCardProps {
  order: Order;
  role: string | null;
  onOpenOrderModal: (order: Order) => void;
  onOpenStatusModal: (orderUuid: string) => void;
  onOpenTrackingModal: (orderUuid: string) => void;
  onOpenCancelModal: (orderUuid: string) => void;
  onOpenDisputeModal: (orderId: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  role,
  onOpenOrderModal,
  onOpenStatusModal,
  onOpenTrackingModal,
  onOpenCancelModal,
  onOpenDisputeModal,
}) => {
  const {theme} = React.useContext(ThemeContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={[styles.card, {backgroundColor: theme.backgroundColor}]}
        onPress={() => onOpenOrderModal(order)}>
        <View style={styles.cardContent}>
          <View style={styles.detailsContainer}>
            <View style={styles.orderHeader}>
              <Text style={[styles.orderNumber, {color: theme.text}]}>
                {order.order_number}
              </Text>
              {role === 'customer' && (
                <>
                  {(order.status === 'Pending' ||
                    order.status === 'Processing') && (
                    <TouchableOpacity
                      style={styles.menuButton}
                      onPress={() => onOpenCancelModal(order.order_uuid)}>
                      <Icon
                        name="ellipsis-vertical-outline"
                        size={wp(5)}
                        color={theme.text}
                        type="ionicon"
                      />
                    </TouchableOpacity>
                  )}
                  {order.status === 'Completed' && (
                    <TouchableOpacity
                      style={styles.menuButton}
                      onPress={() => onOpenDisputeModal(order.id)}>
                      <Icon
                        name="ellipsis-vertical-outline"
                        size={wp(5)}
                        color={theme.text}
                        type="ionicon"
                      />
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {role === 'service_provider' ? (
                <TouchableOpacity
                  onPress={() => onOpenStatusModal(order.order_uuid)}>
                  <Text
                    style={[
                      styles.status,
                      {color: '#00A19D', textDecorationLine: 'underline'},
                    ]}>
                    {order.status || 'Pending'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={[styles.status, {color: '#00A19D'}]}>
                  {order.status || 'Pending'}
                </Text>
              )}
              <Text style={[styles.priceText, {color: '#FF0080'}]}>
                ${parseFloat(order.total_price.toString()).toFixed(2)}
              </Text>
            </View>
            <Text style={[styles.dateText, {color: '#6c757d'}]}>
              Created On: {formatDate(order.created_at)}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={styles.trackingButton}
                onPress={() => onOpenTrackingModal(order.order_uuid)}>
                <Text style={styles.trackingButtonText}>Tracking Status</Text>
              </TouchableOpacity>
              {order.status === 'Completed' && role === 'customer' && (
                <TouchableOpacity
                  style={styles.ratingButton}
                  onPress={() =>
                    navigation.navigate('Review', {order_id: order.id})
                  }>
                  <Text style={styles.ratingButtonText}>Rate Order</Text>
                </TouchableOpacity>
              )}
            </View>
            {role === 'service_provider' && (
              <View style={styles.buttonRow}>
                <View style={styles.paymentStatus}>
                  <Text style={styles.paymentStatusText}>
                    {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                  </Text>
                </View>
                {order.status === 'Processing' && (
                  <TouchableOpacity
                    style={styles.feedbackButton}
                    onPress={() =>
                      navigation.navigate('Feedback', {order_id: order.id})
                    }>
                    <Text style={styles.feedbackButtonText}>
                      Ask for Feedback
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OrderCard;
