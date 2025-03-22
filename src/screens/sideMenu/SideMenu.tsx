/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Edit from '../../assets/images/Edit.svg';
import Points from '../../assets/images/Points.svg';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import Settings from '../settings/Settings';

const SideMenu: React.FC = () => {
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: theme.backgroundColor}]}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={require('../../assets/images/s1.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileTextContainer}>
            <Text style={[styles.profileName, {color: theme.text}]}>
              Chris Adam
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Points />
              <Text style={styles.loyaltyText}>
                {' '}
                Loyalty Points: <Text style={styles.loyaltyPoints}>250</Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editIcon}>
            <Edit />
          </TouchableOpacity>
        </View>
        <Settings />
      </View>
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
      ios: wp(3),
      android: wp(3),
    }),
    paddingTop: Platform.select({
      ios: hp(8),
      android: hp(8),
    }),
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  profileImage: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(9),
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: wp(3),
  },
  profileName: {
    fontSize: wp(5),
    fontWeight: 'bold',
  },
  loyaltyText: {
    fontSize: wp(3.5),
    color: '#666',
  },
  loyaltyPoints: {
    color: '#FF0080',
    fontWeight: 'bold',
  },
  editIcon: {
    padding: wp(2),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    gap: wp(4),
    paddingLeft: wp(1.5),
  },
  menuText: {
    fontSize: wp(4),
  },
});

export default SideMenu;
