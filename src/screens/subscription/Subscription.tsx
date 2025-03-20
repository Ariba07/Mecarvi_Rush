/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/common/header/Header';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import CustomButton from '../../components/common/buttons/CustomButton';
import CardPaymentBottomSheet from '../../components/cardPayment/CardPaymentModal';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useSelector} from 'react-redux';
import {selectToken} from '../../slice/Slice';

const plans = [
  {
    id: 'free',
    title: 'Basic Plan',
    price: '$0.00/month',
    features: ['Limited orders per month', 'Access to basic features'],
  },
  {
    id: 'paid',
    title: 'Premium Plan',
    price: '$29.99/month',
    features: [
      '24/7 Priority Support',
      '30% Discount on Orders',
      'VIP Features',
    ],
  },
];

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState('free');
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme
  const token = useSelector(selectToken);
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 2000);
      return () => clearTimeout(timer); // Cleanup timer on unmount or error change
    }
  }, [errorMessage]);

  const handleSubscriptionSubmit = async (paymentMethodId: string) => {
    if (!paymentMethodId || !selectedPlan) {
      setErrorMessage('Invalid plan or payment method. Please try again.');
      return;
    }

    setErrorMessage(null);

    try {
      const response = await apiHelper({
        method: 'POST',
        endpoint: 'subscribe',
        data: {plan: selectedPlan, payment_method: paymentMethodId},
        token: token,
      });

      // Assuming apiHelper returns a JSON response or an object
      const result = (await response) as any; // Adjust based on apiHelper return type
      if (result.error) {
        throw new Error(result.error.message || 'Subscription creation failed');
      }

      const {subscriptionId} = result;
      console.log('Subscription created:', subscriptionId);
      Alert.alert('Success', 'Subscription created successfully!');
      setIsModalVisible(false); // Close modal on success
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      setErrorMessage(
        error.message ||
          'An error occurred while creating your subscription. Please try again.',
      );
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <View style={{flexGrow: 1}}>
          <Header
            title="Subscription"
            onBackPress={() => navigation.navigate('Drawer')}
          />
          <View>
            <Text style={styles.heading}>Choose Your Plan</Text>
            {plans.map(plan => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.card,
                  selectedPlan === plan.id && styles.selectedCard,
                  {backgroundColor: theme.backgroundColor},
                ]}
                onPress={() => setSelectedPlan(plan.id)}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.planTitle, {color: theme.text}]}>
                    {plan.title}
                  </Text>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                </View>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.feature}>
                    <Icon
                      name="checkbox"
                      size={wp(4.5)}
                      color="green"
                      type="ionicon"
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </TouchableOpacity>
            ))}
            {errorMessage && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}
          </View>
        </View>

        <CustomButton
          title={'Choose Plan'}
          onPress={() => setIsModalVisible(true)}
        />
      </View>
      <CardPaymentBottomSheet
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleSubscriptionSubmit}
        subscriptionDetails={{
          planName:
            plans.find(plan => plan.id === selectedPlan)?.title ||
            'Unknown Plan',
          price: selectedPlan === 'free' ? 0.0 : 29.99,
          billingFrequency: 'Monthly',
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
    paddingBottom: Platform.select({
      ios: hp(4),
      android: hp(8),
    }),
  },
  heading: {
    fontSize: Platform.select({
      ios: wp(6.5),
      android: wp(7),
    }),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF0080',
    marginBottom: Platform.select({
      ios: hp(7),
      android: hp(8),
    }),
    marginTop: Platform.select({
      ios: hp(5),
      android: hp(6),
    }),
  },
  card: {
    backgroundColor: '#FFF',
    padding: Platform.select({
      ios: wp(3),
      android: wp(2.5),
    }),
    borderRadius: wp(3),
    marginBottom: Platform.select({
      ios: hp(2.5),
      android: hp(2),
    }),
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: '#FF0080',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Platform.select({
      ios: hp(1.5),
      android: hp(1),
    }),
  },
  planTitle: {
    fontSize: Platform.select({
      ios: wp(4),
      android: wp(4.5),
    }),
    fontWeight: 'bold',
    color: '#333',
  },
  planPrice: {
    fontSize: Platform.select({
      ios: wp(4),
      android: wp(4.5),
    }),
    fontWeight: 'bold',
    color: '#00A6A6',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Platform.select({
      ios: hp(0.3),
      android: hp(0.2),
    }),
  },
  featureText: {
    marginLeft: wp(2),
    fontSize: Platform.select({
      ios: wp(3),
      android: wp(3.5),
    }),
    color: '#555',
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    padding: wp(3),
    borderRadius: wp(2),
    marginVertical: hp(2),
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3333',
    fontSize: wp(3.5),
    textAlign: 'center',
  },
});

export default Subscription;
