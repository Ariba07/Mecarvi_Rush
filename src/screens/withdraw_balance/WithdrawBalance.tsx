import React, {useContext} from 'react';
import {View, Text, StyleSheet, Platform, SafeAreaView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import CustomButton from '../../components/common/buttons/CustomButton'; // Assuming this exists
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

const WithdrawBalance = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme

  const handleWithdraw = () => {
    // Add your withdraw logic here (e.g., API call or navigation)
    console.log('Withdraw confirmed');
    navigation.navigate('WithdrawConfirm');
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        {/* Header */}
        <Header
          title="Withdraw Balance"
          onBackPress={() => navigation.goBack()}
        />

        {/* Review Message */}
        <Text style={[styles.reviewMessage, {color: theme.text}]}>
          Please review your withdrawal details.
        </Text>

        {/* Payment Details Card */}
        <View
          style={[
            styles.detailsCard,
            {backgroundColor: theme.backgroundColor},
          ]}>
          <View style={styles.detailRow}>
            <Text style={[styles.label, {color: theme.text}]}>
              PayPal account
            </Text>
            <Text style={[styles.value, {color: theme.input}]}>
              s***********4@gmail.com
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.label, {color: theme.text}]}>Amount</Text>
            <Text style={[styles.value, {color: theme.input}]}>$25.00</Text>
          </View>
        </View>

        {/* Additional Notes */}
        <Text style={styles.note}>
          You can withdraw up to $5000 at a time. Your Payment Processor may
          apply extra fees. Transfer may take up to 1 business day.
        </Text>

        {/* Withdraw Button */}
        <View style={styles.confirmButton}>
          <CustomButton title="Withdraw" onPress={handleWithdraw} />
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
  // Review Message
  reviewMessage: {
    fontSize: wp(4.5),
    color: '#333',
    marginVertical: hp(2),
  },
  // Payment Details Card
  detailsCard: {
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: wp(3),
    marginBottom: hp(2),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
  },
  label: {
    fontSize: wp(4),
    color: '#777',
  },
  value: {
    fontSize: wp(4),
    color: '#333',
    fontWeight: 'bold',
  },
  // Additional Notes
  note: {
    fontSize: wp(3.5),
    color: '#777',
    marginBottom: hp(4),
  },
  // Confirm Button
  confirmButton: {
    position: 'absolute',
    bottom: Platform.select({ios: hp(4), android: hp(8)}),
    left: Platform.select({ios: wp(6), android: wp(5)}),
    right: Platform.select({ios: wp(6), android: wp(5)}),
  },
});

export default WithdrawBalance;
