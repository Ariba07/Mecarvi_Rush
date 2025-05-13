import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {setAddressType} from '../../slice/Slice';
import BookingStyles from '../../assets/styles/booking/BookingStyles';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

interface TabsProps {
  selectedTab: 'pickup' | 'delivery';
  setSelectedTab: (tab: 'pickup' | 'delivery') => void;
}

const Tabs: React.FC<TabsProps> = ({selectedTab, setSelectedTab}) => {
  const {theme} = React.useContext(ThemeContext);
  const dispatch = useDispatch();

  return (
    <View style={BookingStyles.tabsContainer}>
      <TouchableOpacity
        onPress={() => {
          setSelectedTab('pickup');
          dispatch(setAddressType('pickup'));
        }}
        style={[
          BookingStyles.tab,
          selectedTab === 'pickup' && BookingStyles.selectedTabStyle,
        ]}>
        <Text
          style={[
            BookingStyles.title,
            selectedTab === 'pickup'
              ? BookingStyles.selectedTabText
              : {color: theme.text},
          ]}>
          Pickup
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setSelectedTab('delivery');
          dispatch(setAddressType('delivery'));
        }}
        style={[
          BookingStyles.tab,
          selectedTab === 'delivery' && BookingStyles.selectedTabStyle,
        ]}>
        <Text
          style={[
            BookingStyles.title,
            selectedTab === 'delivery'
              ? BookingStyles.selectedTabText
              : {color: theme.text},
          ]}>
          Delivery
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Tabs;
