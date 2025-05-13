/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Modal, View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {Order, OrderDetail, statusOptions} from './types';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/orders/OrderStyles';

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
  role: string | null;
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
  role,
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
          <View style={[styles.modalContent, {backgroundColor: theme.whole}]}>
            <Text style={[styles.modalTitle, {color: theme.text}]}>
              Order Items (Order #{selectedOrder?.id})
            </Text>
            <ScrollView
              style={styles.itemsContainer}
              showsVerticalScrollIndicator={false}>
              {selectedOrder?.order_details.map((detail: OrderDetail) => (
                <View key={detail.id} style={styles.itemCard}>
                  <Text style={[styles.itemTitle, {color: theme.text}]}>
                    {detail.product_name}
                  </Text>
                  <View style={styles.itemDetailRow}>
                    <Text style={[styles.itemDetailLabel, {color: '#6c757d'}]}>
                      Price:
                    </Text>
                    <Text style={[styles.itemDetailValue, {color: theme.text}]}>
                      ${parseFloat(detail.price.toString()).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.itemDetailRow}>
                    <Text style={[styles.itemDetailLabel, {color: '#6c757d'}]}>
                      Quantity:
                    </Text>
                    <Text style={[styles.itemDetailValue, {color: theme.text}]}>
                      {detail.quantity}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onCloseOrderModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Status Update Modal (Service Provider Only) */}
      {role === 'service_provider' && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={statusModalVisible}
          onRequestClose={onCloseStatusModal}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.statusModalContent,
                {backgroundColor: theme.whole},
              ]}>
              <Text style={[styles.modalTitle, {color: theme.text}]}>
                Update Order Status
              </Text>
              <View style={styles.statusCirclesContainer}>
                {statusOptions.map(status => (
                  <TouchableOpacity
                    key={status}
                    style={styles.statusCircleWrapper}
                    onPress={() =>
                      onUpdateOrderStatus(orderForStatusUpdate!, status)
                    }>
                    <View
                      style={[
                        styles.statusCircle,
                        {
                          backgroundColor:
                            trackingStatuses[orderForStatusUpdate!]?.status ===
                            status
                              ? '#00A19D'
                              : 'transparent',
                          borderColor:
                            trackingStatuses[orderForStatusUpdate!]?.status ===
                            status
                              ? '#00A19D'
                              : '#6c757d',
                        },
                      ]}
                    />
                    <Text
                      style={[styles.statusCircleText, {color: theme.text}]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onCloseStatusModal}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      {/* Tracking Status Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={trackingModalVisible}
        onRequestClose={onCloseTrackingModal}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.trackingModalContent,
              {backgroundColor: theme.whole},
            ]}>
            <Text style={[styles.modalTitle, {color: theme.text}]}>
              Tracking Status
            </Text>
            <Text style={[styles.trackingStatusText, {color: theme.text}]}>
              {trackingStatuses[orderForTracking!]?.status || 'Pending'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onCloseTrackingModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Cancel Order Modal (Customer Only) */}
      {role === 'customer' && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={cancelModalVisible}
          onRequestClose={onCloseCancelModal}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.cancelModalContent,
                {backgroundColor: theme.whole},
              ]}>
              <Text style={[styles.modalTitle, {color: theme.text}]}>
                Order Actions
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: wp(8),
                }}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => onCancelOrder(orderForCancel!)}>
                  <Text style={styles.cancelButtonText}>Cancel Order</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onCloseCancelModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      {/* Dispute Modal (Customer Only, Completed Orders) */}
      {role === 'customer' && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={disputeModalVisible}
          onRequestClose={onCloseDisputeModal}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.cancelModalContent,
                {backgroundColor: theme.whole},
              ]}>
              <Text style={[styles.modalTitle, {color: theme.text}]}>
                Order Actions
              </Text>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: hp(2),
                }}>
                <TouchableOpacity
                  style={styles.disputeButton}
                  onPress={() => {
                    navigation.navigate('CreateTicket', {
                      order_id: orderForDispute,
                      fromOrders: true,
                    });
                    onCloseDisputeModal();
                  }}>
                  <Text style={styles.disputeButtonText}>Create Dispute</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onCloseDisputeModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default OrderModals;
