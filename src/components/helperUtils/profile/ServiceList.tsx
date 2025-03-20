/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomButton from '../../common/buttons/CustomButton';
import {ThemeContext} from '../theme/ThemeContext';

const services = [
  {id: '1', title: 'Business Cards', price: 220},
  {id: '2', title: 'Flyers', price: 150},
  {id: '3', title: 'Posters', price: 300},
  {id: '4', title: 'Logos', price: 500},
  {id: '5', title: 'Business Cards', price: 220},
  {id: '6', title: 'Flyers', price: 150},
  {id: '7', title: 'Posters', price: 300},
  {id: '8', title: 'Logos', price: 500},
];

const ServiceList = () => {
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={[styles.card, {backgroundColor: theme.backgroundColor}]}>
            <Image
              source={require('../../../assets/images/Orders.png')}
              style={styles.image}
            />
            <View style={styles.details}>
              <Text style={[styles.title, {color: theme.input}]}>
                {item.title}
              </Text>
              <Text style={styles.price}>$ {item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.button, styles.editButton]}>
                <Text style={[styles.buttonText, {color: '#03A7A7'}]}>
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.deleteButton]}>
                <Text style={[styles.buttonText, {color: '#EB001B'}]}>Del</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <CustomButton title="Add new service" onPress={() => {}} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures full-screen usage
    paddingBottom: wp(5),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: wp(3),
    borderRadius: wp(3),
    marginBottom: hp(2),
  },
  image: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(2),
    marginRight: wp(3),
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#FF00A7',
  },
  button: {
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(3),
    borderRadius: wp(2),
    marginLeft: wp(2),
  },
  editButton: {
    backgroundColor: '#03A7A733',
  },
  deleteButton: {
    backgroundColor: '#EB001B33',
  },
  buttonText: {
    fontSize: wp(3.5),
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default ServiceList;
