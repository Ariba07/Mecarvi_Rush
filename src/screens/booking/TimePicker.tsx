import React from 'react';
import {FlatList, TouchableOpacity, Text, View} from 'react-native';
import BookingStyles from '../../assets/styles/booking/BookingStyles';
import {ThemeContext} from '../../context/ThemeContext';
import {TimeSlot} from '../../types/navigation';

interface TimePickerProps {
  timeSlots: TimeSlot[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  isPickup: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  timeSlots,
  selectedTime,
  onSelectTime,
}) => {
  const {theme} = React.useContext(ThemeContext);

  const renderTimeSlot = ({item}: {item: TimeSlot}) => (
    <TouchableOpacity
      style={[
        BookingStyles.timeSlot,
        selectedTime === item.time
          ? BookingStyles.selectedTimeSlot
          : {backgroundColor: theme.backgroundColor},
      ]}
      onPress={() => onSelectTime(item.time)}>
      <Text
        style={[
          BookingStyles.timeText,
          selectedTime === item.time
            ? BookingStyles.selectedTimeText
            : {color: theme.text},
        ]}>
        {item.time}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={timeSlots}
      renderItem={renderTimeSlot}
      keyExtractor={item => item.time}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={BookingStyles.timeList}
    />
  );
};

export const TimePickerSection: React.FC<TimePickerProps> = props => {
  const {theme} = React.useContext(ThemeContext);
  return (
    <View style={BookingStyles.section}>
      <Text style={[BookingStyles.sectionTitle, {color: theme.text}]}>
        {props.isPickup ? 'Pickup Time Slot' : 'Delivery Time Slot'}
      </Text>
      <TimePicker {...props} />
    </View>
  );
};

export default TimePicker;
