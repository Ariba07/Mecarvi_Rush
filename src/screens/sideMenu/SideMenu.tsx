/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Edit from '../../assets/images/Edit.svg';
import Main from '../../assets/images/Main.svg';
import Subscription from '../../assets/images/Subscription.svg';
import Booking from '../../assets/images/Booking.svg';
import Theme from '../../assets/images/Theme.svg';
import Category from '../../assets/images/Category.svg';
import Logout from '../../assets/images/Logout.svg';
import Points from '../../assets/images/Points.svg';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearUser} from '../../slice/Slice';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

const SideMenu: React.FC = () => {
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme, toggleTheme} = useContext(ThemeContext); // Access theme and toggleTheme

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@login_credentials');
      dispatch(clearUser());
      navigation.replace('Login');
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  const handleMenuPress = (itemName: string) => {
    if (itemName === 'Log Out') {
      handleLogout();
    } else if (itemName === 'Dark Theme' || itemName === 'Light Theme') {
      toggleTheme(); // Toggle the theme
    } else if (itemName === 'Subscription') {
      navigation.navigate('Subscription');
    } else if (itemName === 'Categories') {
      navigation.navigate('Services');
    } else if (itemName === 'Home') {
      navigation.navigate('Drawer');
    } else if (itemName === 'My Bookings') {
      navigation.navigate('Orders');
    }
  };

  // Define menu items, dynamically setting the theme option name
  const menuItems = [
    {id: 1, name: 'Home', icon: <Main />, navigate: 'Drawer'},
    {id: 2, name: 'My Bookings', icon: <Booking />, navigate: 'Booking'},
    {id: 3, name: 'Categories', icon: <Category />, navigate: 'Services'},
    {
      id: 4,
      name: 'Subscription',
      icon: <Subscription />,
      navigate: 'Subscription',
    },
    {
      id: 5,
      name: theme.backgroundColor === '#000000' ? 'Light Theme' : 'Dark Theme', // Adjust based on your theme logic
      icon: <Theme />,
      navigate: 'DarkTheme',
    },
    {id: 6, name: 'Log Out', icon: <Logout />, navigate: 'Logout'},
  ];

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: theme.backgroundColor}]}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={require('../../assets/images/s1.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileTextContainer}>
            <Text style={[styles.profileName, {color: theme.text}]}>
              Chris Adam
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Points />
              <Text style={styles.loyaltyText}>
                {' '}
                Loyalty Points: <Text style={styles.loyaltyPoints}>250</Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editIcon}>
            <Edit />
          </TouchableOpacity>
        </View>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleMenuPress(item.name)}>
            {item.icon}
            <Text style={[styles.menuText, {color: theme.text}]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(3),
      android: wp(3),
    }),
    paddingTop: Platform.select({
      ios: hp(8),
      android: hp(8),
    }),
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  profileImage: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(9),
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: wp(3),
  },
  profileName: {
    fontSize: wp(5),
    fontWeight: 'bold',
  },
  loyaltyText: {
    fontSize: wp(3.5),
    color: '#666',
  },
  loyaltyPoints: {
    color: '#FF0080',
    fontWeight: 'bold',
  },
  editIcon: {
    padding: wp(2),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    gap: wp(4),
    paddingLeft: wp(1.5),
  },
  menuText: {
    fontSize: wp(4),
  },
});

export default SideMenu;
