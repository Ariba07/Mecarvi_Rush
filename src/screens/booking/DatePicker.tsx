import React from 'react';
import {FlatList, TouchableOpacity, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BookingStyles from '../../assets/styles/booking/BookingStyles';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {DateSlot} from '../../components/types/screenTypes/ScreenTypes';

interface DatePickerProps {
  dateSlots: DateSlot[];
  selectedDate: number | null;
  onSelectDate: (date: number) => void;
  isPickup: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  dateSlots,
  selectedDate,
  onSelectDate,
}) => {
  const {theme} = React.useContext(ThemeContext);

  const renderDateSlot = ({item}: {item: DateSlot}) => (
    <TouchableOpacity
      style={[
        BookingStyles.dateSlot,
        selectedDate === item.date
          ? BookingStyles.selectedDateSlot
          : {backgroundColor: theme.backgroundColor},
      ]}
      onPress={() => onSelectDate(item.date)}>
      <Text style={[BookingStyles.dateText, {color: theme.text}]}>
        {item.date}
      </Text>
      <Text style={BookingStyles.dayText}>{item.day}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={dateSlots}
      renderItem={renderDateSlot}
      keyExtractor={item => item.date.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={BookingStyles.dateList}
    />
  );
};

export const DatePickerSection: React.FC<DatePickerProps> = props => {
  const {theme} = React.useContext(ThemeContext);
  return (
    <View style={BookingStyles.section}>
      <View style={BookingStyles.row}>
        <Text style={[BookingStyles.sectionTitle, {color: theme.text}]}>
          {props.isPickup ? 'Pickup Date' : 'Delivery Date'}
        </Text>
        <Icon name="calendar-today" size={20} color="#666" />
      </View>
      <DatePicker {...props} />
    </View>
  );
};

export default DatePicker;
