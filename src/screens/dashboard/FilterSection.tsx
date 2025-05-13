import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Icon from 'react-native-vector-icons/Ionicons';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {styles} from '../../assets/styles/dashboard/DashboardStyles';

interface FilterSectionProps {
  defaultCity: string | null;
  defaultCountry: string | null;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  defaultCity,
  defaultCountry,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = React.useContext(ThemeContext);

  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.locationContainer,
          {backgroundColor: theme.backgroundColor || '#fff'},
        ]}
        onPress={() => navigation.navigate('Address', {forDelivery: false})}>
        <View style={styles.location}>
          <Icon name="location" size={20} color={'#FF00A7'} />
          <Text style={{color: theme.text || '#333'}}>
            {defaultCity && defaultCountry
              ? `${defaultCity}, ${defaultCountry}`
              : 'Select a city'}
          </Text>
          <Icon name="chevron-down" size={15} color={'#5c5c5c'} />
        </View>
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={[
            styles.iconBox,
            {backgroundColor: theme.backgroundColor || '#fff'},
          ]}
          onPress={() => navigation.navigate('Search')}>
          <Icon name="search-outline" size={20} color={'#9c9c9c'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconBox,
            {backgroundColor: theme.backgroundColor || '#fff'},
          ]}
          onPress={() => navigation.navigate('Notification')}>
          <Icon name="notifications-outline" size={20} color={'#9c9c9c'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FilterSection;
