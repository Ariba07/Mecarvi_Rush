import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/common/header/Header';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {renderStars} from '../../components/common/review/RenderStars';

const tabs = ['All', 'Progress', 'Delivered'];
const orders = [
  {
    id: '1',
    title: 'Sidewalk Sign Board',
    company: 'Creative Ink Solutions',
    location: 'New York, USA',
    date: '03 Jun 2023',
    price: '$245.00',
    image: require('../../assets/images/Orders.png'), // Replace with actual image path
    status: 'Progress',
  },
  {
    id: '2',
    title: 'Service Name',
    review: '2',
    date: '11 Mar 2025',
    price: '$245.00',
    image: require('../../assets/images/Orders.png'),
    status: 'Delivered',
  },
  {
    id: '3',
    title: 'Service Name',
    review: '1.5',
    date: '11 Mar 2025',
    price: '$245.00',
    status: 'Delivered',
    image: require('../../assets/images/Orders.png'), // Replace with actual image path
  },
  {
    id: '4',
    title: 'Service Name',
    review: '4.0',
    date: '11 Mar 2025',
    price: '$245.00',
    status: 'Delivered',
    image: require('../../assets/images/Orders.png'), // Replace with actual image path
  },
  {
    id: '5',
    title: 'Service Name',
    review: '5.0',
    date: '11 Mar 2025',
    price: '$245.00',
    status: 'Delivered',
    image: require('../../assets/images/Orders.png'), // Replace with actual image path
  },
];

const Orders = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedTab, setSelectedTab] = useState('All');

  const filteredOrders =
    selectedTab === 'All'
      ? orders
      : orders.filter(order => order.status === selectedTab);

  const renderProgressItem = ({item}: {item: any}) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.company}>{item.company}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.date}>{item.date}</Text>
        <View style={styles.alignment}>
          <TouchableOpacity
            style={styles.trackButton}
            onPress={() => navigation.navigate('Tracking')}>
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      </View>
    </View>
  );
  const renderDelieverdItem = ({item}: {item: any}) => (
    <View style={styles.deliverCard}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.alignment}>
          <Text style={styles.company}>Your Review</Text>
          <View style={styles.starContainer}>
            {renderStars(Number(item.review))}
            <Text style={styles.review}>{item.review}</Text>
          </View>
        </View>
        <View style={styles.alignment}>
          <Text style={styles.company}>Date</Text>
          <Text style={styles.company}>{item.date}</Text>
        </View>
        <View style={styles.alignment}>
          <Text style={styles.company}>Total Price</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
        <TouchableOpacity
          style={styles.ratingButton}
          onPress={() => navigation.navigate('Review')}>
          <Text style={styles.ratingButtonText}>Rating</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Orders" onBackPress={() => navigation.goBack()} />
        <View style={styles.tabContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}>
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item.id}
          renderItem={({item}) =>
            item.status === 'Delivered'
              ? renderDelieverdItem({item})
              : renderProgressItem({item})
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
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
      ios: hp(4),
      android: hp(8),
    }),
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp(2.5),
    backgroundColor: '#ffffff',
    borderRadius: wp(1.5),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: wp(2.5),
    borderRadius: wp(1.5),
  },
  activeTab: {
    backgroundColor: '#00A19D',
  },
  tabText: {
    fontSize: wp(4),
    color: '#6c757d',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: hp(2),
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: wp(3),
    padding: wp(2.5),
    marginBottom: hp(1.5),
    alignItems: 'center',
  },
  deliverCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: wp(3),
    padding: wp(2.5),
    marginBottom: hp(1.5),
    alignItems: 'center',
  },
  alignment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: wp(18),
    height: wp(25),
    borderRadius: wp(2),
  },
  detailsContainer: {
    flex: 1,
    marginLeft: wp(3),
  },
  title: {
    fontSize: wp(4),
    fontWeight: '500',
    lineHeight: wp(5),
  },
  company: {
    fontSize: wp(3.3),
    color: '#5c5c5c',
    lineHeight: wp(5),
  },
  review: {
    fontSize: wp(3.5),
    color: '#5c5c5c',
    lineHeight: wp(5),
    fontWeight: 'bold',
    marginLeft: wp(1),
  },
  location: {
    fontSize: wp(3),
    color: '#6c757d',
    lineHeight: wp(3),
  },
  date: {
    fontSize: wp(2.5),
    color: '#00A19D',
    lineHeight: wp(6),
  },
  trackButton: {
    borderWidth: 1,
    borderColor: '#00A19D',
    borderRadius: wp(1.5),
    paddingVertical: hp(0.5),
    width: wp(25),
    alignItems: 'center',
  },
  trackButtonText: {
    color: '#FF0080',
    fontSize: wp(3.5),
    fontWeight: 'bold',
  },
  ratingButton: {
    backgroundColor: '#00A19D',
    borderRadius: wp(1.5),
    paddingVertical: hp(0.5),
    width: wp(25),
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginVertical: hp(0.5),
  },
  ratingButtonText: {
    color: '#ffffff',
    fontSize: wp(3.5),
    fontWeight: 'bold',
  },
  price: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#FF0080',
    alignSelf: 'flex-end',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp(2), // Add slight spacing from text
  },
});

export default Orders;
