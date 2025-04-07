import {
  View,
  SafeAreaView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For location pin and calendar icons
import CustomButton from '../../components/common/buttons/CustomButton';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useSelector} from 'react-redux';
import {selectDeliveryCity, selectDeliveryCountry} from '../../slice/Slice';

// Define interface for date and time slots
interface DateSlot {
  day: string;
  date: number;
}

interface TimeSlot {
  time: string;
}

const Booking: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const [pickupDate, setPickupDate] = useState<number | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<number | null>(null);
  const [pickupTime, setPickupTime] = useState<string | null>('2:00 PM'); // Default selected time
  const [deliveryTime, setDeliveryTime] = useState<string | null>(null);
  const deliveryCity = useSelector(selectDeliveryCity);
  const deliveryCountry = useSelector(selectDeliveryCountry);
  const [selectedTab, setSelectedTab] = useState<'pickup' | 'delivery'>(
    'pickup',
  ); // Track selected tab

  const [dateSlots, setDateSlots] = useState<DateSlot[]>([]);

  useEffect(() => {
    const generateDateSlots = () => {
      const today = new Date();
      const newDateSlots: DateSlot[] = [];

      for (let i = 0; i < 30; i++) {
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + i);

        const dayName = futureDate.toLocaleDateString('en-US', {
          weekday: 'short',
        }); // e.g., "Sun"
        const date = futureDate.getDate(); // e.g., 7

        newDateSlots.push({day: dayName, date});
      }

      setDateSlots(newDateSlots);
    };

    generateDateSlots();
  }, []);

  // Time slots data
  const timeSlots: TimeSlot[] = [
    {time: '1:00 PM'},
    {time: '2:00 PM'}, // Default selected (handled by pickupTime state)
    {time: '3:00 PM'},
    {time: '4:00 PM'},
    {time: '5:00 PM'},
  ];

  // Handle date selection
  const handleSelectDate = (date: number, isPickup: boolean) => {
    if (isPickup) {
      setPickupDate(date);
    } else {
      setDeliveryDate(date);
    }
  };

  // Handle time slot selection
  const handleSelectTime = (time: string, isPickup: boolean) => {
    if (isPickup) {
      setPickupTime(time);
    } else {
      setDeliveryTime(time);
    }
  };

  // Render date slot item
  const renderDateSlot = ({item}: {item: DateSlot}) => (
    <TouchableOpacity
      style={[
        styles.dateSlot,
        selectedTab === 'pickup'
          ? pickupDate === item.date
            ? styles.selectedDateSlot
            : {backgroundColor: theme.backgroundColor}
          : deliveryDate === item.date
          ? styles.selectedDateSlot
          : {backgroundColor: theme.backgroundColor},
      ]}
      onPress={() => handleSelectDate(item.date, selectedTab === 'pickup')}>
      <Text style={[styles.dateText, {color: theme.text}]}>{item.date}</Text>
      <Text style={styles.dayText}>{item.day}</Text>
    </TouchableOpacity>
  );

  // Render time slot item
  const renderTimeSlot = ({item}: {item: TimeSlot}, isPickupTime: boolean) => (
    <TouchableOpacity
      style={[
        styles.timeSlot,
        isPickupTime
          ? pickupTime === item.time
            ? styles.selectedTimeSlot
            : {backgroundColor: theme.backgroundColor}
          : deliveryTime === item.time
          ? styles.selectedTimeSlot
          : {backgroundColor: theme.backgroundColor},
      ]}
      onPress={() => handleSelectTime(item.time, isPickupTime)}>
      <Text
        style={[
          styles.timeText,
          isPickupTime
            ? pickupTime === item.time
              ? styles.selectedTimeText
              : {color: theme.text}
            : deliveryTime === item.time
            ? styles.selectedTimeText
            : {color: theme.text},
        ]}>
        {item.time}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header title="Book Schedule" onBackPress={() => navigation.goBack()} />
        {/* Tab container to hold the "pickup" and "delivery" tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            onPress={() => setSelectedTab('pickup')}
            style={[
              styles.tab,
              selectedTab === 'pickup' && styles.selectedTabStyle,
            ]}>
            <Text
              style={[
                styles.title,
                selectedTab === 'pickup'
                  ? styles.selectedTabText
                  : {color: theme.text},
              ]}>
              Pickup
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedTab('delivery')}
            style={[
              styles.tab,
              selectedTab === 'delivery' && styles.selectedTabStyle,
            ]}>
            <Text
              style={[
                styles.title,
                selectedTab === 'delivery'
                  ? styles.selectedTabText
                  : {color: theme.text},
              ]}>
              Delivery
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{marginBottom: hp(10)}}
          showsVerticalScrollIndicator={false}>
          {selectedTab === 'pickup' && (
            <>
              {/* Pickup Location */}
              <View style={styles.section}>
                {/* <Text
                  style={[
                    styles.sectionTitle,
                    {color: theme.text, alignSelf: 'center'},
                  ]}>
                  Pickup
                </Text> */}
                {/* Uncomment if you need to select a pickup location */}
                {/* <TouchableOpacity
                  style={[
                    styles.locationContainer,
                    styles.timeList,
                    { backgroundColor: theme.backgroundColor },
                  ]}
                  onPress={() =>
                    navigation.navigate('Address', { forDelivery: false })
                  }>
                  <Icon name="location-pin" size={20} color="#ff69b4" />
                  <Text style={[styles.locationText, { color: theme.input }]}>
                    {defaultCity !== null && defaultCountry !== null
                      ? `${defaultCity}, ${defaultCountry}`
                      : 'Select a city'}
                  </Text>
                  <Icon name="arrow-drop-down" size={20} color={theme.input} />
                </TouchableOpacity> */}
              </View>
              {/* Pickup Date */}
              <View style={styles.section}>
                <View style={styles.row}>
                  <Text style={[styles.sectionTitle, {color: theme.text}]}>
                    Pickup Date
                  </Text>
                  <Icon name="calendar-today" size={20} color="#666" />
                </View>
                <FlatList
                  data={dateSlots}
                  renderItem={renderDateSlot}
                  keyExtractor={item => item.date.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.dateList}
                />
              </View>
              {/* Pickup Time Slot */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, {color: theme.text}]}>
                  Pickup Time Slot
                </Text>
                <FlatList
                  data={timeSlots}
                  renderItem={({item}) => renderTimeSlot({item}, true)}
                  keyExtractor={item => item.time}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.timeList}
                />
              </View>
            </>
          )}

          {selectedTab === 'delivery' && (
            <>
              {/* Delivery Location */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, {color: theme.text}]}>
                  Delivery Location
                </Text>
                <TouchableOpacity
                  style={[
                    styles.locationContainer,
                    styles.timeList,
                    {backgroundColor: theme.backgroundColor},
                  ]}
                  onPress={() =>
                    navigation.navigate('Address', {forDelivery: true})
                  }>
                  <Icon name="location-pin" size={20} color="#ff69b4" />
                  <Text style={[styles.locationText, {color: theme.input}]}>
                    {deliveryCity !== null && deliveryCountry !== null
                      ? `${deliveryCity}, ${deliveryCountry}`
                      : 'Select a city'}
                  </Text>
                  <Icon name="arrow-drop-down" size={20} color={theme.input} />
                </TouchableOpacity>
              </View>
              {/* Delivery Date */}
              <View style={styles.section}>
                <View style={styles.row}>
                  <Text style={[styles.sectionTitle, {color: theme.text}]}>
                    Delivery Date
                  </Text>
                  <Icon name="calendar-today" size={20} color="#666" />
                </View>
                <FlatList
                  data={dateSlots}
                  renderItem={renderDateSlot}
                  keyExtractor={item => item.date.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.dateList}
                />
              </View>
              {/* Delivery Time Slot */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, {color: theme.text}]}>
                  Delivery Time Slot
                </Text>
                <FlatList
                  data={timeSlots}
                  renderItem={({item}) => renderTimeSlot({item}, false)}
                  keyExtractor={item => item.time}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.timeList}
                />
              </View>
            </>
          )}
        </ScrollView>

        {/* Proceed to Pay Button */}
        <View style={styles.payButton}>
          <CustomButton
            title="Proceed to pay"
            onPress={() => {
              navigation.navigate('Checkout');
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8', // Light background as per image
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
  },
  section: {
    marginTop: hp(2),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: wp(4.5),
    color: '#333',
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: 8,
  },
  locationText: {
    fontSize: wp(4),
    color: '#000',
    flex: 1,
    marginLeft: wp(2),
  },
  dateList: {
    marginTop: hp(2),
  },
  dateSlot: {
    width: wp(15),
    height: hp(8),
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2),
  },
  selectedDateSlot: {
    backgroundColor: '#03A7A71A', // Teal background for selected date
  },
  dateText: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#333',
  },
  dayText: {
    fontSize: wp(3.5),
    color: '#666',
  },
  timeList: {
    marginTop: hp(2),
  },
  timeSlot: {
    width: wp(20),
    height: hp(6),
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2),
  },
  selectedTimeSlot: {
    backgroundColor: '#03A7A71A', // Teal background for selected time
  },
  timeText: {
    fontSize: wp(4),
    color: '#333',
  },
  selectedTimeText: {
    color: '#03A7A7', // Teal text for selected time
  },
  payButton: {
    position: 'absolute',
    bottom: Platform.select({ios: hp(4), android: hp(4)}),
    left: Platform.select({ios: wp(6), android: wp(5)}),
    right: Platform.select({ios: wp(6), android: wp(5)}),
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTabStyle: {
    borderBottomColor: '#03A7A7',
    borderBottomWidth: 2,
  },
  selectedTabText: {
    color: '#03A7A7', // Color for the selected tab
  },
  title: {fontSize: wp('5%'), fontWeight: 'bold'},
});

export default Booking;
