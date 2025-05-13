import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import BookingStyles from '../../assets/styles/booking/BookingStyles';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

interface DeliveryLocationProps {
  deliveryCity: string | null;
  deliveryCountry: string | null;
}

const DeliveryLocation: React.FC<DeliveryLocationProps> = ({
  deliveryCity,
  deliveryCountry,
}) => {
  const {theme} = React.useContext(ThemeContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={BookingStyles.section}>
      <Text style={[BookingStyles.sectionTitle, {color: theme.text}]}>
        Delivery Location
      </Text>
      <TouchableOpacity
        style={[
          BookingStyles.locationContainer,
          BookingStyles.timeList,
          {backgroundColor: theme.backgroundColor},
        ]}
        onPress={() => navigation.navigate('Address', {forDelivery: true})}>
        <Icon name="location-pin" size={20} color="#ff69b4" />
        <Text style={[BookingStyles.locationText, {color: theme.input}]}>
          {deliveryCity && deliveryCountry
            ? `${deliveryCity}, ${deliveryCountry}`
            : 'Select a city'}
        </Text>
        <Icon name="arrow-drop-down" size={20} color={theme.input} />
      </TouchableOpacity>
    </View>
  );
};

export default DeliveryLocation;
