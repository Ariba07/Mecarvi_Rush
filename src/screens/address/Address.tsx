/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  RefreshControl,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Header from '../../components/common/header/Header';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Svg, Circle} from 'react-native-svg';
import {apiHelper} from '../../services/api';
import AddressCreate from '../../components/common/address/AddressCreate';
import {ThemeContext} from '../../context/ThemeContext';
import {useDispatch} from 'react-redux';
import {
  setAddressId,
  setDefaultAddressDetails,
  setDeliveryAddressDetails,
} from '../../store/authSlice';

type AddressRouteProp = RouteProp<RootStackParamList, 'Address'>;

const Address = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const {theme} = useContext(ThemeContext);
  const dispatch = useDispatch();
  const route = useRoute<AddressRouteProp>();
  const forDelivery = route.params?.forDelivery ?? false;

  const fetchAddress = async () => {
    try {
      const response = await apiHelper({
        method: 'GET',
        endpoint: 'user-addresses',
      });
      const data = response as {data: any[]};
      if (data.data && Array.isArray(data.data)) {
        setAddresses(data.data);
      } else {
        setAddresses([]);
      }
    } catch (error: any) {
      setAddresses([]);
    }
  };

  useEffect(() => {
    const defaultAddress = addresses.find(item => item.is_default);
    if (defaultAddress) {
      setSelectedId(defaultAddress.user_address_uuid);
      dispatch(
        setDefaultAddressDetails({
          city: defaultAddress.city || '',
          country: defaultAddress.country || '',
        }),
      );
    }
  }, [addresses, dispatch]);

  useEffect(() => {
    fetchAddress();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAddress();
    setRefreshing(false);
  };

  const updateDefaultAddress = async (
    addressUuid: string,
    addressId: number,
  ) => {
    try {
      const addressToUpdate = addresses.find(
        item => item.user_address_uuid === addressUuid,
      );
      if (!addressToUpdate) {
        throw new Error('Address not found');
      }

      const updatedAddresses = addresses.map(item => ({
        ...item,
        is_default: item.user_address_uuid === addressUuid,
      }));
      setAddresses(updatedAddresses);
      setSelectedId(addressUuid);

      if (forDelivery) {
        dispatch(
          setDeliveryAddressDetails({
            city: addressToUpdate.city,
            country: addressToUpdate.country,
          }),
        );
        dispatch(setAddressId(addressId));
      } else {
        dispatch(
          setDefaultAddressDetails({
            city: addressToUpdate.city,
            country: addressToUpdate.country,
          }),
        );
      }

      const payload = {
        user_id: addressToUpdate.user_id,
        address: addressToUpdate.address,
        city: addressToUpdate.city,
        state: addressToUpdate.state,
        zip_code: addressToUpdate.zip_code,
        country: addressToUpdate.country,
        latitude: addressToUpdate.latitude,
        longitude: addressToUpdate.longitude,
        is_default: true,
      };

      const response = (await apiHelper({
        method: 'PATCH',
        endpoint: `user-address/${addressUuid}?_method=patch`,
        data: payload,
      })) as {status: number; message?: string};

      if (response.status !== 1) {
        throw new Error(
          (response as {message?: string})?.message ||
            'Failed to update default address',
        );
      }

      const otherAddresses = addresses.filter(
        item => item.user_address_uuid !== addressUuid,
      );
      await Promise.all(
        otherAddresses.map(async item => {
          const otherPayload = {
            user_id: item.user_id,
            address: item.address,
            city: item.city,
            state: item.state,
            zip_code: item.zip_code,
            country: item.country,
            latitude: item.latitude,
            longitude: item.longitude,
            is_default: false,
          };
          await apiHelper({
            method: 'PATCH',
            endpoint: `user-address/${item.user_address_uuid}?_method=patch`,
            data: otherPayload,
          });
        }),
      );
    } catch (error: any) {
      const originalAddresses = addresses.map(item => ({
        ...item,
        is_default: item.user_address_uuid === selectedId,
      }));
      setAddresses(originalAddresses);
      setSelectedId(selectedId);
    }
  };

  const handleSelectAddress = (addressUuid: string, addressId: number) => {
    updateDefaultAddress(addressUuid, addressId);
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const isSelected = item.user_address_uuid === selectedId;
    const fullAddress = `${item.address}, ${item.city}, ${item.state} ${item.zip_code}, ${item.country}`;

    return (
      <Animatable.View
        animation="fadeInUp"
        duration={800}
        delay={300 + index * 200}>
        <TouchableOpacity
          style={[
            styles.card,
            isSelected && styles.selectedCard,
            {backgroundColor: theme.backgroundColor},
          ]}
          onPress={() => handleSelectAddress(item.user_address_uuid, item.id)}>
          <View style={styles.cardContent}>
            <View>
              <Text style={[styles.title, {color: theme.text}]}>
                {item.city}, {item.country}
              </Text>
              <Text style={[styles.address, {color: theme.text}]}>
                {fullAddress}
              </Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#03a7a7',
                width: wp(5.5),
                alignItems: 'center',
                borderRadius: wp(8),
                height: wp(5.5),
                justifyContent: 'center',
              }}>
              <Svg height={20} width={20}>
                <Circle
                  cx={10}
                  cy={10}
                  r={5}
                  strokeWidth={1}
                  fill={isSelected ? '#03A7A7' : 'transparent'}
                />
              </Svg>
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Animatable.View animation="fadeInDown" duration={1000}>
          <Header
            title={'Delivery Address'}
            onBackPress={() => navigation.goBack()}
          />
        </Animatable.View>
        <FlatList
          data={addresses}
          renderItem={renderItem}
          keyExtractor={item => item.user_address_uuid}
          contentContainerStyle={{paddingBottom: hp(5)}}
          ListEmptyComponent={
            <Animatable.Text
              animation="fadeIn"
              duration={800}
              delay={300}
              style={styles.emptyText}>
              No Address found
            </Animatable.Text>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#03A7A7']}
              tintColor="#03A7A7"
            />
          }
        />
        <Animatable.View animation="pulse" iterationCount={1} duration={1000}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}>
            <Text style={[styles.addButtonText, {color: theme.text}]}>
              Add New Location
            </Text>
          </TouchableOpacity>
        </Animatable.View>
        <Animatable.View
          animation={modalVisible ? 'fadeInUp' : 'fadeOutDown'}
          duration={300}>
          <AddressCreate
            visible={modalVisible}
            onClose={() => {
              setModalVisible(false);
              fetchAddress();
            }}
          />
        </Animatable.View>
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
    borderRadius: wp(2),
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
    width: wp(70),
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#03A7A7',
    paddingVertical: Platform.OS === 'ios' ? hp(1) : hp(1.5),
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
    width: wp(80),
    height: Platform.OS === 'ios' ? hp(4.5) : hp(5.7),
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#333',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: wp(6),
    color: '#FF00A7',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Address;
