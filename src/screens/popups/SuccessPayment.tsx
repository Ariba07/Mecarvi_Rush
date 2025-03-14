import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import CustomButton from '../../components/common/buttons/CustomButton';
import Success from '../../assets/images/Success.svg';

const Receipt: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Static booking details (you can pass these as props or fetch from state/context)
  const bookingDetails = {
    pickupDate: '11 Jan 2025',
    pickupTime: '10:30 AM',
    to: 'Business',
    deliveryDate: '26 July 2025',
    total: '$ 25.00',
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Success width={wp(20)} height={wp(20)} />
        </View>
        <Text style={styles.title}>Thank You!</Text>

        {/* Booking Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{bookingDetails.pickupDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{bookingDetails.pickupTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>To</Text>
            <Text style={styles.detailValue}>{bookingDetails.to}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>
              {bookingDetails.deliveryDate}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>{bookingDetails.total}</Text>
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
    backgroundColor: '#F4F7FA', // Light background as per image
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
    color: '#FF00A7', // Pink color for total as per image
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
