/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // For the credit card icon
import CustomButton from '../../components/common/buttons/CustomButton';

// Mock payment options with internet URIs for logos
const paymentOptions = [
  {
    id: '1',
    name: 'Paypal',
    logoUri:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PayPal_logo.svg/1200px-PayPal_logo.svg.png', // Example PayPal logo URL
  },
  {
    id: '2',
    name: 'Stripe',
    logoUri:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1200px-Stripe_Logo%2C_revised_2016.svg.png', // Example Stripe logo URL
  },
];

const Withdraw = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedOption, setSelectedOption] = useState('1'); // Default to Paypal

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <Header title="Withdraw" onBackPress={() => navigation.goBack()} />

        {/* Title and Subtitle */}
        <View style={styles.headerTextContainer}>
          <FontAwesome name="credit-card" size={wp(6)} color="#333" />
          <View>
            <Text style={styles.title}>Payment Option</Text>
            <Text style={styles.subtitle}>
              Select Your Preferred Payment mode
            </Text>
          </View>
        </View>

        {/* Payment Options */}
        {paymentOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              {
                borderColor:
                  selectedOption === option.id ? '#FF00A7' : undefined,
                borderWidth: selectedOption === option.id ? 1 : undefined,
              },
            ]}
            onPress={() => setSelectedOption(option.id)}>
            <View
              style={[
                styles.radioCircle,
                {
                  borderColor:
                    selectedOption === option.id ? '#FF00A7' : '#333333',
                },
              ]}>
              {selectedOption === option.id && (
                <View style={styles.radioSelected} />
              )}
            </View>
            <Text style={styles.optionText}>{option.name}</Text>
            <Image
              source={{uri: option.logoUri}}
              style={styles.optionLogo}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}

        {/* Confirm Button */}
        <View style={styles.confirmButton}>
          <CustomButton
            title="Confirm"
            onPress={() => {
              navigation.navigate('WithdrawBalance');
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
    paddingBottom: Platform.select({
      ios: hp(4),
      android: hp(8),
    }),
  },
  // Header Text Section
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(3),
    gap: wp(3),
  },
  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: wp(3.5),
    color: '#777',
  },
  // Payment Option Cards
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: wp(2),
    marginBottom: hp(2),
  },
  radioCircle: {
    height: wp(5),
    width: wp(5),
    borderRadius: wp(2.5),
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  radioSelected: {
    height: wp(2.5),
    width: wp(2.5),
    borderRadius: wp(1.25),
    backgroundColor: '#FF00A7', // Pink for selected
  },
  optionText: {
    fontSize: wp(4.5),
    color: '#333',
    flex: 1,
  },
  optionLogo: {
    width: wp(15),
    height: wp(5),
    resizeMode: 'contain',
  },
  // Confirm Button
  confirmButton: {
    position: 'absolute',
    bottom: Platform.select({ios: hp(4), android: hp(8)}),
    left: Platform.select({ios: wp(6), android: wp(5)}),
    right: Platform.select({ios: wp(6), android: wp(5)}),
  },
});

export default Withdraw;
