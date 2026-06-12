import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import Header from '../../components/common/header/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../context/ThemeContext';
import {apiHelper} from '../../services/api';
import {useDispatch} from 'react-redux';
import {setMarketPlaceUuid} from '../../store/authSlice';

type Prop = RouteProp<RootStackParamList, 'MarketPlace'>;

// Define the type for our provider based on the actual API response
interface BusinessProvider {
  service_provider_uuid: string;
  service_provider_user_uuid: string;
  id: number;
  service_provider_name: string;
  logo: string;
  address: string;
  price: string;
  marketplace_uuid: string;
}

const MarketPlace: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Prop>();
  const {productId} = route.params;
  const {theme} = useContext(ThemeContext);
  const [providers, setProviders] = useState<BusinessProvider[]>([]);
  const dispatch = useDispatch();

  // Fetch providers when component mounts
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await apiHelper({
          method: 'GET',
          endpoint: `marketplace/product/${productId}`,
        });

        // Map API response to our required format
        const mappedProviders = (response as {data: any[]}).data.map(
          (item: any) => ({
            service_provider_uuid: item.service_provider_uuid,
            marketplace_uuid: item.marketplace_uuid,
            id: item.id,
            service_provider_name: item.service_provider_name,
            logo: item.logo,
            address: item.address,
            price: `$ ${parseFloat(item.price).toFixed(2)}`,
            service_provider_user_uuid: item.service_provider_user_uuid,
          }),
        );

        setProviders(mappedProviders);
      } catch (error) {
        console.warn('Error fetching providers:', error);
      }
    };
    fetchProviders();
  }, [productId]);

  const renderProviderItem = ({item}: {item: BusinessProvider}) => (
    <TouchableOpacity
      style={[styles.providerCard, {backgroundColor: theme.backgroundColor}]}
      onPress={() => {
        if (item.service_provider_user_uuid) {
          navigation.navigate('ShopProfile', {
            fromBid: false,
            providerId: item.service_provider_user_uuid,
            shopUuid: item.service_provider_uuid,
          });
          dispatch(setMarketPlaceUuid(item.marketplace_uuid));
        } else {
          console.warn('Provider ID is undefined');
        }
      }}>
      <Image
        source={{uri: item.logo}}
        style={styles.providerImage}
        resizeMode="cover"
      />
      <View style={styles.providerInfo}>
        <Text style={[styles.providerName, {color: theme.text}]}>
          {item.service_provider_name}
        </Text>
        <Text style={[styles.address, {color: theme.text}]}>
          Address: {item.address}
        </Text>

        <View style={styles.row}>
          <Text style={[styles.price, {color: theme.input}]}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header title={'MarketPlace'} onBackPress={() => navigation.goBack()} />

        <View style={styles.subtitleContainer}>
          <Icon name="store" size={wp(5)} color="#666" />
          <Text style={styles.subtitle}>
            Select Your Preferred business provider
          </Text>
        </View>

        <FlatList
          data={providers}
          renderItem={renderProviderItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No providers found</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  subtitle: {
    fontSize: wp(4),
    color: '#666',
    marginLeft: wp(2),
  },
  listContainer: {
    paddingBottom: hp(2),
  },
  providerCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: wp(2),
    marginBottom: hp(2),
    alignItems: 'center',
  },
  providerImage: {
    width: wp(15),
    height: wp(15),
    borderRadius: 10,
  },
  providerInfo: {
    flex: 1,
    marginLeft: wp(3),
  },
  providerName: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#333',
  },
  address: {
    fontSize: wp(3),
    color: '#666',
    marginTop: hp(0.5),
  },
  deliveryDate: {
    fontSize: wp(3),
    color: '#666',
    marginTop: hp(0.5),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.5),
  },
  ratingText: {
    fontSize: wp(3),
    color: '#666',
    marginLeft: wp(1),
  },
  price: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#000',
    marginTop: hp(0.5),
  },
  acceptButton: {
    backgroundColor: '#00cec9',
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
  },
  acceptButtonText: {
    fontSize: wp(3.5),
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(0.5),
  },
  emptyText: {
    fontSize: wp(4),
    color: '#666',
    textAlign: 'center',
    marginTop: hp(5),
  },
});

export default MarketPlace;
