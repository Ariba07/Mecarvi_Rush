import {
  View,
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/common/header/Header';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {CheckCircle, Circle} from 'react-native-feather';
import {trackingSteps} from '../tracking/Tracking';

const OrderDetails: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="View Order" onBackPress={() => navigation.goBack()} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {trackingSteps.map((item, index) => (
            <View key={item.id} style={styles.stepContainer}>
              {/* Icon with background */}
              <View
                style={[styles.iconContainer, {backgroundColor: item.bgColor}]}>
                {item.icon}
              </View>

              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>{item.status}</Text>
                <Text style={styles.stepTime}>{item.time}</Text>
              </View>

              {item.completed ? (
                <CheckCircle color="green" width={20} height={20} />
              ) : (
                <Circle color="gray" width={20} height={20} />
              )}
              {index !== trackingSteps.length - 1 && (
                <View style={styles.progressLine} />
              )}
            </View>
          ))}
          {/* Order Summary */}
          <View style={styles.orderSummaryContainer}>
            <Text style={styles.orderNumber}>#112233</Text>
            <Text style={styles.orderTitle}>Brochure</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>Delivery</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Pickup</Text>
              <Text style={styles.value}>11 Jan 2025, 10:30 AM</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>B 250 Basket Street</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Delivery</Text>
              <Text style={styles.value}>11 Jan 2025, 10:30 AM</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>B 250 Basket Street</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Sub Total</Text>
              <Text style={styles.value}>$24.00</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Delivery</Text>
              <Text style={styles.value}>$1.00</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>$25.00</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6), // Slightly more padding on iOS
      android: wp(5),
    }),
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2.5),
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  stepTime: {
    fontSize: wp(3),
    color: 'gray',
  },
  progressLine: {
    position: 'absolute',
    right: wp(2.2),
    top: Platform.OS === 'ios' ? wp(10) : wp(11.5),
    width: 2,
    height: Platform.OS === 'ios' ? hp(7.5) : hp(9),
    borderLeftColor: '#cccccc',
    borderLeftWidth: 1,
  },
  iconContainer: {
    width: Platform.OS === 'ios' ? wp(15) : wp(18),
    height: Platform.OS === 'ios' ? wp(15) : wp(18),
    borderRadius: wp(2.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  orderSummaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: wp(5),
    marginVertical: hp(2),
  },
  orderNumber: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(1.5),
  },
  orderTitle: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#E91E63',
    marginBottom: hp(1.5),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
  },
  label: {fontSize: wp(4), color: 'gray'},
  value: {fontSize: wp(4), fontWeight: 'bold', color: '#333'},
  divider: {height: 1, backgroundColor: '#ccc', marginVertical: hp(1)},
  totalLabel: {fontSize: wp(4.5), fontWeight: 'bold'},
  totalValue: {fontSize: wp(4.5), fontWeight: 'bold', color: '#E91E63'},
});

export default OrderDetails;
