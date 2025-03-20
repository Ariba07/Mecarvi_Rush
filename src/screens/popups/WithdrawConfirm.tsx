import React, {useContext} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import CustomButton from '../../components/common/buttons/CustomButton'; // Assuming this exists
import Success from '../../assets/images/Success.svg';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

const WithdrawConfirm = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme

  const handleGotIt = () => {
    // Add your logic here (e.g., navigate back or to another screen)
    console.log('Got it pressed');
    navigation.replace('Drawer');
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <View
          style={[
            styles.successCard,
            {backgroundColor: theme.backgroundColor},
          ]}>
          <View style={styles.iconContainer}>
            <Success width={wp(20)} height={wp(20)} />
          </View>
          <Text style={[styles.successTitle, {color: theme.input}]}>
            Wooohoo, money!
          </Text>
          <Text style={styles.successMessage}>
            Your funds should arrive within 1 business day.
          </Text>
          <CustomButton title="Got it" onPress={handleGotIt} />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Success Card
  successCard: {
    backgroundColor: '#fff',
    padding: wp(6),
    borderRadius: wp(3),
    alignItems: 'center',
    marginBottom: hp(4),
  },
  iconContainer: {
    marginTop: -hp(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#333',
    marginVertical: hp(2),
  },
  successMessage: {
    fontSize: wp(4),
    color: '#777',
    textAlign: 'center',
    marginVertical: hp(2),
  },
  // Button Container
  buttonContainer: {
    position: 'absolute',
    bottom: Platform.select({ios: hp(4), android: hp(8)}),
    left: Platform.select({ios: wp(6), android: wp(5)}),
    right: Platform.select({ios: wp(6), android: wp(5)}),
  },
});

export default WithdrawConfirm;
