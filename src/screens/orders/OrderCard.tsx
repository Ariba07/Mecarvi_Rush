import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {ThemeContext} from '../../context/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {Order, formatDate} from './types';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/orders/OrderStyles';
import * as Animatable from 'react-native-animatable';

interface OrderCardProps {
  order: Order;
  onOpenOrderModal: (order: Order) => void;
  onOpenTrackingModal: (orderUuid: string) => void;
  onOpenCancelModal: (orderUuid: string) => void;
  onOpenDisputeModal: (orderId: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onOpenOrderModal,
  onOpenTrackingModal,
  onOpenCancelModal,
  onOpenDisputeModal,
}) => {
  const {theme} = React.useContext(ThemeContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Animatable.View
      animation="fadeInUp"
      duration={600}
      delay={100}
      style={[styles.cardContainer, {backgroundColor: theme.backgroundColor}]}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onOpenOrderModal(order)}>
        <View style={styles.cardContent}>
          <View style={styles.detailsContainer}>
            <View style={styles.orderHeader}>
              <Text style={[styles.orderNumber, {color: theme.text}]}>
                {order.order_number}
              </Text>
              {(order.status === 'Pending' ||
                order.status === 'Processing') && (
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => onOpenCancelModal(order.order_uuid)}>
                  <Animatable.View animation="bounceIn" duration={500}>
                    <Icon
                      name="ellipsis-vertical-outline"
                      size={wp(5)}
                      color={theme.text}
                      type="ionicon"
                    />
                  </Animatable.View>
                </TouchableOpacity>
              )}
              {order.status === 'Completed' && (
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => onOpenDisputeModal(order.id)}>
                  <Animatable.View animation="bounceIn" duration={500}>
                    <Icon
                      name="ellipsis-vertical-outline"
                      size={wp(5)}
                      color={theme.text}
                      type="ionicon"
                    />
                  </Animatable.View>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.statusPriceRow}>
              <Text style={[styles.status, {color: theme.status}]}>
                {order.status || 'Pending'}
              </Text>
              <Text style={[styles.priceText, {color: theme.text}]}>
                ${parseFloat(order.total_price.toString()).toFixed(2)}
              </Text>
            </View>
            <Text style={[styles.dateText, {color: theme.text + '80'}]}>
              Created: {formatDate(order.created_at)}
            </Text>
            <View style={styles.buttonRow}>
              <Animatable.View animation="bounceIn" duration={600}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.trackingButton,
                    {backgroundColor: theme.button},
                  ]}
                  onPress={() => onOpenTrackingModal(order.order_uuid)}>
                  <Text style={[styles.buttonText, {color: theme.input}]}>
                    Track
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
              {order.status === 'Completed' && (
                <Animatable.View
                  animation="bounceIn"
                  duration={600}
                  delay={100}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.ratingButton,
                      {backgroundColor: theme.button},
                    ]}
                    onPress={() => {
                      navigation.navigate('Review', {
                        order_id: order.id,
                        name: order.service_provider_name,
                        image: order.service_provider_logo,
                      });
                    }}>
                    <Text style={[styles.buttonText, {color: theme.input}]}>
                      Rate
                    </Text>
                  </TouchableOpacity>
                </Animatable.View>
              )}
              {order.order_proofs !== 0 && (
                <Animatable.View
                  animation="bounceIn"
                  duration={600}
                  delay={200}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.feedbackButton,
                      {backgroundColor: theme.button},
                    ]}
                    onPress={() =>
                      navigation.navigate('Feedback', {order_id: order.id})
                    }>
                    <Text style={[styles.buttonText, {color: theme.input}]}>
                      Feedback
                    </Text>
                  </TouchableOpacity>
                </Animatable.View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default OrderCard;
