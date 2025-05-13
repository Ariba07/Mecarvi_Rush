import {View, SafeAreaView, ScrollView} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  DateSlot,
  RootStackParamList,
  TimeSlot,
} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import CustomButton from '../../components/common/buttons/CustomButton';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectDeliveryCity,
  selectDeliveryCountry,
  setDeliveryDate,
  setDeliveryTime,
  selectDeliveryDate,
  selectDeliveryTime,
} from '../../slice/Slice';
import BookingStyles from '../../assets/styles/booking/BookingStyles';
import Tabs from './Tabs';
import {DatePickerSection} from './DatePicker';
import {TimePickerSection} from './TimePicker';
import DeliveryLocation from './DeliveryLocation';

const Booking: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const dispatch = useDispatch();
  const deliveryCity = useSelector(selectDeliveryCity);
  const deliveryCountry = useSelector(selectDeliveryCountry);
  const storedDeliveryDate = useSelector(selectDeliveryDate);
  const storedDeliveryTime = useSelector(selectDeliveryTime);

  const [pickupDate, setLocalPickupDate] = useState<number | null>(null);
  const [deliveryDate, setLocalDeliveryDate] = useState<number | null>(null);
  const [pickupTime, setLocalPickupTime] = useState<string | null>('');
  const [deliveryTime, setLocalDeliveryTime] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'pickup' | 'delivery'>(
    'pickup',
  );
  const [dateSlots, setDateSlots] = useState<DateSlot[]>([]);

  useEffect(() => {
    if (storedDeliveryTime) {
      setLocalDeliveryTime(storedDeliveryTime);
    }
  }, [storedDeliveryTime]);

  useEffect(() => {
    const generateDateSlots = () => {
      const today = new Date();
      const newDateSlots: DateSlot[] = [];

      for (let i = 0; i < 30; i++) {
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + i);

        const dayName = futureDate.toLocaleDateString('en-US', {
          weekday: 'short',
        });
        const date = futureDate.getDate();
        const fullDate = futureDate.toISOString().split('T')[0];

        newDateSlots.push({day: dayName, date, fullDate});
      }

      setDateSlots(newDateSlots);

      if (storedDeliveryDate) {
        const matchingSlot = newDateSlots.find(
          slot => slot.fullDate === storedDeliveryDate,
        );
        if (matchingSlot) {
          setLocalDeliveryDate(matchingSlot.date);
        }
      }
    };

    generateDateSlots();
  }, [storedDeliveryDate]);

  const timeSlots: TimeSlot[] = [
    {time: '1:00 PM'},
    {time: '2:00 PM'},
    {time: '3:00 PM'},
    {time: '4:00 PM'},
    {time: '5:00 PM'},
  ];

  const handleSelectDate = (date: number, isPickup: boolean) => {
    const selectedSlot = dateSlots.find(slot => slot.date === date);
    if (!selectedSlot) {
      return;
    }

    const fullDate = selectedSlot.fullDate;
    if (isPickup) {
      setLocalPickupDate(date);
      dispatch(setDeliveryDate(fullDate));
    } else {
      setLocalDeliveryDate(date);
      dispatch(setDeliveryDate(fullDate));
    }
  };

  const handleSelectTime = (time: string, isPickup: boolean) => {
    if (isPickup) {
      setLocalPickupTime(time);
      dispatch(setDeliveryTime(time));
    } else {
      setLocalDeliveryTime(time);
      dispatch(setDeliveryTime(time));
    }
  };

  return (
    <SafeAreaView
      style={[BookingStyles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={BookingStyles.container}>
        <Header title="Book Schedule" onBackPress={() => navigation.goBack()} />
        <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <ScrollView
          style={{marginBottom: hp(10)}}
          showsVerticalScrollIndicator={false}>
          {selectedTab === 'pickup' && (
            <>
              <DatePickerSection
                dateSlots={dateSlots}
                selectedDate={pickupDate}
                onSelectDate={date => handleSelectDate(date, true)}
                isPickup={true}
              />
              <TimePickerSection
                timeSlots={timeSlots}
                selectedTime={pickupTime}
                onSelectTime={time => handleSelectTime(time, true)}
                isPickup={true}
              />
            </>
          )}
          {selectedTab === 'delivery' && (
            <>
              <DeliveryLocation
                deliveryCity={deliveryCity}
                deliveryCountry={deliveryCountry}
              />
              <DatePickerSection
                dateSlots={dateSlots}
                selectedDate={deliveryDate}
                onSelectDate={date => handleSelectDate(date, false)}
                isPickup={false}
              />
              <TimePickerSection
                timeSlots={timeSlots}
                selectedTime={deliveryTime}
                onSelectTime={time => handleSelectTime(time, false)}
                isPickup={false}
              />
            </>
          )}
        </ScrollView>
        <View style={BookingStyles.payButton}>
          <CustomButton
            title="Proceed to pay"
            onPress={() => navigation.navigate('Checkout')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Booking;
