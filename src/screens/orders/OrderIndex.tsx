/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/common/header/Header';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useSelector} from 'react-redux';
import {selectId, selectUserId, selectRole} from '../../slice/Slice';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@login_credentials';

// Define Order interface for type safety
interface OrderDetail {
  id: number;
  product_name: string;
  price: string | number;
  quantity: number;
}

interface Order {
  id: number;
  order_uuid: string;
  total_price: string | number;
  created_at: string;
  payment_status?: string;
  order_details: OrderDetail[];
  order_tracking?: {
    id: number;
    order_tracking_uuid: string;
    order_id: number;
    status: string;
    update_time: string;
    details: string;
    created_at: string;
    updated_at: string;
  }[];
}

const Orders = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const reduxUserId = useSelector(selectId); // For service provider
  const reduxCustomerId = useSelector(selectUserId); // For customer
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
  const [orderForStatusUpdate, setOrderForStatusUpdate] = useState<
    string | null
  >(null);
  const [refreshing, setRefreshing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [fetchOrdersError, setFetchOrdersError] = useState<string | null>(null);

  // Unified tabs for both customer and service provider
  const tabs = [
    {label: 'All Orders', filter: 'All'},
    {label: 'Active', filter: 'Processing'},
    {label: 'Completed', filter: 'Completed'},
    {label: 'Cancelled', filter: 'Cancelled'},
    {label: 'Disputes', filter: 'Dispute'},
  ];

  const statusOptions = ['Processing', 'Completed', 'Cancelled', 'Dispute'];

  // Debounce utility
  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    wait: number,
  ) => {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Fetch role from AsyncStorage or Redux
  useEffect(() => {
    const fetchRoleFromStorage = async () => {
      try {
        const savedCredentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedCredentials) {
          const {role: storedRole} = JSON.parse(savedCredentials);
          if (storedRole) {
            setRole(storedRole);
          } else {
            setRole(reduxRole);
          }
        } else {
          setRole(reduxRole);
        }
      } catch (error) {
        console.log(
          'Error fetching role from AsyncStorage:',
          (error as any)?.message,
        );
        setRole(reduxRole);
      }
    };

    fetchRoleFromStorage();
  }, [reduxRole]);

  // Fetch user ID based on role
  useEffect(() => {
    const getUserId = async () => {
      try {
        const credentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (credentials) {
          const parsedCredentials = JSON.parse(credentials);
          if (role === 'service_provider' && parsedCredentials.id) {
            setUserId(parsedCredentials.id);
            return;
          } else if (role === 'customer' && parsedCredentials.userId) {
            setUserId(parsedCredentials.userId);
            return;
          }
        }
        setUserId(
          role === 'service_provider'
            ? reduxUserId ?? null
            : reduxCustomerId ?? null,
        );
      } catch (error) {
        console.warn('Error retrieving user ID from AsyncStorage:', error);
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

  // Fetch orders based on role
  const fetchOrders = useCallback(async () => {
    if (userId === null || !role) {
      return;
    }
    setIsFirstLoad(true);
    setFetchOrdersError(null);
    try {
      const endpoint =
        role === 'service_provider'
          ? `orders?service_provider_id=${userId}&per_page=6&page=1`
          : `orders?customer_id=${userId}&per_page=6&page=1`;
      const response = (await apiHelper({
        method: 'GET',
        endpoint,
      })) as {data: Order[]; meta: {pagination: {last_page: number}}};

      if (!response?.data || !response?.meta?.pagination?.last_page) {
        throw new Error('Invalid API response: Missing data or pagination');
      }

      setOrders(response.data.sort((a, b) => b.id - a.id)); // Sort by ID descending
      setTotalPages(response.meta.pagination.last_page);
      setCurrentPage(1);
      setIsFirstLoad(false);
    } catch (error: any) {
      console.warn('Error fetching orders:', error);
      setFetchOrdersError(error.message || 'Failed to fetch orders');
      setIsFirstLoad(false);
    }
  }, [userId, role]);

  // Load more orders
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
          ? `orders?service_provider_id=${userId}&per_page=6&page=${nextPage}`
          : `orders?customer_id=${userId}&per_page=6&page=${nextPage}`;
      const response = (await apiHelper({
        method: 'GET',
        endpoint,
      })) as {data: Order[]; meta: {pagination: {last_page: number}}};

      if (!response?.data || !response?.meta?.pagination?.last_page) {
        throw new Error('Invalid API response: Missing data or pagination');
      }

      const fetchedData = response.data;
      const orderUuids = new Set(orders.map(order => order.order_uuid));
      const newOrders = fetchedData.filter(order => {
        const isDuplicate = orderUuids.has(order.order_uuid);
        if (isDuplicate) {
          console.warn(`Duplicate order detected: ${order.order_uuid}`);
        }
        return !isDuplicate;
      });

      setOrders(prev => [
        ...prev,
        ...newOrders.sort((a, b) => b.id - a.id), // Sort new orders
      ]);
      setCurrentPage(nextPage);
      if (totalPages !== response.meta.pagination.last_page) {
        setTotalPages(response.meta.pagination.last_page);
      }
    } catch (error: any) {
      console.warn('Error fetching more orders:', error);
      setLoadMoreError(error.message || 'Failed to load more orders');
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    currentPage,
    totalPages,
    isLoadingMore,
    loadMoreError,
    role,
    userId,
    orders,
  ]);

  const debouncedLoadMore = debounce(loadMore, 300); // Debounce for 300ms

  // Fetch tracking statuses
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
            status: response.data[0]?.status || 'Order Placed',
            order_id: response.data[0]?.order_id,
            order_tracking_uuid: response.data[0]?.order_tracking_uuid,
          };
        } catch (error) {
          console.warn(
            `Error fetching tracking for order ${order.order_uuid}:`,
            error,
          );
          return {
            order_uuid: order.order_uuid,
            status: 'Order Placed',
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
      console.warn('Error fetching tracking statuses:', error);
      Alert.alert('Error', 'Failed to fetch tracking statuses.');
    }
  }, [orders]);

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    setOrders([]); // Clear orders immediately
    setCurrentPage(1);
    setFetchOrdersError(null);
    await fetchOrders();
    await fetchTrackingStatuses();
    setRefreshing(false);
  };

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Fetch tracking statuses when orders change
  useEffect(() => {
    fetchTrackingStatuses();
  }, [fetchTrackingStatuses]);

  // Filter orders based on selected tab
  const filteredOrders =
    selectedTab === 'All'
      ? orders
      : orders.filter(
          ord =>
            (trackingStatuses[ord.order_uuid]?.status || 'Order Placed') ===
            selectedTab,
        );

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
  };

  const openStatusModal = (orderUuid: string) => {
    setOrderForStatusUpdate(orderUuid);
    setStatusModalVisible(true);
  };

  const closeStatusModal = () => {
    setStatusModalVisible(false);
    setOrderForStatusUpdate(null);
  };

  const updateOrderStatus = async (orderUuid: string, newStatus: string) => {
    const trackingInfo = trackingStatuses[orderUuid];
    if (!trackingInfo) {
      Alert.alert('Error', 'Tracking information not available.');
      return;
    }

    const {order_id, order_tracking_uuid} = trackingInfo;

    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      formData.append('order_id', order_id!.toString());
      formData.append('details', 'Updated via app');

      await apiHelper({
        method: 'POST',
        endpoint: `order-tracking/${order_tracking_uuid}?_method=patch`,
        data: formData,
      });

      setTrackingStatuses(prev => ({
        ...prev,
        [orderUuid]: {...prev[orderUuid], status: newStatus},
      }));

      Alert.alert('Success', `Order status updated to ${newStatus}.`);
      closeStatusModal();
    } catch (error) {
      console.warn('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderOrderItem = ({item}: {item: Order}) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={[styles.card, {backgroundColor: theme.backgroundColor}]}
        onPress={() => openOrderModal(item)}>
        <View style={styles.detailsContainer}>
          <Text style={[styles.orderNumber, {color: theme.text}]}>
            Order id- #{item.id}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {role === 'service_provider' ? (
              <TouchableOpacity
                onPress={() => openStatusModal(item.order_uuid)}>
                <Text
                  style={[
                    styles.status,
                    {
                      color: '#00A19D',
                      textDecorationLine: 'underline',
                    },
                  ]}>
                  {trackingStatuses[item.order_uuid]?.status || 'Loading...'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text
                style={[
                  styles.status,
                  {
                    color: '#00A19D',
                  },
                ]}>
                {trackingStatuses[item.order_uuid]?.status || 'Loading...'}
              </Text>
            )}
            <Text style={[styles.priceText, {color: '#FF0080'}]}>
              ${parseFloat(item.total_price.toString()).toFixed(2)}
            </Text>
          </View>
          <Text style={[styles.dateText, {color: '#6c757d'}]}>
            Created On: {formatDate(item.created_at)}
          </Text>
          {trackingStatuses[item.order_uuid]?.status === 'Completed' &&
            role === 'customer' && (
              <TouchableOpacity
                style={styles.ratingButton}
                onPress={() =>
                  navigation.navigate('Review', {order_id: item.id})
                }>
                <Text style={styles.ratingButtonText}>Rate Order</Text>
              </TouchableOpacity>
            )}
          {role === 'service_provider' && (
            <View style={styles.paymentStatus}>
              <Text style={styles.paymentStatusText}>
                {item.payment_status === 'paid' ? 'Paid' : 'Pending'}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header
          title={role === 'service_provider' ? 'Orders Management' : 'Orders'}
          onBackPress={() => navigation.goBack()}
        />
        <View
          style={[styles.tabWrapper, {backgroundColor: theme.backgroundColor}]}>
          <FlatList
            data={tabs}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.filter}
            contentContainerStyle={styles.tabContainer}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => setSelectedTab(item.filter)}
                style={[
                  styles.tabButton,
                  {backgroundColor: theme.whole},
                  selectedTab === item.filter && styles.activeTabButton,
                ]}>
                <Text
                  style={[
                    styles.tabText,
                    {color: theme.input},
                    selectedTab === item.filter && styles.activeTabText,
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        {isFirstLoad ? (
          <View style={styles.noOrdersContainer}>
            <Text style={[styles.noOrdersText, {color: theme.text}]}>
              Loading orders...
            </Text>
          </View>
        ) : fetchOrdersError ? (
          <View style={styles.noOrdersContainer}>
            <Text style={[styles.noOrdersText, {color: theme.text}]}>
              {fetchOrdersError}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchOrders()}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredOrders.length === 0 ? (
          <View style={styles.noOrdersContainer}>
            <Text style={[styles.noOrdersText, {color: theme.text}]}>
              No such orders yet
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredOrders}
            keyExtractor={item => item.id.toString()}
            renderItem={renderOrderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#00A19D']}
                tintColor={'#00A19D'}
              />
            }
            onEndReached={debouncedLoadMore}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              isLoadingMore ? (
                <View style={styles.footerContainer}>
                  <Text style={[styles.footerText, {color: theme.text}]}>
                    Loading more...
                  </Text>
                </View>
              ) : loadMoreError ? (
                <View style={styles.footerContainer}>
                  <Text style={[styles.footerText, {color: theme.text}]}>
                    {loadMoreError}
                  </Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => loadMore()}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : null
            }
          />
        )}
        {/* Order Details Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={selectedOrder !== null}
          onRequestClose={closeOrderModal}>
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
                      <Text
                        style={[styles.itemDetailLabel, {color: '#6c757d'}]}>
                        Price:
                      </Text>
                      <Text
                        style={[styles.itemDetailValue, {color: theme.text}]}>
                        ${parseFloat(detail.price.toString()).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.itemDetailRow}>
                      <Text
                        style={[styles.itemDetailLabel, {color: '#6c757d'}]}>
                        Quantity:
                      </Text>
                      <Text
                        style={[styles.itemDetailValue, {color: theme.text}]}>
                        {detail.quantity}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeOrderModal}>
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
            onRequestClose={closeStatusModal}>
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
                        updateOrderStatus(orderForStatusUpdate!, status)
                      }>
                      <View
                        style={[
                          styles.statusCircle,
                          {
                            backgroundColor:
                              trackingStatuses[orderForStatusUpdate!]
                                ?.status === status
                                ? '#00A19D'
                                : 'transparent',
                            borderColor:
                              trackingStatuses[orderForStatusUpdate!]
                                ?.status === status
                                ? '#00A19D'
                                : '#6c757d',
                          },
                        ]}
                      />
                      <Text
                        style={[styles.statusCircleText, {color: theme.text}]}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeStatusModal}>
                  <Text style={styles.closeButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
    paddingBottom: Platform.select({
      ios: hp(7),
      android: hp(10),
    }),
  },
  tabWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: wp(3),
    marginVertical: hp(2),
    padding: hp(1),
  },
  tabContainer: {
    paddingHorizontal: wp(2),
    alignItems: 'center',
  },
  tabButton: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    marginRight: wp(1.5),
    borderRadius: wp(2),
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: '#FF0080',
  },
  tabText: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'System', // Use a modern sans-serif font, replace with your preferred font if available
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  listContainer: {
    paddingBottom: hp(2),
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(10),
  },
  noOrdersText: {
    fontSize: wp(5),
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: hp(2),
  },
  cardContainer: {
    marginBottom: hp(1.5),
  },
  card: {
    backgroundColor: 'white',
    borderRadius: wp(3),
    padding: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsContainer: {
    flex: 1,
  },
  orderNumber: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    marginBottom: hp(0.5),
    color: '#000000',
  },
  status: {
    fontSize: wp(4.2),
    fontWeight: '500',
    marginBottom: hp(0.5),
  },
  dateText: {
    fontSize: wp(3.8),
    marginBottom: hp(0.5),
    color: '#6c757d',
  },
  priceText: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },
  paymentStatus: {
    backgroundColor: '#00A19D',
    paddingVertical: wp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: wp(1),
    alignSelf: 'center',
    marginTop: hp(0.5),
  },
  paymentStatusText: {
    color: 'white',
    fontSize: wp(3.5),
    fontWeight: 'bold',
  },
  ratingButton: {
    backgroundColor: '#00A19D',
    paddingVertical: wp(2),
    paddingHorizontal: wp(5),
    borderRadius: wp(2),
    alignSelf: 'flex-start',
    marginTop: hp(0.5),
  },
  ratingButtonText: {
    color: 'white',
    fontSize: wp(3.8),
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: wp(4),
    padding: wp(5),
    width: wp(85),
    maxHeight: hp(70),
  },
  statusModalContent: {
    borderRadius: wp(4),
    padding: wp(5),
    width: wp(85),
  },
  modalTitle: {
    fontSize: wp(5),
    fontWeight: 'bold',
    marginBottom: hp(2),
    textAlign: 'center',
    color: '#333',
  },
  itemsContainer: {
    flexGrow: 0,
    marginBottom: hp(2),
  },
  itemCard: {
    backgroundColor: 'rgba(0, 161, 157, 0.1)',
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(1.5),
  },
  itemTitle: {
    fontSize: wp(5),
    fontWeight: 'bold',
    marginBottom: hp(1),
    color: '#333',
  },
  itemDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(0.5),
  },
  itemDetailLabel: {
    fontSize: wp(3.8),
    color: '#6c757d',
  },
  itemDetailValue: {
    fontSize: wp(3.8),
    fontWeight: '500',
    color: '#333',
  },
  statusCirclesContainer: {
    marginBottom: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCircleWrapper: {
    alignItems: 'center',
    marginHorizontal: wp(3),
    marginVertical: hp(1),
    flexDirection: 'row',
    gap: wp(2),
  },
  statusCircle: {
    width: wp(3),
    height: wp(3),
    borderRadius: wp(4),
    borderWidth: 2,
  },
  statusCircleText: {
    fontSize: wp(4),
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#00A19D',
    paddingVertical: wp(3),
    paddingHorizontal: wp(8),
    borderRadius: wp(3),
    alignSelf: 'center',
    marginTop: hp(1),
  },
  closeButtonText: {
    color: 'white',
    fontSize: wp(4.2),
    fontWeight: 'bold',
  },
  footerContainer: {
    padding: hp(2),
    alignItems: 'center',
  },
  footerText: {
    fontSize: wp(4),
    color: '#333',
    marginBottom: hp(1),
  },
  retryButton: {
    backgroundColor: '#00A19D',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: wp(2),
  },
  retryButtonText: {
    color: 'white',
    fontSize: wp(4),
    fontWeight: '600',
  },
});

export default Orders;
