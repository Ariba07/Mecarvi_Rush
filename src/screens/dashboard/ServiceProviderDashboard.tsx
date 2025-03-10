/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
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
import OrderCard from '../../components/common/orderCard/OrderCard';
import {orders} from '../../components/helperUtils/orderTypes/Types';

const ServiceProviderDashboard = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <SideMenu />
            </TouchableOpacity>
            <View>
              <Text style={styles.userName}>Hi Chris,</Text>
              <Text style={styles.welcomeText}>Welcome Back</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.iconBox}
            onPress={() => navigation.navigate('Notification')}>
            <Icon name="notifications-outline" size={20} color={'#333333'} />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}>
          {/* Summary Section */}
          <View style={styles.summaryContainer}>
            {summaryData.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.card,
                  (index + 1) % 2 === 0 && styles.cardLastInRow, // Remove right border for second card in each row
                  index >= 2 && styles.cardLastRow, // Remove bottom border for last two cards
                ]}>
                <Icon name={item.icon} size={24} color={'#03A7A7'} />
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Orders Overview */}
          <Text style={styles.sectionTitle}>Orders Overview</Text>
          <View style={styles.chartContainer}>
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
                    <Text style={{color: '#333333', fontWeight: 'bold'}}>
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
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {orders.slice(0, 5).map(item => (
            <OrderCard
              key={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              status={item.status}
              color={item.color}
            />
          ))}
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
      ios: wp(6), // Slightly more padding on iOS
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
    overflow: 'hidden', // Prevents overflow beyond border
    borderRadius: wp(2.5),
  },

  card: {
    backgroundColor: '#fff',
    width: '50%', // 2 columns layout
    padding: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1, // Default bottom border
    borderRightWidth: 1, // Right border for left column
    borderColor: '#A9A9A9',
  },

  // Remove the right border for the second card in each row
  cardLastInRow: {
    borderRightWidth: 0,
  },

  // Remove the bottom border for the last two cards
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
    paddingBottom: hp(8), // Ensures space at the bottom
  },
});

export default ServiceProviderDashboard;
