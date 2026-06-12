/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {ThemeContext} from '../../context/ThemeContext';
import {PaymentOption} from '../../types/navigation';
import {styles} from '../../assets/styles/checkout/CheckoutStyles';

interface PaymentOptionsProps {
  paymentOptions: PaymentOption[];
  selectedPayment: string;
  onSelectPayment: (id: string) => void;
  orderPrice: number;
  wallet: number;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  paymentOptions,
  selectedPayment,
  onSelectPayment,
  orderPrice,
  wallet,
}) => {
  const {theme} = React.useContext(ThemeContext);

  return (
    <View style={styles.paymentSection}>
      <View style={styles.sectionHeader}>
        <Icon name="credit-card" size={wp(8)} color="#666" />
        <View>
          <Text style={[styles.sectionTitle, {color: theme.text}]}>
            Payment Option
          </Text>
          <Text style={[styles.sectionSubtitle, {color: theme.text}]}>
            Select Your Preferred Payment mode
          </Text>
        </View>
      </View>
      {paymentOptions.map(option => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.paymentOption,
            selectedPayment === option.id && styles.selectedPaymentOption,
            {backgroundColor: theme.backgroundColor},
            option.id === 'wallet' && wallet < orderPrice && {opacity: 0.5},
          ]}
          onPress={() => onSelectPayment(option.id)}
          disabled={option.id === 'wallet' && wallet < orderPrice}>
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
          <Text style={[styles.paymentText, {color: theme.input}]}>
            {option.label}
          </Text>
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
  );
};

export default PaymentOptions;
