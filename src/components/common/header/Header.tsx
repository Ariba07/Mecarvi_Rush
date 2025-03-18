import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ThemeContext} from '../../helperUtils/theme/ThemeContext';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({title, onBackPress}) => {
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme

  return (
    <View style={styles.container}>
      {onBackPress ? (
        <TouchableOpacity onPress={onBackPress} style={styles.iconBackground}>
          <Icon
            name="chevron-left"
            size={wp(5)}
            color={theme.header}
            type="feather"
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      <Text style={[styles.title, {color: theme.header}]}>{title}</Text>

      {/* Placeholder for spacing when no back button exists */}
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? hp(1) : hp(5), // More height for iOS (status bar)
    width: '100%',
    paddingBottom: hp(2),
  },
  iconBackground: {
    backgroundColor: 'rgba(0, 166, 166, 0.1)',
    width: wp(8),
    height: wp(8),
    borderRadius: wp(2), // Makes it circular
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: wp(5.2), // Responsive text size
    fontWeight: 'bold',
    textAlign: 'center',
  },
  placeholder: {
    width: wp(8), // Ensures title remains centered
  },
});

export default Header;
