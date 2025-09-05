/* eslint-disable react-native/no-inline-styles */
import {
  View,
  SafeAreaView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../../components/common/buttons/CustomButton';
import getFormattedDateTime from '../../components/helperUtils/dateTimeUtils/DateTime';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useSelector, useDispatch} from 'react-redux';
import {
  selectDefaultCity,
  selectDefaultCountry,
  setAddressType,
  setDeliveryDate,
  setDeliveryTime,
} from '../../slice/Slice';

// Define interface for the formatted date and time
interface FormattedDateTime {
  date: string;
  time: string;
}

const Schedule: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const defaultCity = useSelector(selectDefaultCity);
  const defaultCountry = useSelector(selectDefaultCountry);
  const [isAsap, setIsAsap] = useState<boolean>(true);
  const dispatch = useDispatch();

  // Get the formatted date and time
  const {currentDate, currentTime} = getFormattedDateTime();

  // Function to get current date and time in required formats
  const getCurrentDateTime = (): FormattedDateTime => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return {
      date: `${year}-${month}-${day}`, // e.g., "2025-07-19"
      time: `${hours}:${minutes}`, // e.g., "13:15"
    };
  };

  // Get the formatted date and time
  const {date, time} = getCurrentDateTime();

  // Function to handle ASAP selection and dispatch Redux actions
  const handleAsapSelection = () => {
    setIsAsap(true);
    dispatch(setAddressType('delivery')); // Dispatch sourceType as 'delivery'
    dispatch(setDeliveryDate(date)); // Dispatch current date (YYYY-MM-DD)
    dispatch(setDeliveryTime(time)); // Dispatch current time (H:i)
  };

  // Function to handle Schedule selection
  const handleScheduleSelection = () => {
    setIsAsap(false);
    // Optionally dispatch different values or reset if needed
  };

  // Check if navigation is allowed
  // For ASAP: requires valid address (defaultCity and defaultCountry not null)
  // For Schedule: always allowed
  const isNavigationAllowed =
    !isAsap || (defaultCity !== null && defaultCountry !== null);

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header title="Schedule" onBackPress={() => navigation.goBack()} />

        {/* Location Section with Custom Dropdown (only for ASAP) */}
        {isAsap && (
          <TouchableOpacity
            style={[
              styles.locationContainer,
              {backgroundColor: theme.backgroundColor},
            ]}
            onPress={() => navigation.navigate('Address', {forDelivery: true})}>
            <Icon name="location-pin" size={20} color="#FF00A7" />
            <View style={styles.selectedCityContainer}>
              <Text style={[styles.locationText, {color: theme.input}]}>
                {defaultCity !== null && defaultCountry !== null
                  ? `${defaultCity}, ${defaultCountry}`
                  : 'Select a city'}
              </Text>
            </View>
            <Icon name="arrow-drop-down" size={20} color={theme.input} />
          </TouchableOpacity>
        )}

        {/* ASAP or Schedule Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleOption,
              isAsap ? styles.selectedOption : {},
              {backgroundColor: theme.backgroundColor},
            ]}
            onPress={handleAsapSelection}>
            <View
              style={[
                styles.radioCircle,
                {borderColor: isAsap ? '#FF00A7' : '#333333', borderWidth: 1},
              ]}>
              {isAsap && <View style={styles.selectedRadio} />}
            </View>
            <Text style={[styles.toggleText, {color: theme.input}]}>
              As Soon as Possible
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleOption,
              !isAsap ? styles.selectedOption : {},
              {backgroundColor: theme.backgroundColor},
            ]}
            onPress={handleScheduleSelection}>
            <View
              style={[
                styles.radioCircle,
                {borderColor: !isAsap ? '#FF00A7' : '#333333', borderWidth: 1},
              ]}>
              {!isAsap && <View style={styles.selectedRadio} />}
            </View>
            <Text style={[styles.toggleText, {color: theme.input}]}>
              Schedule an Order
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date and Time Display */}
        <View style={styles.dateTimeContainer}>
          <Text style={[styles.requestText, {color: theme.input}]}>
            Request Service On
          </Text>
          <Text style={[styles.dateText, {color: theme.input}]}>
            {currentDate}
          </Text>
          <Text style={[styles.timeText, {color: theme.input}]}>
            {currentTime}
          </Text>
        </View>

        {/* Error Message for Missing Address (only for ASAP) */}
        {isAsap && !isNavigationAllowed && (
          <Text style={[styles.errorText, {color: theme.input || '#ff0000'}]}>
            Please select a valid address to proceed.
          </Text>
        )}

        {/* Proceed to Pay Button */}
        <View style={styles.payButton}>
          <CustomButton
            title="Proceed to Pay"
            onPress={() => {
              if (isNavigationAllowed) {
                navigation.navigate(isAsap ? 'Checkout' : 'Booking');
              } else {
                console.warn(
                  'Please select a valid address to proceed with ASAP delivery.',
                );
              }
            }}
            disabled={!isNavigationAllowed}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: 8,
    marginTop: hp(2),
    justifyContent: 'space-between',
  },
  selectedCityContainer: {
    flex: 1,
    marginLeft: wp(2),
  },
  locationText: {
    fontSize: wp(4),
    color: '#000',
  },
  toggleContainer: {
    marginTop: hp(5),
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: 8,
    marginBottom: hp(1),
  },
  selectedOption: {
    borderWidth: 1,
    borderColor: '#FF00A7',
  },
  radioCircle: {
    height: wp(5),
    width: wp(5),
    borderRadius: wp(2.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    height: wp(3),
    width: wp(3),
    borderRadius: wp(1.5),
    backgroundColor: '#FF00A7',
  },
  toggleText: {
    marginLeft: wp(2),
    fontSize: wp(4),
    color: '#000',
  },
  dateTimeContainer: {
    marginTop: hp(6),
    alignItems: 'center',
  },
  requestText: {
    fontSize: wp(4),
    color: '#000',
  },
  dateText: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#000',
    marginTop: hp(1),
  },
  timeText: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#000',
  },
  payButton: {
    position: 'absolute',
    bottom: Platform.select({ios: hp(4), android: hp(8)}),
    left: Platform.select({ios: wp(6), android: wp(5)}),
    right: Platform.select({ios: wp(6), android: wp(5)}),
  },
  errorText: {
    fontSize: wp(3.5),
    color: '#ff0000',
    marginTop: hp(1),
    marginLeft: wp(4),
    textAlign: 'center',
  },
});

export default Schedule;
