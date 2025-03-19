/* eslint-disable react/no-unstable-nested-components */
import React, {useContext} from 'react';
import {Platform, ViewStyle} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import OrderIndex from '../../../screens/orders/OrderIndex';
import Chats from '../../../screens/chat/Chats';
import Settings from '../../../screens/settings/Settings';
import {
  HomeIcon,
  ChatIcon,
  OrderIcon,
  SettingIcon,
} from '../../tabIcons/TabIcon';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Index from '../../../screens/dashboard/Index';
import {ThemeContext} from '../../helperUtils/theme/ThemeContext';

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
    case 'Settings':
      return <SettingIcon color={color} size={size} />;
    default:
      return null;
  }
};

const BottomTabs: React.FC = () => {
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme

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
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
