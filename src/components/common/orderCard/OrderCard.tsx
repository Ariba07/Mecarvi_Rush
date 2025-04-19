/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Order} from '../../../screens/dashboard/ServiceProviderDashboard';

interface RecentOrderCardProps {
  order: Order;
  theme: {
    backgroundColor: string;
    text: string;
  };
  trackingStatuses: {
    [key: string]: {
      status: string;
      order_id?: number;
      order_tracking_uuid?: string;
    };
  };
  formatDate: (dateString: string) => string;
}

const RecentOrderCard: React.FC<RecentOrderCardProps> = ({
  order,
  theme,
  trackingStatuses,
  formatDate,
}) => (
  <View style={[styles.orderCard, {backgroundColor: theme.backgroundColor}]}>
    <View style={styles.orderDetails}>
      <Text style={[styles.orderId, {color: theme.text}]}>
        Order #{order.id}
      </Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={[
            styles.orderStatus,
            {
              color:
                trackingStatuses[order.order_uuid]?.status === 'Completed'
                  ? '#03A7A7'
                  : '#FF00A7',
            },
          ]}>
          {trackingStatuses[order.order_uuid]?.status || 'Loading...'}
        </Text>
        <Text style={[styles.orderPrice, {color: '#FF00A7'}]}>
          ${parseFloat(order.total_price.toString()).toFixed(2)}
        </Text>
      </View>

      <Text style={[styles.orderDate, {color: '#6c757d'}]}>
        Created: {formatDate(order.created_at)}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(1.5),
  },
  orderDetails: {
    flex: 1,
  },
  orderId: {
    fontSize: wp(4.2),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(0.5),
  },
  orderPrice: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#FF00A7',
    marginBottom: hp(0.5),
  },
  orderDate: {
    fontSize: wp(3.5),
    color: '#6c757d',
    marginBottom: hp(0.5),
  },
  orderStatus: {
    fontSize: wp(3.8),
    fontWeight: '500',
  },
});

export default RecentOrderCard;
