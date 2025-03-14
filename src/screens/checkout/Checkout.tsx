/* eslint-disable react-native/no-inline-styles */
import {
  View,
  SafeAreaView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image, // Added for displaying logo images
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For credit card icon in header
import CustomButton from '../../components/common/buttons/CustomButton';

interface PaymentOption {
  id: string;
  label: string;
  logoUrl: string; // Changed from `icon` to `logoUrl`
  selected: boolean;
  balance?: string; // Optional for Wallet
}

const Checkout: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // State to manage selected payment option
  const [selectedPayment, setSelectedPayment] =
    React.useState<string>('paypal');

  // Payment options data with logo URLs
  const paymentOptions: PaymentOption[] = [
    {
      id: 'paypal',
      label: 'Paypal',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PayPal_logo.svg/1200px-PayPal_logo.svg.png', // Example PayPal logo URL
      selected: true,
    },
    {
      id: 'stripe',
      label: 'Stripe',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1200px-Stripe_Logo%2C_revised_2016.svg.png', // Example Stripe logo URL, // Official Stripe logo
      selected: false,
    },
    {
      id: 'wallet',
      label: 'Wallet',
      logoUrl: 'https://img.icons8.com/color/48/000000/wallet.png', // Generic wallet icon from Icons8
      selected: false,
      balance: '$5.00',
    },
  ];

  // Handle payment option selection
  const handleSelectPayment = (id: string) => {
    setSelectedPayment(id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Checkout" onBackPress={() => navigation.goBack()} />

        {/* Payment Option Section */}
        <View style={styles.paymentSection}>
          <View style={styles.sectionHeader}>
            <Icon name="credit-card" size={wp(8)} color="#666" />
            <View>
              <Text style={styles.sectionTitle}>Payment Option</Text>
              <Text style={styles.sectionSubtitle}>
                Select Your Preferred Payment mode
              </Text>
            </View>
          </View>

          {/* Payment Options */}
          {paymentOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.paymentOption,
                selectedPayment === option.id && styles.selectedPaymentOption,
              ]}
              onPress={() => handleSelectPayment(option.id)}>
              <View
                style={[
                  styles.radioCircle,
                  {
                    borderColor:
                      selectedPayment === option.id ? '#FF00A7' : '#333333',
                    borderWidth: 1,
                  },
                ]}>
                {selectedPayment === option.id && (
                  <View style={styles.selectedRadio} />
                )}
              </View>
              <Text style={styles.paymentText}>{option.label}</Text>
              {option.balance ? (
                <View style={styles.balanceContainer}>
                  <Text style={styles.balanceText}>{option.balance}</Text>
                </View>
              ) : (
                <Image
                  source={{uri: option.logoUrl}}
                  style={styles.paymentLogo}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
        {/* Pay Now Button */}
        <View style={styles.payButton}>
          <CustomButton
            title="Pay Now"
            onPress={() => {
              navigation.navigate('Receipt');
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
  paymentSection: {
    marginTop: hp(2),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(4),
    gap: wp(3),
  },
  sectionTitle: {
    fontSize: wp(5),
    color: '#666',
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: wp(3.5),
    color: '#999',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: wp(2),
    marginBottom: hp(1.5),
  },
  selectedPaymentOption: {
    borderWidth: 1,
    borderColor: '#FF00A7', // Pink border for selected option
  },
  radioCircle: {
    height: wp(5),
    width: wp(5),
    borderRadius: wp(2.5),
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
  },
  selectedRadio: {
    height: wp(3),
    width: wp(3),
    borderRadius: wp(1.5),
    backgroundColor: '#FF00A7', // Pink fill for selected
  },
  paymentText: {
    fontSize: wp(4),
    color: '#333',
    flex: 1,
  },
  paymentLogo: {
    width: wp(15), // Adjust size as needed
    height: wp(5),
    marginLeft: wp(2),
  },
  balanceContainer: {
    backgroundColor: '#FF00A71A',
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
  },
  balanceText: {
    fontSize: wp(3.5),
    color: '#FF00A7',
    fontWeight: 'bold',
  },
  payButton: {
    position: 'absolute',
    bottom: Platform.select({ios: hp(4), android: hp(8)}),
    left: Platform.select({ios: wp(6), android: wp(5)}),
    right: Platform.select({ios: wp(6), android: wp(5)}),
  },
});

export default Checkout;
