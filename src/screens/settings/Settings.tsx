import React from 'react';
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
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
import Profile from '../../assets/images/Profile.svg';
import Stars from '../../assets/images/Stars.svg';
import List from '../../assets/images/List.svg';
import Money from '../../assets/images/Money.svg';
import Truck from '../../assets/images/Truck.svg';
import Log from '../../assets/images/Log.svg';
import Service from '../../assets/images/Service.svg';
import Dollar from '../../assets/images/Dollar.svg';
import Products from '../../assets/images/Products.svg';
import Notify from '../../assets/images/Notify.svg';
import {Icon} from 'react-native-elements';
import {selectRole} from '../../slice/Slice';
import {useSelector} from 'react-redux';

const menuItems = [
  {
    id: '1',
    title: 'My Profile',
    icon: <Profile width={wp(5)} height={wp(5)} />,
    bgColor: '#F4C542',
    route: 'Profile',
  },
  {
    id: '2',
    title: 'Loyalty Points',
    icon: <Stars width={wp(5)} height={wp(5)} />,
    bgColor: '#FF4081',
    route: 'Points',
  },
  {
    id: '3',
    title: 'My Orders',
    icon: <List width={wp(5)} height={wp(5)} />,
    bgColor: '#26C6DA',
    route: 'Orders',
  },
  {
    id: '4',
    title: 'Subscription',
    icon: <Money width={wp(5)} height={wp(5)} />,
    bgColor: '#FFA726',
    route: 'Subscription',
  },
  {
    id: '5',
    title: 'Shipping Address',
    icon: <Truck width={wp(5)} height={wp(5)} />,
    bgColor: '#66BB6A',
    route: 'Address',
  },
  {
    id: '6',
    title: 'Customer Support',
    icon: <Service width={wp(5)} height={wp(5)} />,
    bgColor: '#42A5F5',
    route: 'Support',
  },
  {
    id: '7',
    title: 'Log Out',
    icon: <Log width={wp(5)} height={wp(5)} />,
    bgColor: '#5C6BC0',
    route: 'Login',
  },
];

const menuItem = [
  {
    id: '1',
    title: 'My Profile',
    icon: <Profile width={wp(5)} height={wp(5)} />,
    bgColor: '#F4C542',
    route: 'ServiceProviderProfile',
  },
  {
    id: '2',
    title: 'My Products',
    icon: <Products width={wp(5)} height={wp(5)} />,
    bgColor: '#FF4081',
    route: 'Services',
  },
  {
    id: '3',
    title: 'My Orders',
    icon: <List width={wp(5)} height={wp(5)} />,
    bgColor: '#26C6DA',
    route: 'Orders',
  },
  {
    id: '4',
    title: 'Wallet',
    icon: <Money width={wp(5)} height={wp(5)} />,
    bgColor: '#FFA726',
    route: 'Wallet',
  },
  {
    id: '5',
    title: 'Notification',
    icon: <Notify width={wp(5)} height={wp(5)} />,
    bgColor: '#66BB6A',
    route: 'Notification',
  },
  {
    id: '6',
    title: 'Subscription',
    icon: <Dollar width={wp(5)} height={wp(5)} />,
    bgColor: '#42A5F5',
    route: 'Subscription',
  },
  {
    id: '7',
    title: 'Log Out',
    icon: <Log width={wp(5)} height={wp(5)} />,
    bgColor: '#5C6BC0',
    route: 'Login',
  },
];

const Settings = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const role = useSelector(selectRole);

  const renderItem = ({item}: {item: (typeof menuItems)[0]}) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => navigation.navigate(item.route as any)}>
      <View style={[styles.iconContainer, {backgroundColor: item.bgColor}]}>
        {item.icon}
      </View>
      <Text style={styles.menuText}>{item.title}</Text>
      <Icon
        name="chevron-forward"
        color={'#333333'}
        size={wp(4)}
        type="ionicon"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Settings" onBackPress={() => navigation.goBack()} />
        <FlatList
          data={role === 'admin' ? menuItems : menuItem}
          keyExtractor={item => item.id}
          renderItem={renderItem}
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
      ios: hp(5),
      android: hp(8),
    }),
  },
  listContainer: {
    marginTop: hp(2),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: 10,
    marginBottom: hp(2.5),
  },
  iconContainer: {
    width: wp(12),
    height: wp(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4),
    borderRadius: wp(10),
  },
  menuText: {
    flex: 1,
    fontSize: wp(4.5),
    fontWeight: '500',
    color: '#333',
  },
  arrow: {
    fontSize: wp(5),
    color: '#999',
  },
});

export default Settings;
