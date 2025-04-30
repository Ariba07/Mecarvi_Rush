import React, {useContext} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import SupportIcon from '../../assets/images/Support.svg';
import MailIcon from '../../assets/images/Mail.svg';
import {Icon} from 'react-native-elements';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

const Support = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header
          title="Customer Support"
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.iconContainer}>
          <SupportIcon width={wp(35)} height={wp(35)} />
        </View>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: theme.backgroundColor}]}
          onPress={() => navigation.navigate('AllTicket')}>
          <View style={styles.buttonContent}>
            <MailIcon width={wp(5)} height={wp(5)} />
            <Text style={[styles.buttonText, {color: theme.text}]}>
              Sent us a message
            </Text>
          </View>
          <Icon
            name="chevron-forward"
            color={theme.text}
            size={wp(4)}
            type="ionicon"
          />
        </TouchableOpacity>
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
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: hp(8),
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(4),
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: wp(4),
    fontWeight: '500',
    marginLeft: wp(3),
    color: '#333',
  },
});

export default Support;
