/* eslint-disable react-native/no-inline-styles */
import {
  View,
  SafeAreaView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For location pin icon
import CustomButton from '../../components/common/buttons/CustomButton';
import getFormattedDateTime from '../../components/helperUtils/dateTimeUtils/DateTime';

// Define interface for the formatted date and time
interface FormattedDateTime {
  date: string;
  time: string;
}

const Schedule: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [isAsap, setIsAsap] = useState<boolean>(true); // State to toggle between ASAP and Schedule

  // Get the formatted date and time
  const {date, time}: FormattedDateTime = getFormattedDateTime();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Schedule" onBackPress={() => navigation.goBack()} />

        {/* Location Section with Custom Dropdown */}
        {isAsap && (
          <TouchableOpacity style={styles.locationContainer}>
            <Icon name="location-pin" size={20} color="#FF00A7" />
            <TouchableOpacity style={styles.selectedCityContainer}>
              <Text style={styles.locationText}>{'Select a city'}</Text>
            </TouchableOpacity>
            <Icon name="arrow-drop-down" size={20} color="#000" />
          </TouchableOpacity>
        )}

        {/* ASAP or Schedule Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleOption, isAsap ? styles.selectedOption : {}]}
            onPress={() => setIsAsap(true)}>
            <View
              style={[
                styles.radioCircle,
                {borderColor: isAsap ? '#FF00A7' : '#333333', borderWidth: 1},
              ]}>
              {isAsap && <View style={styles.selectedRadio} />}
            </View>
            <Text style={styles.toggleText}>As Soon as Possible</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleOption, !isAsap ? styles.selectedOption : {}]}
            onPress={() => setIsAsap(false)}>
            <View
              style={[
                styles.radioCircle,
                {borderColor: !isAsap ? '#FF00A7' : '#333333', borderWidth: 1},
              ]}>
              {!isAsap && <View style={styles.selectedRadio} />}
            </View>
            <Text style={styles.toggleText}>Schedule an Order</Text>
          </TouchableOpacity>
        </View>

        {/* Date and Time Display */}
        <View style={styles.dateTimeContainer}>
          <Text style={styles.requestText}>Request Service On</Text>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.timeText}>{time}</Text>
        </View>

        <View style={styles.payButton}>
          <CustomButton
            title="Proceed to Pay"
            onPress={() => {
              isAsap
                ? navigation.navigate('Checkout')
                : navigation.navigate('Booking');
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
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: hp(50), // Keep the max height constraint
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dropdownList: {
    maxHeight: hp(50),
  },
  dropdownItem: {
    padding: wp(3),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: wp(4),
    color: '#000',
  },
});

export default Schedule;
