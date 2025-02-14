/* eslint-disable react-native/no-inline-styles */
// screens/Subscription.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
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

const plans = [
  {
    id: 'basic',
    title: 'Basic Plan',
    price: '$0.00/month',
    features: ['Limited orders per month', 'Access to basic features'],
  },
  {
    id: 'premium',
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
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={{flexGrow: 1}}>
          <Header
            title="Subscription"
            onBackPress={() => navigation.navigate('Dashboard')}
          />
          <View>
            <Text style={styles.heading}>Choose Your Plan</Text>
            {plans.map(plan => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.card,
                  selectedPlan === plan.id && styles.selectedCard,
                ]}
                onPress={() => setSelectedPlan(plan.id)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.planTitle}>{plan.title}</Text>
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
          </View>
        </View>

        <CustomButton
          title="Choose Plan"
          onPress={() => console.log('Plan chosen')}
        />
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
    paddingBottom: Platform.select({
      ios: hp(4),
      android: hp(8),
    }),
  },
  heading: {
    fontSize: Platform.select({
      ios: wp(6.5), // Slightly larger font size for iOS
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
});

export default Subscription;
