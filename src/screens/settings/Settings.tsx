import React, {useContext} from 'react';
import {
  Text,
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
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import Profile from '../../assets/images/Profile.svg';
import Stars from '../../assets/images/Stars.svg';
import List from '../../assets/images/List.svg';
import Money from '../../assets/images/Money.svg';
import Truck from '../../assets/images/Truck.svg';
import Log from '../../assets/images/Log.svg';
import Service from '../../assets/images/Service.svg';
import Dispute from '../../assets/images/Dispute.svg';
import {Icon} from 'react-native-elements';
import {clearUser} from '../../store/authSlice';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeContext} from '../../context/ThemeContext';
import Theme from '../../assets/images/Theme.svg';
import {clearFCMToken} from '@/services/notifications';

const Settings = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const {theme, toggleTheme} = useContext(ThemeContext);

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
      title: 'Disputes',
      icon: <Dispute width={wp(5)} height={wp(5)} />,
      bgColor: '#DD0004',
      route: 'Disputes',
    },
    {
      id: '7',
      title: 'Customer Support',
      icon: <Service width={wp(5)} height={wp(5)} />,
      bgColor: '#42A5F5',
      route: 'Support',
    },
    {
      id: '8',
      title: theme.backgroundColor === '#0D0D0D' ? 'Light Theme' : 'Dark Theme',
      icon: <Theme width={wp(5)} height={wp(5)} />,
      bgColor: '#5C6B96',
      // No route here, we'll handle it separately
    },
    {
      id: '9',
      title: 'Log Out',
      icon: <Log width={wp(5)} height={wp(5)} />,
      bgColor: '#5C6BC0',
      route: 'Login',
    },
  ];

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@login_credentials');
      dispatch(clearUser());
      navigation.replace('Login');
      clearFCMToken();
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  const renderItem = ({item}: {item: (typeof menuItems)[0]}) => (
    <TouchableOpacity
      style={[styles.menuItem, {backgroundColor: theme.whole}]}
      onPress={() => {
        if (item.title === 'Log Out') {
          handleLogout();
        } else if (
          item.title === 'Dark Theme' ||
          item.title === 'Light Theme'
        ) {
          toggleTheme(); // Just toggle the theme, no navigation
        } else if (item.route) {
          navigation.navigate(item.route as any);
        }
      }}>
      <View style={[styles.iconContainer, {backgroundColor: item.bgColor}]}>
        {item.icon}
      </View>
      <Text style={[styles.menuText, {color: theme.text}]}>{item.title}</Text>
      <Icon
        name="chevron-forward"
        color={'#333333'}
        size={wp(4)}
        type="ionicon"
      />
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        data={menuItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
    padding: wp(2),
    borderRadius: 10,
    marginBottom: hp(2.5),
    gap: wp(3),
  },
  iconContainer: {
    width: wp(8),
    height: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(10),
  },
  menuText: {
    flex: 1,
    fontSize: wp(4),
    fontWeight: '500',
    color: '#333',
  },
  arrow: {
    fontSize: wp(5),
    color: '#999',
  },
});

export default Settings;
