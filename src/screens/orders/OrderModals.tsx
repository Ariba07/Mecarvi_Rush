/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Modal, View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {Order, OrderDetail} from './types';

import {styles} from '../../assets/styles/orders/OrderStyles';
import * as Animatable from 'react-native-animatable';

interface OrderModalsProps {
  selectedOrder: Order | null;
  statusModalVisible: boolean;
  trackingModalVisible: boolean;
  cancelModalVisible: boolean;
  disputeModalVisible: boolean;
  orderForStatusUpdate: string | null;
  orderForTracking: string | null;
  orderForCancel: string | null;
  orderForDispute: number | null;
  trackingStatuses: {
    [key: string]: {
      status: string;
      order_id?: number;
      order_tracking_uuid?: string;
    };
  };
  onCloseOrderModal: () => void;
  onCloseStatusModal: () => void;
  onCloseTrackingModal: () => void;
  onCloseCancelModal: () => void;
  onCloseDisputeModal: () => void;
  onUpdateOrderStatus: (orderUuid: string, newStatus: string) => void;
  onCancelOrder: (orderUuid: string) => void;
}

const OrderModals: React.FC<OrderModalsProps> = ({
  selectedOrder,
  statusModalVisible,
  trackingModalVisible,
  cancelModalVisible,
  disputeModalVisible,
  orderForStatusUpdate,
  orderForTracking,
  orderForCancel,
  orderForDispute,
  trackingStatuses,
  onCloseOrderModal,
  onCloseStatusModal,
  onCloseTrackingModal,
  onCloseCancelModal,
  onCloseDisputeModal,
  onUpdateOrderStatus,
  onCancelOrder,
}) => {
  const {theme} = React.useContext(ThemeContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <>
      {/* Order Details Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={selectedOrder !== null}
        onRequestClose={onCloseOrderModal}>
        <View style={styles.modalOverlay}>
          <Animatable.View
            animation="zoomIn"
            duration={400}
            style={[
              styles.modalContent,
              {backgroundColor: theme.backgroundColor},
            ]}>
            <Text style={[styles.modalTitle, {color: theme.text}]}>
              Order #{selectedOrder?.id}
            </Text>
            <ScrollView
              style={styles.itemsContainer}
              showsVerticalScrollIndicator={false}>
              {selectedOrder?.order_details.map((detail: OrderDetail) => (
                <View
                  key={detail.id}
                  style={[styles.itemCard, {backgroundColor: theme.whole}]}>
                  <Text style={[styles.itemTitle, {color: theme.text}]}>
                    {detail.product_name}
                  </Text>
                  <View style={styles.itemDetailRow}>
                    <Text
                      style={[
                        styles.itemDetailLabel,
                        {color: theme.text + '80'},
                      ]}>
                      Price:
                    </Text>
                    <Text style={[styles.itemDetailValue, {color: theme.text}]}>
                      ${parseFloat(detail.price.toString()).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.itemDetailRow}>
                    <Text
                      style={[
                        styles.itemDetailLabel,
                        {color: theme.text + '80'},
                      ]}>
                      Quantity:
                    </Text>
                    <Text style={[styles.itemDetailValue, {color: theme.text}]}>
                      {detail.quantity}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <Animatable.View animation="bounceIn" duration={600}>
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  {
                    backgroundColor: theme.status,

                    alignSelf: 'center',
                  },
                ]}
                onPress={onCloseOrderModal}>
                <Text style={[styles.closeButtonText]}>Close</Text>
              </TouchableOpacity>
            </Animatable.View>
          </Animatable.View>
        </View>
      </Modal>
      {/* Tracking Status Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={trackingModalVisible}
        onRequestClose={onCloseTrackingModal}>
        <View style={styles.modalOverlay}>
          <Animatable.View
            animation="zoomIn"
            duration={400}
            style={[
              styles.modalContent,
              {backgroundColor: theme.backgroundColor},
            ]}>
            <Text style={[styles.modalTitle, {color: theme.text}]}>
              Tracking Status
            </Text>
            <Text style={[styles.trackingStatusText, {color: theme.text}]}>
              {trackingStatuses[orderForTracking!]?.status || 'Pending'}
            </Text>
            <Animatable.View animation="bounceIn" duration={600}>
              <TouchableOpacity
                style={[styles.closeButton, {backgroundColor: theme.status}]}
                onPress={onCloseTrackingModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Animatable.View>
          </Animatable.View>
        </View>
      </Modal>
      {/* Cancel Order Modal */}
      <Modal
          animationType="fade"
          transparent={true}
          visible={cancelModalVisible}
          onRequestClose={onCloseCancelModal}>
          <View style={styles.modalOverlay}>
            <Animatable.View
              animation="zoomIn"
              duration={400}
              style={[
                styles.modalContent,
                {backgroundColor: theme.backgroundColor},
              ]}>
              <Text style={[styles.modalTitle, {color: theme.text}]}>
                Order Actions
              </Text>
              <View style={styles.actionButtonRow}>
                <Animatable.View animation="bounceIn" duration={600}>
                  <TouchableOpacity
                    style={[
                      styles.cancelButton,
                      {backgroundColor: theme.status},
                    ]}
                    onPress={() => onCancelOrder(orderForCancel!)}>
                    <Text style={styles.cancelButtonText}>Cancel Order</Text>
                  </TouchableOpacity>
                </Animatable.View>
                <Animatable.View
                  animation="bounceIn"
                  duration={600}
                  delay={100}>
                  <TouchableOpacity
                    style={[
                      styles.closeButton,
                      {backgroundColor: theme.status},
                    ]}
                    onPress={onCloseCancelModal}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </Animatable.View>
              </View>
            </Animatable.View>
          </View>
        </Modal>
      {/* Dispute Modal */}
      <Modal
          animationType="fade"
          transparent={true}
          visible={disputeModalVisible}
          onRequestClose={onCloseDisputeModal}>
          <View style={styles.modalOverlay}>
            <Animatable.View
              animation="zoomIn"
              duration={400}
              style={[
                styles.modalContent,
                {backgroundColor: theme.backgroundColor},
              ]}>
              <Text style={[styles.modalTitle, {color: theme.text}]}>
                Order Actions
              </Text>
              <View style={styles.actionButtonRow}>
                <Animatable.View animation="bounceIn" duration={600}>
                  <TouchableOpacity
                    style={[
                      styles.disputeButton,
                      {backgroundColor: theme.status},
                    ]}
                    onPress={() => {
                      navigation.navigate('CreateTicket', {
                        order_id: orderForDispute,
                        fromOrders: true,
                      });
                      onCloseDisputeModal();
                    }}>
                    <Text style={styles.disputeButtonText}>Create Dispute</Text>
                  </TouchableOpacity>
                </Animatable.View>
                <Animatable.View
                  animation="bounceIn"
                  duration={600}
                  delay={100}>
                  <TouchableOpacity
                    style={[
                      styles.closeButton,
                      {backgroundColor: theme.status},
                    ]}
                    onPress={onCloseDisputeModal}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </Animatable.View>
              </View>
            </Animatable.View>
          </View>
        </Modal>
    </>
  );
};

export default OrderModals;
