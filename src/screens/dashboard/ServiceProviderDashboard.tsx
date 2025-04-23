/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import SideMenu from '../../assets/images/SideMenu.svg';
import PieChart from 'react-native-pie-chart';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useSelector} from 'react-redux';
import {selectId, selectUserName} from '../../slice/Slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import RecentOrderCard from '../../components/common/orderCard/OrderCard';

const STORAGE_KEY = '@login_credentials';

// Define Order interface for type safety
interface OrderDetail {
  id: number;
  product_name: string;
  price: string | number;
  quantity: number;
}

export interface Order {
  id: number;
  order_uuid: string;
  total_price: string | number;
  created_at: string;
  payment_status?: string;
  order_details: OrderDetail[];
  points?: number;
  is_redeemed?: boolean;
}

const ServiceProviderDashboard = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const reduxUserName = useSelector(selectUserName);
  const reduxUserId = useSelector(selectId);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [trackingStatuses, setTrackingStatuses] = useState<{
    [key: string]: {
      status: string;
      order_id?: number;
      order_tracking_uuid?: string;
    };
  }>({});
  const [refreshing, setRefreshing] = useState(false);

  // Fetch userName and userId from AsyncStorage or Redux
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const credentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (credentials) {
          const parsedCredentials = JSON.parse(credentials);
          setUserName(parsedCredentials.name ?? reduxUserName ?? null);
          setUserId(parsedCredentials.id ?? reduxUserId ?? null);
        } else {
          setUserName(reduxUserName ?? null);
          setUserId(reduxUserId ?? null);
        }
      } catch (error) {
        console.warn('Error retrieving user data from AsyncStorage:', error);
        setUserName(reduxUserName ?? null);
        setUserId(reduxUserId ?? null);
      }
    };

    fetchUserData();
  }, [reduxUserName, reduxUserId]);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    if (userId === null) {
      return;
    }
    try {
      const endpoint = `orders?service_provider_id=${userId}`;
      const response = (await apiHelper({
        method: 'GET',
        endpoint,
      })) as {data: Order[]};
      setOrders(response.data.slice(0, 5)); // Limit to 5 orders
    } catch (error) {
      console.warn('Error fetching orders:', error);
    }
  }, [userId]);

  // Fetch tracking statuses
  const fetchTrackingStatuses = useCallback(async () => {
    if (orders.length === 0) {
      return;
    }
    try {
      const trackingPromises = orders.map(async order => {
        const response = (await apiHelper({
          method: 'GET',
          endpoint: `order-tracking/order/${order.order_uuid}`,
        })) as {status: number; data: any[]};
        return {
          order_uuid: order.order_uuid,
          status: response.data[0].status,
          order_id: response.data[0].order_id,
          order_tracking_uuid: response.data[0].order_tracking_uuid,
        };
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
    }
  }, [orders]);

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    await fetchTrackingStatuses();
    setRefreshing(false);
  };

  // Fetch orders on mount or userId change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Fetch tracking statuses when orders change
  useEffect(() => {
    fetchTrackingStatuses();
  }, [fetchTrackingStatuses]);

  const summaryData = [
    {title: 'Total Orders', value: '1,250 Orders', icon: 'cart-outline'},
    {title: 'Total Customers', value: '980 Customers', icon: 'people-outline'},
    {title: 'Total Earnings', value: '$12,500.00', icon: 'cash-outline'},
    {title: 'Support Tickets', value: '80 Customers', icon: 'mail-outline'},
  ];

  const chartData = [
    {
      name: 'Ongoing',
      percent: 64.03,
      color: '#03A7A7',
      legendFontColor: '#7F7F7F',
      price: 830.03,
    },
    {
      name: 'Completed',
      percent: 75.75,
      color: '#FF00A7',
      legendFontColor: '#7F7F7F',
      price: 980.03,
    },
    {
      name: 'Cancelled',
      percent: 55.81,
      color: '#EB001B',
      legendFontColor: '#7F7F7F',
      price: 780.03,
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <SideMenu />
            </TouchableOpacity>
            <View>
              <Text style={[styles.userName, {color: theme.text}]}>
                Hi {userName},
              </Text>
              <Text style={[styles.welcomeText, {color: theme.text}]}>
                Welcome Back
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.iconBox, {backgroundColor: theme.backgroundColor}]}
            onPress={() => navigation.navigate('Notification')}>
            <Icon name="notifications-outline" size={20} color={theme.input} />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#03A7A7']}
              tintColor={'#03A7A7'}
            />
          }>
          {/* Summary Section */}
          <View style={styles.summaryContainer}>
            {summaryData.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.card,
                  (index + 1) % 2 === 0 && styles.cardLastInRow,
                  index >= 2 && styles.cardLastRow,
                  {backgroundColor: theme.backgroundColor},
                ]}>
                <Icon name={item.icon} size={24} color={'#03A7A7'} />
                <Text style={[styles.cardTitle, {color: theme.text}]}>
                  {item.title}
                </Text>
                <Text style={styles.cardValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Orders Overview */}
          <Text style={[styles.sectionTitle, {color: theme.text}]}>
            Orders Overview
          </Text>
          <View
            style={[
              styles.chartContainer,
              {backgroundColor: theme.backgroundColor},
            ]}>
            <PieChart
              widthAndHeight={wp(35)}
              series={chartData.map(item => ({
                value: item.percent,
                color: item.color,
              }))}
              cover={0.6}
            />
            <View style={styles.legendContainer}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[styles.legendColor, {backgroundColor: item.color}]}
                  />
                  <Text style={styles.legendText}>
                    {item.name}{' '}
                    <Text style={{color: theme.input, fontWeight: 'bold'}}>
                      ${item.price}
                    </Text>
                    {'   '}
                    {item.percent.toFixed(2)}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
          {/* Recent Orders */}
          <View style={styles.recentOrdersHeader}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>
              Recent Orders
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {orders.length === 0 ? (
            <Text style={[styles.noOrdersText, {color: theme.text}]}>
              No recent orders
            </Text>
          ) : (
            orders.map(order => (
              <RecentOrderCard
                key={order.id}
                order={order}
                theme={theme}
                trackingStatuses={trackingStatuses}
                formatDate={formatDate}
              />
            ))
          )}
        </ScrollView>
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
      ios: hp(0.5),
      android: hp(2.5),
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Platform.select({
      ios: hp(1),
      android: hp(2),
    }),
    paddingTop: Platform.select({
      ios: hp(1),
      android: hp(4.5),
    }),
  },
  headerLeft: {flexDirection: 'row', alignItems: 'center', gap: wp(2)},
  userName: {color: '#333', fontWeight: 'bold', fontSize: wp(4)},
  welcomeText: {color: '#2c2c2c', fontSize: wp(3.5)},
  iconBox: {
    padding: wp(2),
    backgroundColor: '#ffffff',
    borderRadius: wp(2),
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    borderRadius: wp(2.5),
  },
  card: {
    backgroundColor: '#fff',
    width: '50%',
    padding: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#A9A9A9',
  },
  cardLastInRow: {
    borderRightWidth: 0,
  },
  cardLastRow: {
    borderBottomWidth: 0,
  },
  cardTitle: {fontSize: wp(3.5), color: '#333', fontWeight: 'bold'},
  cardValue: {fontSize: wp(3.5), color: '#666', marginTop: hp(0.5)},
  sectionTitle: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#333',
    marginVertical: hp(2),
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: wp(5),
    borderRadius: 10,
    flexDirection: 'row',
    gap: Platform.OS === 'ios' ? wp(8) : wp(5),
    paddingVertical: hp(4),
  },
  recentOrdersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#FF00A7',
    fontSize: wp(3.5),
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  legendContainer: {
    alignSelf: 'flex-end',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(0.5),
  },
  legendColor: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(2),
    marginRight: wp(1),
  },
  legendText: {
    fontSize: Platform.OS === 'ios' ? wp(2) : wp(3),
    color: '#9c9c9c',
  },
  scrollViewContent: {
    paddingBottom: hp(8),
  },
  noOrdersText: {
    fontSize: wp(4),
    color: '#333',
    textAlign: 'center',
    marginTop: hp(2),
  },
});

export default ServiceProviderDashboard;
