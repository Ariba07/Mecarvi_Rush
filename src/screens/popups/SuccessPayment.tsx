import React, {useContext} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import CustomButton from '../../components/common/buttons/CustomButton';
import Success from '../../assets/images/Success.svg';
import {ThemeContext} from '../../context/ThemeContext';
import {useSelector} from 'react-redux';
import {selectTotalPrice} from '../../store/authSlice';

const Receipt: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const total = useSelector(selectTotalPrice);

  // Get current date and time
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }); // e.g., "09 Apr 2025"
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }); // e.g., "03:55 AM"

  // Static booking details with current date and time
  const bookingDetails = {
    pickupDate: formattedDate, // Use current date
    pickupTime: formattedTime, // Use current time
    total: total,
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.whole}]}>
      <View style={[styles.card, {backgroundColor: theme.backgroundColor}]}>
        <View style={styles.iconContainer}>
          <Success width={wp(20)} height={wp(20)} />
        </View>
        <Text style={[styles.title, {color: theme.input}]}>Thank You!</Text>

        {/* Booking Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, {color: theme.text}]}>Date</Text>
            <Text style={[styles.detailValue, {color: theme.input}]}>
              {bookingDetails.pickupDate}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, {color: theme.text}]}>Time</Text>
            <Text style={[styles.detailValue, {color: theme.input}]}>
              {bookingDetails.pickupTime}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, {color: theme.text}]}>TOTAL</Text>
            <Text style={styles.totalValue}>$ {bookingDetails.total}</Text>
          </View>
        </View>
      </View>

      {/* Back to Home Button */}
      <View style={styles.payButton}>
        <CustomButton
          title="Back to Home"
          onPress={() => {
            navigation.replace('Drawer');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: wp(85),
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: wp(5),
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: -hp(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#000000',
    marginTop: hp(2),
    textAlign: 'center',
  },
  detailsContainer: {
    width: '100%',
    marginTop: hp(2),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  detailLabel: {
    fontSize: wp(4),
    color: '#666',
  },
  detailValue: {
    fontSize: wp(4),
    color: '#000',
  },
  totalValue: {
    fontSize: wp(4),
    color: '#FF00A7',
    fontWeight: 'bold',
  },
  divider: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: hp(2),
  },
  payButton: {
    position: 'absolute',
    bottom: Platform.select({ios: hp(4), android: hp(4)}),
    left: Platform.select({ios: wp(6), android: wp(5)}),
    right: Platform.select({ios: wp(6), android: wp(5)}),
  },
});

export default Receipt;
