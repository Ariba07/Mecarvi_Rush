/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Watch from '../../../assets/images/Watch.svg';
import {ThemeContext} from '@/context/ThemeContext';
import CustomButton from '../../common/buttons/CustomButton';

const AboutUs = () => {
  const {theme} = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      {/* About Us Section */}
      <View
        style={[styles.aboutCard, {backgroundColor: theme.backgroundColor}]}>
        <Text style={[styles.heading, {color: theme.input}]}>About Us</Text>
        <Text style={[styles.description, {color: theme.text}]}>
          Creative Ink Solutions is a leading printing service provider
          specializing in business cards, flyers, T-shirts, and signages. We
          ensure top-quality designs and printing solutions to help businesses
          stand out!
        </Text>
      </View>

      {/* Working Hours Section */}
      <View style={styles.workingHours}>
        <View style={styles.sectionTitle}>
          <Watch />
          <Text style={[styles.workingHoursHeading, {color: theme.text}]}>
            {' '}
            Working Hours
          </Text>
        </View>

        <View style={styles.timeRow}>
          <FontAwesome name="circle" size={wp(2)} color="green" />
          <Text style={styles.openText}> Open:</Text>
          <Text style={[styles.timeText, {color: theme.text}]}>
            {' '}
            Monday - Friday: 9:00 AM - 6:00 PM
          </Text>
        </View>

        <View style={styles.timeRow}>
          <FontAwesome name="circle" size={wp(2)} color="red" />
          <Text style={styles.closedText}> Closed:</Text>
          <Text style={[styles.timeText, {color: theme.text}]}>
            Saturday - Sunday
          </Text>
        </View>
      </View>

      <View style={{bottom: hp(5), position: 'absolute', alignSelf: 'center'}}>
        <CustomButton title="Add new service" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(2),
  },
  aboutCard: {
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: wp(3),
  },
  heading: {
    fontSize: wp(5),
    fontWeight: 'bold',
    marginBottom: hp(1),
    color: '#333',
  },
  description: {
    fontSize: wp(4),
    color: '#555',
    lineHeight: hp(2.5),
    textAlign: 'justify',
  },
  workingHours: {
    padding: wp(4),
    borderRadius: wp(3),
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  workingHoursHeading: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#333',
    marginLeft: wp(2),
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  openText: {
    fontSize: Platform.OS === 'ios' ? wp(3.5) : wp(3.5),
    fontWeight: 'bold',
    color: 'green',
    marginLeft: wp(1.5),
  },
  closedText: {
    fontSize: Platform.OS === 'ios' ? wp(3.5) : wp(3.5),
    fontWeight: 'bold',
    color: 'red',
    marginLeft: wp(1.5),
  },
  timeText: {
    fontSize: Platform.OS === 'ios' ? wp(3.5) : wp(3.5),
    color: '#333',
    marginLeft: wp(1),
  },
});

export default AboutUs;
