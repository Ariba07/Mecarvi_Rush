import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import Header from '../../components/common/header/Header';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Svg, Circle} from 'react-native-svg';

const addresses = [
  {
    id: '1',
    title: 'New York, USA',
    address: '217/C East Road',
    phone: '+92 3334560987',
  },
  {
    id: '2',
    title: 'New York, USA',
    address: '217/C East Road',
    phone: '+92 3334560987',
  },
  {
    id: '3',
    title: 'New York, USA',
    address: '217/C East Road',
    phone: '+92 3334560987',
  },
  {
    id: '4',
    title: 'New York, USA',
    address: '217/C East Road',
    phone: '+92 3334560987',
  },
];

const Address = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const renderItem = ({item}: {item: any}) => {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => setSelectedId(item.id)}>
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.address}>{item.address}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
          </View>
          <Svg height={20} width={20}>
            <Circle
              cx={10}
              cy={10}
              r={7}
              stroke="#03A7A7"
              strokeWidth={1}
              fill={isSelected ? '#03A7A7' : 'transparent'}
            />
          </Svg>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          title={'Delivery Address'}
          onBackPress={() => navigation.goBack()}
        />
        <FlatList
          data={addresses}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingBottom: hp(5)}}
        />
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add New Location</Text>
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
    paddingHorizontal: wp(5),
    paddingBottom: hp(4),
  },
  card: {
    backgroundColor: 'white',
    borderRadius: wp(3),
    padding: wp(2.5),
    marginVertical: hp(1),
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: '#03A7A7',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: wp(4.5),
    marginBottom: hp(1),
  },
  address: {
    color: '#666',
    fontSize: wp(3.5),
  },
  phone: {
    color: '#666',
    fontSize: wp(3.5),
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#03A7A7',
    paddingVertical: Platform.OS === 'ios' ? hp(1) : hp(1.5), // iOS has slightly more padding
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
    width: wp(80), // iOS button is slightly narrower
    height: Platform.OS === 'ios' ? hp(4.5) : hp(5.7), // iOS button is slightly taller
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#333',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
});

export default Address;
