/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ThemeContext} from '@/context/ThemeContext';

type Review = {
  id: string;
  name: string;
  date: string;
  reviewText: string;
  rating: number;
  image: any;
};

const reviews: Review[] = [
  {
    id: '1',
    name: 'Chris Adam',
    date: '22 January 2024, 4:11 PM',
    reviewText:
      'Customer satisfaction is our priority. Our goal is to always exceed your expectation with our quality of service so that you’ll be happy with your purchase. We accept returns on all our blank or hardware.',
    rating: 4.9,
    image: require('../../../assets/images/Orders.png'),
  },
  {
    id: '2',
    name: 'Chris Adam',
    date: '22 January 2024, 4:11 PM',
    reviewText:
      'Customer satisfaction is our priority. Our goal is to always exceed your expectation with our quality of service so that you’ll be happy with your purchase. We accept returns on all our blank or hardware.',
    rating: 4.9,
    image: require('../../../assets/images/Orders.png'),
  },
  {
    id: '3',
    name: 'Chris Adam',
    date: '22 January 2024, 4:11 PM',
    reviewText:
      'Customer satisfaction is our priority. Our goal is to always exceed your expectation with our quality of service so that you’ll be happy with your purchase. We accept returns on all our blank or hardware.',
    rating: 4.9,
    image: require('../../../assets/images/Orders.png'),
  },
];

const Reviews = () => {
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <FlatList
        data={reviews}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={styles.reviewContent}>
              <View style={styles.header}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image source={item.image} style={styles.profileImage} />
                  <View>
                    <Text style={[styles.name, {color: theme.input}]}>
                      {item.name}
                    </Text>
                    <Text style={styles.date}>{item.date}</Text>
                  </View>
                </View>
                <View style={styles.ratingContainer}>
                  <FontAwesome name="star" size={wp(3.5)} color="#fff" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
              <Text style={[styles.reviewText, {color: theme.text}]}>
                {item.reviewText}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={{paddingBottom: hp(5)}} // Already present
        showsVerticalScrollIndicator={false} // Already present
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: wp(3),
  },
  card: {
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#9c9c9c',
    marginHorizontal: wp(3),
  },
  profileImage: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(2),
    marginRight: wp(3),
  },
  reviewContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: wp(3),
    color: '#777',
    marginVertical: hp(0.5),
  },
  reviewText: {
    fontSize: wp(3.5),
    color: '#444',
    lineHeight: hp(2.5),
    textAlign: 'justify',
    marginTop: wp(2),
  },
  ratingContainer: {
    backgroundColor: '#03A7A7',
    borderRadius: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2),
  },
  ratingText: {
    fontSize: wp(3.5),
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: wp(1),
  },
});

export default Reviews;
