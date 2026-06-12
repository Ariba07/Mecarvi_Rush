/* eslint-disable react/no-unstable-nested-components */
import React, {useContext} from 'react';
import {Platform, ViewStyle} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import OrderIndex from '../../../screens/orders/OrderIndex';
import Chats from '../../../screens/chat/Chats';
import {HomeIcon, ChatIcon, OrderIcon, CartIcon} from '../../tabIcons/TabIcon';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Index from '../../../screens/dashboard/Index';
import {ThemeContext} from '../../../context/ThemeContext';
import Cart from '../../../screens/cart/Cart';
import {useSelector} from 'react-redux';
import {selectCart} from '../../../store/authSlice';

const Tab = createBottomTabNavigator();

type TabBarIconProps = {
  routeName: string;
  focused: boolean;
  color: string;
  size: number;
};

const TabBarIcon: React.FC<TabBarIconProps> = ({routeName, color, size}) => {
  switch (routeName) {
    case 'Dashboard':
      return <HomeIcon color={color} size={size} />;
    case 'Orders':
      return <OrderIcon color={color} size={size} />;
    case 'Chats':
      return <ChatIcon color={color} size={size} />;
    case 'Cart':
      return <CartIcon color={color} size={size} />;
    default:
      return null;
  }
};

const BottomTabs: React.FC = () => {
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme
  // Get cart items directly from Redux store
  const cartItems = useSelector(selectCart);

  // Number of unique items in the cart
  const cartLength = cartItems.length;

  const tabBarStyle: ViewStyle = {
    backgroundColor: theme.bottom,
    position: 'absolute',
    height: hp(7),
    paddingTop: hp(1),
    borderRadius: Platform.OS === 'ios' ? 20 : 10,
    marginHorizontal: wp(5),
    marginBottom: Platform.OS === 'ios' ? hp(3) : hp(2),
    alignSelf: 'center',
    justifyContent: 'center',
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => (
          <TabBarIcon
            routeName={route.name}
            focused={focused}
            color={color}
            size={size}
          />
        ),
        tabBarStyle,
        tabBarActiveTintColor: '#03A7A7',
        tabBarInactiveTintColor: '#CAC6C6',
        tabBarLabel: () => null, // Hide labels
        headerShown: false,
      })}>
      <Tab.Screen name="Dashboard" component={Index} />
      <Tab.Screen name="Orders" component={OrderIndex} />
      <Tab.Screen name="Chats" component={Chats} />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarBadge: cartLength > 0 ? cartLength : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#FF0000',
            color: '#FFFFFF',
            fontSize: 13,
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
