import {
  Text,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/common/header/Header';

const services = [
  {
    id: '1',
    name: 'Printing',
    image: require('../../assets/images/printing.png'),
  },
  {
    id: '2',
    name: 'Embroidery',
    image: require('../../assets/images/embroidary.png'),
  },
  {id: '3', name: 'Signage', image: require('../../assets/images/signage.png')},
  {id: '4', name: 'Signage', image: require('../../assets/images/signage.png')},
  {id: '5', name: 'Signage', image: require('../../assets/images/signage.png')},
  {id: '6', name: 'Signage', image: require('../../assets/images/signage.png')},
  {id: '7', name: 'Signage', image: require('../../assets/images/signage.png')},
];

const Service: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Services" onBackPress={() => navigation.goBack()} />
      <FlatList
        data={services}
        numColumns={3} // Ensures each row contains 3 items
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.serviceCard}>
            <Image
              source={item.image}
              style={styles.serviceImage}
              resizeMode="contain"
            />
            <Text style={styles.serviceName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
  },
  listContainer: {
    alignItems: 'center',
  },
  serviceCard: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: wp('1.5%'),
    width: wp('25%'), // Adjust width for 3 columns
    height: wp('25%'),
    justifyContent: 'center',
    margin: wp('3.5%'), // Ensure spacing between items
  },
  serviceImage: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('2%'),
  },
  serviceName: {
    marginTop: hp('1%'),
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
  },
});

export default Service;
