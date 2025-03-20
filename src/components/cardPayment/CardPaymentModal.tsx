/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  View,
  Text,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {CardField, useStripe} from '@stripe/stripe-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ThemeContext} from '../helperUtils/theme/ThemeContext';

interface CardPaymentBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (paymentMethodId: string) => void;
  subscriptionDetails?: {
    planName: string;
    price: number;
    billingFrequency: string;
  };
}

const CardPaymentBottomSheet: React.FC<CardPaymentBottomSheetProps> = ({
  isVisible,
  onClose,
  onSubmit,
  subscriptionDetails = {
    planName: 'Basic Plan',
    price: 9.99,
    billingFrequency: 'Monthly',
  },
}) => {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const {theme} = useContext(ThemeContext);

  const handlePayment = async () => {
    if (!stripe) {
      Alert.alert('Error', 'Stripe is not initialized');
      return;
    }

    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please enter complete card details.');
      return;
    }

    setLoading(true);

    try {
      const {paymentMethod, error} = await stripe.createPaymentMethod({
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            name: 'John Doe', // Replace with dynamic user name if available
          },
        },
      });

      if (error) {
        Alert.alert('Error', error.message || 'Payment method creation failed');
        setLoading(false);
        return;
      }

      if (paymentMethod?.id) {
        onSubmit(paymentMethod.id); // Pass payment method ID to create subscription on backend
        console.log(paymentMethod.id);
      }
      onClose();
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: theme.backgroundColor},
            ]}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              keyboardShouldPersistTaps="handled">
              <View style={styles.contentContainer}>
                <View style={styles.headerContainer}>
                  <Image
                    source={{
                      uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1200px-Stripe_Logo%2C_revised_2016.svg.png', // Example Stripe logo URL
                    }}
                    style={styles.stripeLogo}
                  />
                </View>
                <View style={styles.divider} />
                <View style={{paddingHorizontal: wp(3)}}>
                  <View
                    style={[
                      styles.subscriptionDetails,
                      {backgroundColor: theme.text},
                    ]}>
                    <Text style={[styles.detailText, {color: theme.input}]}>
                      Plan: {subscriptionDetails.planName}
                    </Text>
                    <Text style={[styles.detailText, {color: theme.input}]}>
                      Price: ${subscriptionDetails.price.toFixed(2)} /{' '}
                      {subscriptionDetails.billingFrequency}
                    </Text>
                  </View>
                  <CardField
                    postalCodeEnabled={false}
                    placeholders={{
                      number: 'Card Number',
                    }}
                    cardStyle={{
                      backgroundColor: theme.whole,
                      textColor: theme.input,
                      placeholderColor: '#A9A9A9',
                      borderWidth: 1,
                      borderColor: '#CCCCCC',
                      borderRadius: 10,
                    }}
                    style={{
                      height: hp(6),
                      marginVertical: hp(2),
                    }}
                    onCardChange={details => setCardDetails(details)}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  {loading ? (
                    <ActivityIndicator size="large" color="#FF0080" />
                  ) : (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={handlePayment}>
                      <Text style={styles.buttonText}>Subscribe</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onClose}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent overlay
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: wp(5),
    paddingVertical: wp(2),
    borderColor: '#cccccc',
    borderWidth: 1,
    alignSelf: 'center',
    width: wp(90),
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: hp(3),
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripeLogo: {
    width: wp(17),
    height: hp(3),
  },
  title: {
    fontSize: wp(6),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginVertical: hp(2),
  },
  subscriptionDetails: {
    marginVertical: hp(1),
    padding: wp(3),
    backgroundColor: '#f9f9f9',
    borderRadius: wp(2),
  },
  detailText: {
    fontSize: wp(4),
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#30a7a7',
    borderRadius: wp(2),
    alignItems: 'center',
    width: wp('30%'),
    paddingVertical: wp(2),
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp(4.5),
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderRadius: wp(2),
    alignItems: 'center',
    borderColor: '#30a7a7',
    borderWidth: 2,
    width: wp('30%'),
    paddingVertical: wp(2),
  },
  cancelText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: wp(4.5),
  },
});

export default CardPaymentBottomSheet;
