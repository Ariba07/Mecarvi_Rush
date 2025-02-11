import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({title, onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#03A7A7',
    paddingVertical: Platform.OS === 'ios' ? hp(1) : hp(1.5), // iOS has slightly more padding
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
    width: wp(80), // iOS button is slightly narrower
    height: Platform.OS === 'ios' ? hp(4.5) : hp(5.7), // iOS button is slightly taller
    alignSelf: 'center',
  },
  text: {
    color: '#fff',
    fontSize: Platform.OS === 'ios' ? wp(4.7) : wp(4.5), // Slightly larger text for iOS
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default CustomButton;
