import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import Header from '../../components/common/header/Header';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {orders} from '../../components/helperUtils/orderTypes/Types';
import OrderCard from '../../components/common/orderCard/OrderCard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const tabs = [
  {label: 'All Orders', filter: 'All'},
  {label: 'Active', filter: 'Processing'},
  {label: 'Pending', filter: 'Pending'},
  {label: 'Declined', filter: 'Decline'},
  {label: 'Completed', filter: 'Completed'},
  {label: 'Cancelled', filter: 'Cancelled'},
  {label: 'Disputes', filter: 'Dispute'},
];

const ServiceProviderOrders = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedTab, setSelectedTab] = useState('All');

  // Filter orders based on selected tab
  const filteredOrders =
    selectedTab === 'All'
      ? orders
      : orders.filter(order => order.status === selectedTab);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <Header
          title="Orders Management"
          onBackPress={() => navigation.goBack()}
        />

        {/* Tabs using Horizontal FlatList */}
        <View>
          <FlatList
            data={tabs}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.filter}
            contentContainerStyle={styles.tabContainer}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => setSelectedTab(item.filter)}
                style={styles.tabButton}>
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === item.filter && styles.activeTab,
                  ]}>
                  {item.label}
                </Text>
                {selectedTab === item.filter && (
                  <View style={styles.activeUnderline} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Orders List */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredOrders}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <OrderCard
              key={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              status={item.status}
              color={item.color}
            />
          )}
        />
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
      ios: hp(7),
      android: hp(10),
    }),
  },
  tabContainer: {
    paddingBottom: hp(2),
  },
  tabButton: {
    alignItems: 'center',
    marginHorizontal: wp(2.5),
  },
  tabText: {
    fontSize: wp(4),
    fontWeight: '500',
    color: '#444',
    paddingVertical: hp(0.5),
  },
  activeTab: {
    color: '#FF0080',
    fontWeight: 'bold',
  },
  activeUnderline: {
    height: hp(0.4),
    backgroundColor: '#FF0080',
    width: '100%',
    borderRadius: wp(3),
  },
});

export default ServiceProviderOrders;
