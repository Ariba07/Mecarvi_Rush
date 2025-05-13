import React, {useCallback, useContext, useEffect, useState} from 'react';
import {SafeAreaView, View, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {useSelector} from 'react-redux';
import {selectId, selectUserId, selectRole} from '../../slice/Slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import Header from '../../components/common/header/Header';
import OrderList from './OrderList';
import OrderModals from './OrderModals';
import {STORAGE_KEY, Order, debounce} from './types';
import {styles} from '../../assets/styles/orders/OrderStyles';

const Orders: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const reduxUserId = useSelector(selectId);
  const reduxCustomerId = useSelector(selectUserId);
  const reduxRole = useSelector(selectRole);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState('All');
  const [orders, setOrders] = useState<Order[]>([]);
  const [trackingStatuses, setTrackingStatuses] = useState<{
    [key: string]: {
      status: string;
      order_id?: number;
      order_tracking_uuid?: string;
    };
  }>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [orderForStatusUpdate, setOrderForStatusUpdate] = useState<
    string | null
  >(null);
  const [orderForTracking, setOrderForTracking] = useState<string | null>(null);
  const [orderForCancel, setOrderForCancel] = useState<string | null>(null);
  const [disputeModalVisible, setDisputeModalVisible] = useState(false);
  const [orderForDispute, setOrderForDispute] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [fetchOrdersError, setFetchOrdersError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoleFromStorage = async () => {
      try {
        const savedCredentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedCredentials) {
          const {role: storedRole} = JSON.parse(savedCredentials);
          setRole(storedRole || reduxRole);
        } else {
          setRole(reduxRole);
        }
      } catch (error) {
        setRole(reduxRole);
      }
    };
    fetchRoleFromStorage();
  }, [reduxRole]);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const credentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (credentials) {
          const parsedCredentials = JSON.parse(credentials);
          setUserId(
            role === 'service_provider'
              ? parsedCredentials.id
              : parsedCredentials.userId,
          );
        } else {
          setUserId(
            role === 'service_provider'
              ? reduxUserId ?? null
              : reduxCustomerId ?? null,
          );
        }
      } catch (error) {
        setUserId(
          role === 'service_provider'
            ? reduxUserId ?? null
            : reduxCustomerId ?? null,
        );
      }
    };
    if (role) {
      getUserId();
    }
  }, [role, reduxUserId, reduxCustomerId]);

  const fetchOrders = useCallback(async () => {
    if (userId === null || !role) {
      return;
    }
    setIsFirstLoad(true);
    setFetchOrdersError(null);
    try {
      const endpoint =
        role === 'service_provider'
          ? 'service-provider/orders/getAll/?per_page=6&page=1'
          : 'orders?per_page=6&page=1';
      const response = (await apiHelper({
        method: 'GET',
        endpoint,
      })) as {data: Order[]; meta: {pagination: {last_page: number}}};
      if (!response?.data || !response?.meta?.pagination?.last_page) {
        throw new Error('Invalid API response');
      }
      setOrders(response.data.sort((a, b) => b.id - a.id));
      setTotalPages(response.meta.pagination.last_page);
      setCurrentPage(1);
      setIsFirstLoad(false);
    } catch (error: any) {
      setFetchOrdersError(error.message || 'Failed to fetch orders');
      setIsFirstLoad(false);
    }
  }, [userId, role]);

  const loadMore = useCallback(async () => {
    if (currentPage >= totalPages || isLoadingMore || loadMoreError) {
      return;
    }
    setIsLoadingMore(true);
    setLoadMoreError(null);
    try {
      const nextPage = currentPage + 1;
      const endpoint =
        role === 'service_provider'
          ? `service-provider/orders/all/?per_page=6&page=${nextPage}`
          : `orders?per_page=6&page=${nextPage}`;
      const response = (await apiHelper({
        method: 'GET',
        endpoint,
      })) as {data: Order[]; meta: {pagination: {last_page: number}}};
      if (!response?.data || !response?.meta?.pagination?.last_page) {
        throw new Error('Invalid API response');
      }
      const fetchedData = response.data;
      const orderUuids = new Set(orders.map(order => order.order_uuid));
      const newOrders = fetchedData.filter(
        order => !orderUuids.has(order.order_uuid),
      );
      setOrders(prev => [...prev, ...newOrders.sort((a, b) => b.id - a.id)]);
      setCurrentPage(nextPage);
      setTotalPages(response.meta.pagination.last_page);
    } catch (error: any) {
      setLoadMoreError(error.message || 'Failed to load more orders');
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, isLoadingMore, loadMoreError, orders, role, totalPages]);

  const fetchTrackingStatuses = useCallback(async () => {
    if (orders.length === 0) {
      return;
    }
    try {
      const trackingPromises = orders.map(async order => {
        try {
          const response = (await apiHelper({
            method: 'GET',
            endpoint: `order-tracking/order/${order.order_uuid}`,
          })) as {status: number; data: any[]};
          return {
            order_uuid: order.order_uuid,
            status: response.data[0]?.status || 'Pending',
            order_id: response.data[0]?.order_id,
            order_tracking_uuid: response.data[0]?.order_tracking_uuid,
          };
        } catch (error) {
          return {
            order_uuid: order.order_uuid,
            status: 'Pending',
            order_id: undefined,
            order_tracking_uuid: undefined,
          };
        }
      });
      const results = await Promise.all(trackingPromises);
      const statusMap = results.reduce(
        (acc, {order_uuid, status, order_id, order_tracking_uuid}) => {
          acc[order_uuid] = {status, order_id, order_tracking_uuid};
          return acc;
        },
        {} as {
          [key: string]: {
            status: string;
            order_id?: number;
            order_tracking_uuid?: string;
          };
        },
      );
      setTrackingStatuses(statusMap);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch tracking statuses.');
    }
  }, [orders]);

  const onRefresh = async () => {
    setRefreshing(true);
    setOrders([]);
    setCurrentPage(1);
    setFetchOrdersError(null);
    await fetchOrders();
    await fetchTrackingStatuses();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchTrackingStatuses();
  }, [fetchTrackingStatuses]);

  const updateOrderStatus = async (orderUuid: string, newStatus: string) => {
    const trackingInfo = trackingStatuses[orderUuid];
    if (!trackingInfo) {
      Alert.alert('Error', 'Tracking information not available.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      formData.append('order_id', trackingInfo.order_id!.toString());
      formData.append('details', 'Updated via app');
      await apiHelper({
        method: 'POST',
        endpoint: `order-tracking/${trackingInfo.order_tracking_uuid}?_method=patch`,
        data: formData,
      });
      setTrackingStatuses(prev => ({
        ...prev,
        [orderUuid]: {...prev[orderUuid], status: newStatus},
      }));
      Alert.alert('Success', `Order status updated to ${newStatus}.`);
      setStatusModalVisible(false);
      setOrderForStatusUpdate(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status. Please try again.');
    }
  };

  const cancelOrder = async (orderUuid: string) => {
    try {
      await apiHelper({method: 'POST', endpoint: `orders/${orderUuid}/cancel`});
      await fetchOrders();
      Alert.alert('Success', 'Order has been cancelled.');
      setCancelModalVisible(false);
      setOrderForCancel(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel order. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header
          title={role === 'service_provider' ? 'Orders Management' : 'Orders'}
          onBackPress={() => navigation.goBack()}
        />
        <OrderList
          orders={orders}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          role={role}
          isFirstLoad={isFirstLoad}
          fetchOrdersError={fetchOrdersError}
          refreshing={refreshing}
          onRefresh={onRefresh}
          isLoadingMore={isLoadingMore}
          loadMoreError={loadMoreError}
          onLoadMore={debounce(loadMore, 300)}
          onOpenOrderModal={setSelectedOrder}
          onOpenStatusModal={orderUuid => {
            setOrderForStatusUpdate(orderUuid);
            setStatusModalVisible(true);
          }}
          onOpenTrackingModal={orderUuid => {
            setOrderForTracking(orderUuid);
            setTrackingModalVisible(true);
          }}
          onOpenCancelModal={orderUuid => {
            setOrderForCancel(orderUuid);
            setCancelModalVisible(true);
          }}
          onOpenDisputeModal={orderId => {
            setOrderForDispute(orderId);
            setDisputeModalVisible(true);
          }}
        />
        <OrderModals
          selectedOrder={selectedOrder}
          statusModalVisible={statusModalVisible}
          trackingModalVisible={trackingModalVisible}
          cancelModalVisible={cancelModalVisible}
          disputeModalVisible={disputeModalVisible}
          orderForStatusUpdate={orderForStatusUpdate}
          orderForTracking={orderForTracking}
          orderForCancel={orderForCancel}
          orderForDispute={orderForDispute}
          role={role}
          trackingStatuses={trackingStatuses}
          onCloseOrderModal={() => setSelectedOrder(null)}
          onCloseStatusModal={() => {
            setStatusModalVisible(false);
            setOrderForStatusUpdate(null);
          }}
          onCloseTrackingModal={() => {
            setTrackingModalVisible(false);
            setOrderForTracking(null);
          }}
          onCloseCancelModal={() => {
            setCancelModalVisible(false);
            setOrderForCancel(null);
          }}
          onCloseDisputeModal={() => {
            setDisputeModalVisible(false);
            setOrderForDispute(null);
          }}
          onUpdateOrderStatus={updateOrderStatus}
          onCancelOrder={cancelOrder}
        />
      </View>
    </SafeAreaView>
  );
};

export default Orders;
